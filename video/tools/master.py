"""Master the mix: tidy low end, gentle glue compression, loudness for the web.

    python tools/master.py            # public/audio/mix.wav -> public/audio/master.wav

gen_audio.py writes the unmastered mix and calls this at the end, so normally you
never run it by hand. Tweak the chain here to change how the final audio sounds.

Chain: mono bass below 120 Hz -> 24 dB/oct high-pass at 30 Hz -> sub shelf at 70 Hz
and low-mid dip at 250 Hz -> presence at 3.5 kHz and air at 10 kHz -> 2:1 bus
compressor -> two-pass loudness normalisation to -14 LUFS (YouTube/Instagram/TikTok)
-> peak limiter so true peaks stay under -1 dBTP.
"""

import json
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np
from scipy.signal import butter, sosfiltfilt

ROOT = Path(__file__).resolve().parent.parent
MIX = ROOT / "public" / "audio" / "mix.wav"
OUT = ROOT / "public" / "audio" / "master.wav"

TARGET_LUFS = -14.0
TRUE_PEAK = -1.0
MONO_BELOW = 120  # Hz: everything under this is summed to mono (tight, centred bass)

TONE = ",".join([
    "highpass=f=30:poles=2", "highpass=f=30:poles=2",           # 24 dB/oct rumble cut
    "lowshelf=f=70:g=-2.5",                                     # tame the score's sub boom
    "equalizer=f=250:t=q:w=0.9:g=-2",                           # less mud
    "equalizer=f=3500:t=q:w=1.2:g=1.5",                         # voice presence
    "highshelf=f=10000:g=1.5",                                  # air
    "acompressor=threshold=-20dB:ratio=2:attack=25:release=250:knee=6:makeup=2",
])


def mono_bass(x: np.ndarray, sr: int) -> np.ndarray:
    """Sum the low band to mono. Zero-phase Butterworth LP + HP add back to flat."""
    lo = butter(4, MONO_BELOW, "low", fs=sr, output="sos")
    hi = butter(4, MONO_BELOW, "high", fs=sr, output="sos")
    low = sosfiltfilt(lo, x.mean(axis=1))
    return sosfiltfilt(hi, x, axis=0) + low[:, None]


def read(path: Path) -> tuple[np.ndarray, int]:
    with wave.open(str(path)) as w:
        sr, ch = w.getframerate(), w.getnchannels()
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).reshape(-1, ch) / 32768
    return x.astype(float), sr


def write(path: Path, x: np.ndarray, sr: int) -> None:
    with wave.open(str(path), "wb") as w:
        w.setnchannels(x.shape[1])
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())


def ffmpeg(*args: str) -> str:
    return subprocess.run(["ffmpeg", "-hide_banner", "-nostats", *args], capture_output=True, text=True, check=True).stderr


def master(mix: Path = MIX, out: Path = OUT) -> None:
    x, sr = read(mix)
    tmp = out.with_name("_bass.wav")
    write(tmp, mono_bass(x, sr) * 0.9, sr)
    # pass 1: measure the toned signal, pass 2: normalise linearly with those numbers
    loud = f"loudnorm=I={TARGET_LUFS}:TP={TRUE_PEAK}:LRA=9"
    log = ffmpeg("-i", str(tmp), "-af", f"{TONE},{loud}:print_format=json", "-f", "null", "-")
    m = json.loads(log[log.rindex("{"):log.rindex("}") + 1])
    second = (f"{loud}:linear=true:measured_I={m['input_i']}:measured_TP={m['input_tp']}"
              f":measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}")
    # loudnorm runs at 192 kHz internally; limiting there also catches inter-sample peaks
    limit = f"alimiter=limit={10 ** ((TRUE_PEAK - 0.5) / 20):.4f}:attack=1:release=60:level=false"
    ffmpeg("-y", "-i", str(tmp), "-af", f"{TONE},{second},{limit},aresample={sr}",
           "-c:a", "pcm_s16le", str(out))
    tmp.unlink()
    print("mastered", out)


if __name__ == "__main__":
    master(*(Path(a) for a in sys.argv[1:3]))
