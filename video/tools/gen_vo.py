"""Generate the Bulgarian voiceover, one clip per beat.

Each beat becomes public/audio/vo/<id>.wav (silence-trimmed, 48 kHz). Durations
and word timings land in src/data/vo.json so the timeline can sync visuals to
individual words.

Spoken text uses Cyrillic phonetics for brand names ("Ков четири", "Глово")
so the Bulgarian voice pronounces them the way people actually say them.
"""

import asyncio
import json
import subprocess
import sys
import wave
from pathlib import Path

import edge_tts
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "audio" / "vo"
DATA = ROOT / "src" / "data" / "vo.json"

VOICE = "bg-BG-KalinaNeural"
RATE = "-6%"

BEATS = [
    # 1 - Hook
    ("v01", "Глово, Волт, Болт."),
    ("v02", "Поръчките валят отвсякъде."),
    # 2 - Problem
    ("v03", "Но днес всяка поръчка се обработва два пъти."),
    ("v04", "Служителят я приема и таблетът разпечатва бележка."),
    ("v05", "После някой трябва да я въведе отново, на ръка, в касовата система, за да я видят готвачите."),
    ("v06", "Артикул по артикул. Поръчка след поръчка."),
    ("v07", "А в пиковия час това означава забавяне, грешки и изнервени куриери."),
    # 3 - Reveal
    ("v08", "Има по-лесен начин."),
    ("v09", "Ков четири."),
    # 4 - How it works
    ("v10", "Ков четири събира поръчките от всички платформи в един общ поток."),
    ("v11", "В момента, в който натиснете „Приеми“, поръчката отива директно в кухнята."),
    ("v12", "Готвачите я виждат веднага, а касовата бележка се разпечатва сама."),
    ("v13", "Без преписване. Без чакане."),
    # 5 - Two receipts
    ("v14", "Куриерът получава и двете бележки, от платформата и касовата, без нито едно ръчно действие."),
    # 6 - Value
    ("v15", "Представете си осемдесет поръчки на ден и само по една минута ръчно въвеждане."),
    ("v16", "Това са четиридесет часа всеки месец."),
    ("v17", "Време, което екипът ви връща там, където има значение. В кухнята и при клиентите."),
    # 7 - CTA
    ("v18", "Ков четири."),
    ("v19", "Вие приемате. Ние се грижим за останалото."),
]

SR = 48000
THRESH = 10 ** (-46 / 20)
PAD_IN, PAD_OUT = 0.02, 0.08


def decode(mp3_bytes: bytes) -> np.ndarray:
    out = subprocess.run(
        ["ffmpeg", "-loglevel", "error", "-i", "pipe:0", "-f", "f32le",
         "-ac", "1", "-ar", str(SR), "pipe:1"],
        input=mp3_bytes, capture_output=True, check=True,
    ).stdout
    return np.frombuffer(out, dtype=np.float32)


def write_wav(path: Path, x: np.ndarray) -> None:
    pcm = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


async def synth(beat_id: str, text: str) -> dict:
    audio = bytearray()
    words = []
    comm = edge_tts.Communicate(text, VOICE, rate=RATE, boundary="WordBoundary")
    async for chunk in comm.stream():
        if chunk["type"] == "audio":
            audio.extend(chunk["data"])
        elif chunk["type"] == "WordBoundary":
            words.append({
                "w": chunk["text"],
                "t": chunk["offset"] / 1e7,
                "d": chunk["duration"] / 1e7,
            })
    x = decode(bytes(audio))
    loud = np.flatnonzero(np.abs(x) > THRESH)
    a = max(0, loud[0] - int(PAD_IN * SR))
    b = min(len(x), loud[-1] + int(PAD_OUT * SR))
    write_wav(OUT_DIR / f"{beat_id}.wav", x[a:b])
    shift = a / SR
    return {
        "dur": round((b - a) / SR, 3),
        "words": [
            {"w": w["w"], "t": round(max(0.0, w["t"] - shift), 3), "d": round(w["d"], 3)}
            for w in words
        ],
    }


async def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    DATA.parent.mkdir(parents=True, exist_ok=True)
    only = set(sys.argv[1:])
    data = json.loads(DATA.read_text(encoding="utf-8")) if DATA.exists() else {}
    data = {k: v for k, v in data.items() if isinstance(v, dict)}
    for beat_id, text in BEATS:
        if only and beat_id not in only:
            continue
        data[beat_id] = await synth(beat_id, text)
        info = data[beat_id]
        print(f"{beat_id} {info['dur']:6.2f}s  " + " ".join(f"{w['w']}@{w['t']:.2f}" for w in info["words"]))
    data = {b: data[b] for b, _ in BEATS}
    DATA.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    print("total speech:", round(sum(v["dur"] for v in data.values()), 2), "s")


if __name__ == "__main__":
    asyncio.run(main())
