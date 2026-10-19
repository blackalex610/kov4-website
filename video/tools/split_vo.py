"""Split one long voiceover take (e.g. from ElevenLabs) into per-beat clips.

    python tools/split_vo.py public/audio/vo_take.mp3

Whisper word timestamps are aligned to the words in gen_vo.BEATS, so each beat
becomes public/audio/vo/<id>.wav and src/data/vo.json gets the same shape that
gen_vo.py writes (duration + per-word timings). The cue indices in
build_timeline.py keep pointing at the same words.
"""

import difflib
import json
import re
import subprocess
import sys
from pathlib import Path

import numpy as np
from faster_whisper import WhisperModel

sys.path.insert(0, str(Path(__file__).resolve().parent))
from gen_vo import BEATS, DATA, OUT_DIR, SR, THRESH, PAD_IN, PAD_OUT, write_wav  # noqa: E402


# Hand-checked cut points (seconds into the take) where Whisper's timing is too far
# off for the snap to find the right pause: {"<beat before>": cut}.
CUT_OVERRIDES = {"v08": 32.1, "v09": 34.3}


def norm(w: str) -> str:
    return re.sub(r"[^\wа-яё]", "", w.lower())


def decode(path: Path) -> np.ndarray:
    out = subprocess.run(
        ["ffmpeg", "-loglevel", "error", "-i", str(path), "-f", "f32le", "-ac", "1", "-ar", str(SR), "pipe:1"],
        capture_output=True, check=True,
    ).stdout
    return np.frombuffer(out, dtype=np.float32)


def main() -> None:
    src = Path(sys.argv[1])
    x = decode(src)

    model = WhisperModel("medium", device="cpu", compute_type="int8")
    segs, _ = model.transcribe(str(src), language="bg", beam_size=5, word_timestamps=True)
    heard = []
    for w in (w for s in segs for w in s.words):
        if re.fullmatch(r"(kof|kov|коф|ков)4", norm(w.word)):  # "Ков четири" heard as one token
            mid = (w.start + w.end) / 2
            heard += [("ков", w.start, mid), ("четири", mid, w.end)]
        else:
            heard.append((w.word.strip(), w.start, w.end))
    print("heard:", " ".join(h[0] for h in heard))

    # script words, tagged with their beat
    script = [(bid, w) for bid, text in BEATS for w in text.split()]
    a = [norm(w) for _, w in script]
    b = [norm(h[0]) for h in heard]
    times: list[tuple[float, float] | None] = [None] * len(script)
    for blk in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        tag, i1, i2, j1, j2 = blk
        if tag == "equal" or (tag == "replace" and i2 - i1 == j2 - j1):
            for k in range(i2 - i1):
                times[i1 + k] = (heard[j1 + k][1], heard[j1 + k][2])
        elif tag == "replace":  # n script words heard as m words: spread evenly
            t0, t1 = heard[j1][1], heard[j2 - 1][2]
            for k in range(i2 - i1):
                f0, f1 = k / (i2 - i1), (k + 1) / (i2 - i1)
                times[i1 + k] = (t0 + (t1 - t0) * f0, t0 + (t1 - t0) * f1)
    # fill words whisper missed by interpolating between known neighbours
    for i, t in enumerate(times):
        if t is None:
            prev = next((times[j][1] for j in range(i - 1, -1, -1) if times[j]), 0.0)
            nxt = next((times[j][0] for j in range(i + 1, len(times)) if times[j]), prev + 0.4)
            times[i] = (prev, max(prev + 0.05, nxt))
            print("  interpolated:", script[i][1])

    beat_ids = [bid for bid, _ in BEATS]
    spans = {}
    for bid in beat_ids:
        idx = [i for i, (b_, _) in enumerate(script) if b_ == bid]
        spans[bid] = (times[idx[0]][0], times[idx[-1]][1], idx)

    # Whisper's word times drift by up to ~1.5 s around short lines, so cut in the
    # real silences: each beat boundary snaps to the silent gap nearest Whisper's guess.
    hop = int(0.02 * SR)
    quiet = np.array([np.abs(x[i:i + hop]).max() < THRESH * 4 for i in range(0, len(x) - hop, hop)])
    gaps, run = [], 0
    for f, q in enumerate(quiet):
        run = run + 1 if q else 0
        if not q or f == len(quiet) - 1:
            pass
        if run and (f + 1 == len(quiet) or not quiet[f + 1]) and run * 0.02 >= 0.15:
            gaps.append(((f + 1 - run) * 0.02, (f + 1) * 0.02))
    cuts = [0.0]
    for n in range(len(beat_ids) - 1):
        est = (spans[beat_ids[n]][1] + spans[beat_ids[n + 1]][0]) / 2
        cand = [g for g in gaps if (g[0] + g[1]) / 2 > cuts[-1] + 0.2]
        # the longest pause near the guess: pauses between lines outlast those
        # inside them (e.g. the little gap in "Ков | четири")
        near = [g for g in cand if abs((g[0] + g[1]) / 2 - est) < 1.6] or cand
        g = max(near, key=lambda g: g[1] - g[0])
        cuts.append(CUT_OVERRIDES.get(beat_ids[n], (g[0] + g[1]) / 2))
    cuts.append(len(x) / SR)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    data = {}
    for n, bid in enumerate(beat_ids):
        s, e, idx = spans[bid]
        lo, hi = cuts[n], cuts[n + 1]
        seg = x[int(lo * SR):int(hi * SR)]
        loud = np.flatnonzero(np.abs(seg) > THRESH)
        a_ = max(0, loud[0] - int(PAD_IN * SR))
        b_ = min(len(seg), loud[-1] + int(PAD_OUT * SR))
        clip = seg[a_:b_].copy()
        k = min(len(clip), int(0.01 * SR))  # tiny fades, cuts land in silence anyway
        clip[:k] *= np.linspace(0, 1, k)
        clip[-k:] *= np.linspace(1, 0, k)
        write_wav(OUT_DIR / f"{bid}.wav", clip)
        # map Whisper's span for this beat onto the speech actually in the clip
        speech0, speech1 = loud[0] / SR, loud[-1] / SR
        scale = (speech1 - speech0) / max(0.05, e - s)

        def rel(t):
            return (t - s) * scale + speech0 - a_ / SR

        data[bid] = {
            "dur": round(len(clip) / SR, 3),
            "words": [
                {"w": script[i][1], "t": round(max(0.0, rel(times[i][0])), 3),
                 "d": round((times[i][1] - times[i][0]) * scale, 3)}
                for i in idx
            ],
        }
        info = data[bid]
        print(f"{bid} {info['dur']:6.2f}s  " + " ".join(f"{w['w']}@{w['t']:.2f}" for w in info["words"]))
    DATA.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    print("total speech:", round(sum(v["dur"] for v in data.values()), 2), "s")


if __name__ == "__main__":
    main()
