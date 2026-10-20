"""Build the full soundtrack: voiceover + original synthesized music + sound design.

Everything is placed from src/data/timeline.json (the same cues the visuals use),
the music ducks under the voice, and the result is written to public/audio/mix.wav,
then mastered (tools/master.py) into public/audio/master.wav for Remotion to play.
"""

import json
import math
import subprocess
import wave
from pathlib import Path

import numpy as np
from scipy.signal import butter, lfilter, sosfiltfilt

from master import master as master_mix

ROOT = Path(__file__).resolve().parent.parent
TL = json.loads((ROOT / "src" / "data" / "timeline.json").read_text(encoding="utf-8"))
VO_DIR = ROOT / "public" / "audio" / "vo"
OUT = ROOT / "public" / "audio" / "mix.wav"
# Optional composed score (ElevenLabs Music): cue A plays up to the kov4 logo hit,
# cue B starts on it. If both files exist they replace the synthesized music.
SCORE_A = ROOT / "public" / "audio" / "score_a.mp3"
SCORE_B = ROOT / "public" / "audio" / "score_b.mp3"

SR = 48000
FPS = TL["fps"]
DUR = TL["duration"]
N = int(DUR * SR) + SR
CUE = TL["cues"]
BEATS = TL["beats"]
rng = np.random.default_rng(7)


def frames(s):
    return math.floor(s * FPS + 0.5)


def secs_of_frame(f):
    return f / FPS


def js_rand(seed):
    x = math.sin(seed * 127.1 + 311.7) * 43758.5453
    return x - math.floor(x)


# ----------------------------------------------------------------- buses

music = np.zeros((N, 2))
sfx = np.zeros((N, 2))
vo = np.zeros((N, 2))


def place(bus, x, t, gain=1.0, pan=0.0):
    """Add mono/stereo signal x at time t (s) with equal-power pan (-1..1)."""
    if x.ndim == 1:
        a = (pan + 1) * math.pi / 4
        x = np.stack([x * math.cos(a), x * math.sin(a)], axis=1)
    i = int(t * SR)
    if i < 0:
        x = x[-i:]
        i = 0
    j = min(N, i + len(x))
    bus[i:j] += x[: j - i] * gain


def env_exp(n, tau):
    return np.exp(-np.arange(n) / (tau * SR))


def attack(x, a=0.004):
    k = min(len(x), int(a * SR))
    x[:k] *= np.linspace(0, 1, k)
    return x


def lowpass(x, cutoff):
    """One-pole low-pass; cutoff may be a scalar or per-sample array."""
    if np.isscalar(cutoff):
        a = 1 - np.exp(-2 * np.pi * cutoff / SR)
        return lfilter([a], [1, -(1 - a)], x)
    c = np.broadcast_to(np.asarray(cutoff, dtype=float), x.shape)
    a = 1 - np.exp(-2 * np.pi * c / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc)
        y[i] = acc
    return y


def highpass(x, cutoff):
    return x - lowpass(x, cutoff)


def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


NOTE = {n: i for i, n in enumerate(["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"])}


def m(name):
    """'F#4' -> midi number."""
    pitch, octave = name[:-1], int(name[-1])
    pitch = pitch.replace("Bb", "A#").replace("Eb", "D#")
    return 12 * (octave + 1) + NOTE[pitch]


# ----------------------------------------------------------------- reverb

def make_ir(length, decay, seed=1, bright=6000):
    r = np.random.default_rng(seed)
    n = int(length * SR)
    t = np.arange(n) / SR
    ir = r.standard_normal((n, 2)) * np.exp(-t / decay)[:, None]
    for ch in range(2):
        ir[:, ch] = lowpass(ir[:, ch], bright)
    ir[: int(0.012 * SR)] = 0  # pre-delay
    return ir / np.sqrt((ir ** 2).sum(axis=0))


def convolve(x, ir, block=1 << 17):
    """Overlap-add FFT convolution, per channel."""
    n_ir = len(ir)
    size = 1 << int(np.ceil(np.log2(block + n_ir)))
    y = np.zeros((len(x) + n_ir, 2))
    H = [np.fft.rfft(ir[:, c], size) for c in range(2)]
    for s in range(0, len(x), block):
        seg = x[s:s + block]
        for c in range(2):
            Y = np.fft.irfft(np.fft.rfft(seg[:, c], size) * H[c], size)
            y[s:s + size, c] += Y[: min(size, len(y) - s)]
    return y[: len(x)]


# ----------------------------------------------------------------- instruments

def pad_note(freq, dur, att=0.9, rel=1.6, bright=1.0):
    t = t_axis(dur + rel)
    x = np.zeros_like(t)
    for det in (-0.007, 0.0, 0.0065):
        f = freq * (1 + det)
        for h in range(1, 7):
            w = (1 / h ** (1.9 - 0.5 * bright))
            x += w * np.sin(2 * np.pi * f * h * t + rng.uniform(0, 6.28))
    e = np.minimum(1, t / att)
    e *= np.where(t > dur, np.exp(-(t - dur) / (rel / 3)), 1)
    lfo = 1 + 0.06 * np.sin(2 * np.pi * 0.23 * t + rng.uniform(0, 6))
    return x * e * lfo / 6


def pluck(freq, decay=0.42):
    t = t_axis(decay * 4)
    x = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(4 * np.pi * freq * t) + 0.12 * np.sin(6 * np.pi * freq * t)
    return attack(x * np.exp(-t / decay), 0.003)


def bass(freq, dur):
    t = t_axis(dur + 0.15)
    x = np.sin(2 * np.pi * freq * t) + 0.25 * np.sin(4 * np.pi * freq * t)
    e = np.minimum(1, t / 0.01) * np.exp(-t / (dur * 0.9 + 0.05))
    return x * e


def kick():
    t = t_axis(0.45)
    f = 45 + 95 * np.exp(-t / 0.035)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t / 0.16)


def hat(decay=0.035):
    n = int(0.15 * SR)
    x = np.diff(rng.standard_normal(n + 1))
    return x * env_exp(n, decay) * 0.4


def clap():
    n = int(0.3 * SR)
    noise = rng.standard_normal(n)
    noise = highpass(lowpass(noise, 2600), 900)
    e = np.zeros(n)
    for k, o in enumerate((0, 0.009, 0.018)):
        i = int(o * SR)
        e[i:] += env_exp(n - i, 0.012 if k < 2 else 0.09)
    return noise * e


# ----------------------------------------------------------------- sound effects

def whoosh(dur=0.9, up=True):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = rng.standard_normal(n)
    shape = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.6
    cut = 300 + 4200 * (t / dur if up else 1 - t / dur) ** 1.4
    y = lowpass(x, cut) * shape
    pan = np.linspace(-0.6, 0.6, n)
    return np.stack([y * np.cos((pan + 1) * np.pi / 4), y * np.sin((pan + 1) * np.pi / 4)], axis=1)


def ding(freq, decay=0.55):
    t = t_axis(decay * 4)
    x = (np.sin(2 * np.pi * freq * t) * np.exp(-t / decay)
         + 0.35 * np.sin(2 * np.pi * freq * 2.76 * t) * np.exp(-t / (decay * 0.4))
         + 0.15 * np.sin(2 * np.pi * freq * 5.4 * t) * np.exp(-t / (decay * 0.2)))
    return attack(x, 0.002)


def notify(base):
    x = np.zeros(int(1.6 * SR))
    a = ding(base)
    b = ding(base * 1.335)
    x[: len(a)] += a[: len(x)]
    o = int(0.11 * SR)
    x[o:o + len(b)] += b[: len(x) - o]
    return x


def success(base=1046.5):
    x = np.zeros(int(1.8 * SR))
    for k, r in enumerate((1, 1.26, 1.5)):
        d = ding(base * r, 0.45)
        o = int(k * 0.07 * SR)
        x[o:o + len(d)] += d[: len(x) - o] * (0.8 if k < 2 else 1)
    return x


def tap():
    n = int(0.06 * SR)
    t = np.arange(n) / SR
    click = highpass(rng.standard_normal(n), 2500) * np.exp(-t / 0.004)
    body = np.sin(2 * np.pi * 1700 * t) * np.exp(-t / 0.012)
    return click * 0.6 + body * 0.5


def pop(f0=900, f1=480):
    t = t_axis(0.18)
    f = f1 + (f0 - f1) * np.exp(-t / 0.03)
    return attack(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.06), 0.002)


def printer(dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise = highpass(lowpass(rng.standard_normal(n), 5200), 1400)
    steps = 0.55 + 0.45 * np.sign(np.sin(2 * np.pi * 38 * t))
    tone = 0.25 * np.sin(2 * np.pi * 2350 * t) * (0.5 + 0.5 * np.sin(2 * np.pi * 38 * t))
    motor = 0.35 * np.sin(2 * np.pi * 118 * t)
    e = np.minimum(1, t / 0.03) * np.minimum(1, (dur - t) / 0.05)
    return (noise * steps * 0.5 + tone + motor) * e


def key_click():
    n = int(0.05 * SR)
    t = np.arange(n) / SR
    x = highpass(rng.standard_normal(n), 1800) * np.exp(-t / 0.006)
    x += 0.5 * np.sin(2 * np.pi * rng.uniform(180, 260) * t) * np.exp(-t / 0.01)
    return x


def paper():
    n = int(0.22 * SR)
    t = np.arange(n) / SR
    x = highpass(lowpass(rng.standard_normal(n), 3500), 600)
    return x * np.sin(np.pi * t / t[-1]) ** 2 * 0.6


def buzz():
    out = []
    for f in (330, 247):
        t = t_axis(0.16)
        x = np.tanh(2.2 * np.sin(2 * np.pi * f * t)) * np.minimum(1, t / 0.005) * np.exp(-t / 0.09)
        out.append(lowpass(x, 2200))
    gap = np.zeros(int(0.03 * SR))
    return np.concatenate([out[0], gap, out[1]])


def tick():
    n = int(0.03 * SR)
    t = np.arange(n) / SR
    return highpass(rng.standard_normal(n), 3000) * np.exp(-t / 0.003) + 0.4 * np.sin(2 * np.pi * 3200 * t) * np.exp(-t / 0.004)


def riser(dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    p = t / dur
    noise = lowpass(rng.standard_normal(n), 400 + 7000 * p ** 2)
    f = 180 * 2 ** (p * 2.6)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.3
    return (noise * 0.7 + tone) * p ** 2.2


def impact():
    t = t_axis(2.6)
    sub = np.sin(2 * np.pi * (48 + 30 * np.exp(-t / 0.08)) * t) * np.exp(-t / 0.7)
    hit = lowpass(rng.standard_normal(len(t)), 1800) * np.exp(-t / 0.05)
    x = sub * 0.9 + hit * 0.6
    shimmer = np.zeros_like(t)
    for r in (1, 1.5, 2, 2.52):
        shimmer += ding(587.33 * r, 0.9)[: len(t)] * 0.18
    return x + shimmer


def count_roll(dur, n_ticks):
    x = np.zeros(int((dur + 0.1) * SR))
    for k in range(n_ticks):
        # ease-out spacing like the on-screen counter
        o = int(dur * (1 - (1 - k / n_ticks) ** 2) * SR)
        c = pop(2200 + k * 25, 1600)[: int(0.04 * SR)] * 0.5
        x[o:o + len(c)] += c[: len(x) - o]
    return x


# ----------------------------------------------------------------- music

def chord_track(start, end, bar, chords, pad_gain, bright, bass_gain=0.0, bass_div=2):
    """Pads (+ optional pulsing bass) over a chord loop from start to end."""
    t = start
    k = 0
    while t < end - 0.05:
        notes = chords[k % len(chords)]
        d = min(bar, end - t)
        for i, n in enumerate(notes):
            place(music, pad_note(midi(m(n)), d, bright=bright), t, pad_gain, pan=(i / max(1, len(notes) - 1) - 0.5) * 0.7)
        if bass_gain:
            step = bar / (4 * bass_div / 2)
            root = midi(m(notes[0]) - 12)
            s = t
            while s < t + d - 0.01:
                place(music, bass(root, step * 0.8), s, bass_gain)
                s += step
        t += bar
        k += 1


# Section A - hook: wide, airy Dmaj9 bed
A0, A1 = 0.0, CUE["s2_in"] + 0.3
chord_track(A0, A1, A1 - A0, [["D3", "A3", "E4", "F#4", "C#5"]], 0.05, 0.6)
place(music, pad_note(midi(m("D2")), A1 - CUE["ping_glovo"], att=0.3), CUE["ping_glovo"], 0.07)  # sub swell under the pings

# Section B - problem: minor loop with a nervous pulse, growing at rush hour
B0, B1 = CUE["s2_in"], CUE["collapse"] + 0.4
bar_b = 4 * 60 / 96
chord_track(
    B0, B1, bar_b,
    [["D3", "F3", "A3", "E4"], ["A#2", "D3", "F3", "A3"], ["G2", "A#3", "D4", "F4"], ["A2", "D3", "E3", "G3"]],
    0.04, 0.35, bass_gain=0.11, bass_div=4,
)
step = 60 / 96 / 4
t = B0 + bar_b
while t < B1 - 0.2:
    rush = 1.0 if t > CUE["peak"] else 0.45
    place(music, hat(0.03), t, 0.05 * rush, pan=0.3)
    t += step
t = CUE["peak"]
while t < CUE["collapse"]:
    place(sfx, tick(), t, 0.18, pan=-0.2)
    t += 0.5

# Section D - kov4: optimistic major progression at 100 BPM, gridded from the logo hit
bpm = 100
beat_s = 60 / bpm
bar_d = 4 * beat_s
D0 = CUE["logo"]
D_END = DUR - 0.2
prog_d = [["D3", "A3", "E4", "F#4"], ["C#3", "A3", "E4", "A4"], ["B2", "F#3", "A3", "D4"], ["G2", "B3", "D4", "F#4", "A4"]]
chord_track(D0 + 0.4, CUE["logo_end"], bar_d, prog_d, 0.045, 1.0)
chord_track(CUE["logo_end"], D_END, D_END - CUE["logo_end"], [["D3", "A3", "E4", "F#4", "C#5"]], 0.05, 1.0)

arp_pattern = [0, 2, 1, 3, 2, 1, 3, 2]
t = CUE["streams"] - 2 * beat_s
k = 0
while t < CUE["tagline2"] + 1.5:
    bar_i = int((t - D0) // bar_d)
    if t >= CUE["logo_end"]:
        notes = ["D4", "F#4", "A4", "E5"]
    else:
        notes = [n[:-1] + str(int(n[-1]) + 1) for n in prog_d[bar_i % 4]]
    n = notes[arp_pattern[k % 8] % len(notes)]
    g = 0.07 if CUE["s6_in"] <= t < CUE["s7_in"] else 0.09
    place(music, pluck(midi(m(n))), t, g, pan=0.35 * math.sin(k * 0.9))
    t += beat_s / 2
    k += 1

t = D0 + bar_d
while t < CUE["s7_in"]:
    b = round((t - D0) / beat_s)
    bar_i = int((t - D0) // bar_d)
    root = midi(m(prog_d[bar_i % 4][0]) - 12)
    if t >= CUE["streams"]:
        place(music, bass(root, beat_s * 0.9), t, 0.12)
    drums = CUE["streams"] <= t < CUE["s6_in"]
    if drums and b % 2 == 0:
        place(music, kick(), t, 0.22)
    if drums and t >= CUE["merge"] and b % 2 == 1:
        place(music, clap(), t, 0.05, pan=0.1)
    if t >= CUE["accept"] and t < CUE["s7_in"]:
        for q in range(2):
            place(music, hat(0.025), t + q * beat_s / 2 + beat_s / 4, 0.035, pan=-0.3)
    t += beat_s

# ----------------------------------------------------------------- sound design

PAN_T = [-0.55, 0.0, 0.55]

place(sfx, whoosh(1.3), CUE["rise"], 0.16)
for i, c in enumerate(["ping_glovo", "ping_wolt", "ping_bolt"]):
    place(sfx, notify(1046.5 * [1, 1.122, 1.26][i]), CUE[c] - 0.02, 0.2, pan=PAN_T[i])

# Order cards landing in their terminals (mirrors S1Hook CARDS)
rain_f = frames(CUE["rain"])
for i in range(24):
    target = i % 3
    start = rain_f - frames(0.5) + math.floor(i * 1.6 + js_rand(i) * 4 + 0.5)
    dur = frames(1.1 + js_rand(i * 2.1) * 0.5)
    place(sfx, pop(1300 + 200 * js_rand(i * 7), 800), secs_of_frame(start + dur), 0.05, pan=PAN_T[target])

place(sfx, whoosh(1.0, up=False), CUE["s2_in"], 0.15)
place(sfx, impact()[: int(1.4 * SR)] * np.linspace(1, 0, int(1.4 * SR)), CUE["twice"], 0.22)
place(sfx, tap(), CUE["tap1"], 0.35)
place(sfx, success(880), CUE["tap1"] + 0.12, 0.08)
place(sfx, printer(1.5), CUE["print1"], 0.13, pan=-0.3)
place(sfx, whoosh(0.8), CUE["pan_pos"], 0.11)

t = CUE["type_start"]
k = 0
while t < CUE["type_end"] - 0.3:
    place(sfx, key_click(), t, 0.11, pan=0.35)
    gap = 0.07 + 0.06 * js_rand(k * 3.3)
    if js_rand(k * 1.7) > 0.9:
        gap += 0.25
    t += gap
    k += 1

pile_f = frames(CUE["pile"] - 0.2)
for k in range(6):
    place(sfx, paper(), secs_of_frame(pile_f + round(k * 5.5)) + 0.08, 0.2, pan=-0.6)

for c in ["warn_delay", "warn_error", "warn_courier"]:
    place(sfx, buzz(), CUE[c] - 0.03, 0.12)

place(sfx, riser(CUE["logo"] - CUE["collapse"] + 0.05), CUE["collapse"], 0.2)
place(sfx, impact(), CUE["logo"] - 0.02, 0.32)

place(sfx, whoosh(1.1), CUE["s4_in"], 0.1)
for i in range(3):
    place(sfx, whoosh(0.7), CUE["streams"] + i * 5 / FPS, 0.05, pan=PAN_T[i] * 0.5)
place(sfx, whoosh(0.9), CUE["merge"], 0.07)
place(sfx, tap(), CUE["accept"], 0.32, pan=-0.4)
place(sfx, notify(1174.7), CUE["accept"] + 0.1, 0.12, pan=-0.4)
place(sfx, printer(1.3), CUE["accept"] + 0.3, 0.07, pan=-0.5)
for hub_t, arrive_t, pan_a in [
    (CUE["accept"] + 0.9, CUE["kitchen"], 0.5),
    (CUE["check1"] + 0.1, CUE["check1"] + 0.9, 0.5),
    (CUE["check2"], CUE["check2"] + 0.8, 0.5),
]:
    place(sfx, pop(700, 420), hub_t, 0.12)
    place(sfx, pop(1500, 900), arrive_t, 0.1, pan=pan_a)
place(sfx, printer(1.6), CUE["print2"], 0.12, pan=0.5)
place(sfx, success(1046.5), CUE["check1"] - 0.05, 0.1)
place(sfx, success(1174.7), CUE["check2"] - 0.05, 0.1)

place(sfx, whoosh(1.0), CUE["s5_in"], 0.12)
place(sfx, pop(1100, 650), CUE["rec_platform"] - 0.1, 0.12, pan=-0.3)
place(sfx, pop(1250, 750), CUE["rec_fiscal"] - 0.1, 0.12, pan=0.3)
place(sfx, paper(), CUE["stack"], 0.22)
place(sfx, tap(), CUE["stack"] + 0.85, 0.3, pan=-0.3)
place(sfx, success(1318.5), CUE["zero"] - 0.15, 0.1)

place(sfx, whoosh(1.0), CUE["s6_in"], 0.1)
place(sfx, count_roll(0.75, 16), CUE["n80"] - 0.2, 0.12)
place(sfx, pop(1000, 600), CUE["n1"] - 0.2, 0.12)
place(sfx, count_roll(0.85, 14), CUE["n40"] - 0.1, 0.12)
place(sfx, success(1174.7), CUE["n40"] + 0.75, 0.08)
place(sfx, pop(1200, 700), CUE["kitchen_word"] - 0.2, 0.1, pan=-0.3)
place(sfx, pop(1400, 800), CUE["clients"] - 0.2, 0.1, pan=0.3)

place(sfx, whoosh(1.2), CUE["s7_in"] + 0.2, 0.1)
place(sfx, impact() * 0.6, CUE["logo_end"] - 0.45, 0.22)
place(sfx, success(1174.7), CUE["tagline2"] - 0.02, 0.08)

# ----------------------------------------------------------------- composed score

def load_stereo(path):
    raw = subprocess.run(
        ["ffmpeg", "-loglevel", "error", "-i", str(path), "-f", "f32le", "-ac", "2", "-ar", str(SR), "pipe:1"],
        capture_output=True, check=True,
    ).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).astype(float)


def fades(x, fin, fout):
    x = x.copy()
    a, b = int(fin * SR), int(fout * SR)
    if a:
        x[:a] *= np.linspace(0, 1, a)[:, None]
    if b:
        x[-b:] *= np.linspace(1, 0, b)[:, None] ** 2
    return x


SCORED = SCORE_A.exists() and SCORE_B.exists()
if SCORED:
    music[:] = 0
    hit = CUE["logo"]
    a = load_stereo(SCORE_A)[: int((hit + 0.12) * SR)]
    place(music, fades(a / np.abs(a).max(), 0.6, 0.35), 0.0, 0.42)
    b = load_stereo(SCORE_B)[: int((DUR - hit + 0.05) * SR)]
    place(music, fades(b / np.abs(b).max(), 0.02, 2.5), hit - 0.04, 0.38)

# ----------------------------------------------------------------- voiceover

vo_active = np.zeros(N)
for beat_id, b in BEATS.items():
    with wave.open(str(VO_DIR / f"{beat_id}.wav")) as w:
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float) / 32768
    x = highpass(x, 70)
    place(vo, x, b["start"], 1.0)
    i, j = int(b["start"] * SR), int(b["end"] * SR)
    vo_active[i:j] = 1

# Ducking envelope: smooth so the music breathes rather than pumps
win = int(0.35 * SR)
cs = np.concatenate([[0], np.cumsum(vo_active)])
idx = np.arange(N)
duck = (cs[np.clip(idx + win // 2, 0, N)] - cs[np.clip(idx - win // 2, 0, N)]) / win
music *= 0.8 * (1 - (0.55 if SCORED else 0.45) * np.clip(duck, 0, 1))[:, None]

# ----------------------------------------------------------------- mix

print("reverb...")
if not SCORED:  # the composed score already carries its own space
    music = music * 0.75 + convolve(music, make_ir(2.8, 0.9, 1)) * 0.45
sfx = sfx * 0.85 + convolve(sfx, make_ir(1.6, 0.45, 2)) * 0.25
vo = vo * 0.95 + convolve(vo, make_ir(0.7, 0.16, 3, bright=5000)) * 0.07

# Clean the low end per bus: the voice has nothing useful under 90 Hz, the score's
# sub rumble goes, and a dip around 300 Hz in the music leaves room for the voice.
def hp(x, f):
    return sosfiltfilt(butter(4, f, "high", fs=SR, output="sos"), x, axis=0)


def bell(x, f, gain_db, q=1.0):
    """RBJ peaking EQ."""
    A, w = 10 ** (gain_db / 40), 2 * np.pi * f / SR
    al = np.sin(w) / (2 * q)
    b = [1 + al * A, -2 * np.cos(w), 1 - al * A]
    a = [1 + al / A, -2 * np.cos(w), 1 - al / A]
    return lfilter(b, a, x, axis=0)


vo = hp(vo, 90)
music = bell(hp(music, 32), 300, -3.0, 0.8)
sfx = hp(sfx, 40)

vo_peak = np.abs(vo).max()
vo *= 0.6 / vo_peak

master = vo + music + sfx
fade = np.ones(N)
fade[-int(1.2 * SR):] = np.linspace(1, 0, int(1.2 * SR))
master *= fade[:, None]
master = master[: int(DUR * SR)]
master = np.tanh(master * 1.1) / np.tanh(1.1)
master *= 0.95 / np.abs(master).max()

pcm = (master * 32767).astype(np.int16)
with wave.open(str(OUT), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("wrote", OUT, f"{DUR:.2f}s")
master_mix(OUT)
