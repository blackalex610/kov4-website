"""Lay the voiceover beats out on a timeline and derive scene ranges + cues.

This is the single source of truth for timing: the Remotion scenes read
src/data/timeline.json for visual sync and gen_audio.py reads it to place
sound effects and shape the music, so picture and sound never drift apart.
"""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VO = json.loads((ROOT / "src" / "data" / "vo.json").read_text(encoding="utf-8"))
OUT = ROOT / "src" / "data" / "timeline.json"

FPS = 30

# Silence (seconds) before each beat. Longer gaps carry scene transitions.
GAPS = {
    "v01": 1.6, "v02": 0.5,
    "v03": 1.1, "v04": 0.7, "v05": 0.7, "v06": 0.6, "v07": 0.5,
    "v08": 1.3, "v09": 0.55,
    "v10": 1.6, "v11": 0.6, "v12": 0.5, "v13": 0.6,
    "v14": 1.3,
    "v15": 1.4, "v16": 0.6, "v17": 0.9,
    "v18": 1.5, "v19": 0.55,
}
TAIL = 2.8

beats = {}
t = 0.0
for beat_id, info in VO.items():
    t += GAPS[beat_id]
    beats[beat_id] = {
        "start": round(t, 3),
        "end": round(t + info["dur"], 3),
        "words": [round(t + w["t"], 3) for w in info["words"]],
    }
    t += info["dur"]
END = round(t + TAIL, 3)


def B(b):
    return beats[b]["start"]


def E(b):
    return beats[b]["end"]


def W(b, i):
    return beats[b]["words"][i]


scenes = {
    "s1": (0.0, B("v03") + 0.3),
    "s2": (B("v03") - 0.45, B("v08") + 1.2),
    "s3": (B("v08") - 0.2, B("v10") + 0.7),
    "s4": (B("v10") - 0.7, B("v14") + 0.3),
    "s5": (B("v14") - 0.9, B("v15") + 0.3),
    "s6": (B("v15") - 0.9, B("v18") + 0.3),
    "s7": (B("v18") - 1.1, END),
}

cues = {
    # 1 - Hook
    "rise": 0.25,
    "ping_glovo": W("v01", 0),
    "ping_wolt": W("v01", 1),
    "ping_bolt": W("v01", 2),
    "rain": W("v02", 1),
    # 2 - Problem
    "s2_in": B("v03") - 0.45,
    "twice": W("v03", 6),
    "tap1": W("v04", 2),
    "print1": W("v04", 5),
    "pan_pos": B("v05") - 0.35,
    "type_start": W("v05", 5),
    "manual": W("v05", 8),
    "pos_system": W("v05", 10),
    "cooks": W("v05", 16),
    "item_by_item": B("v06"),
    "pile": W("v06", 3),
    "type_end": E("v06") + 0.2,
    "peak": W("v07", 2),
    "warn_delay": W("v07", 6),
    "warn_error": W("v07", 7),
    "warn_courier": W("v07", 10),
    # 3 - Reveal
    "collapse": B("v08") - 0.85,
    "logo": B("v09"),
    # 4 - Flow
    "s4_in": B("v10") - 0.7,
    "streams": W("v10", 5),
    "merge": W("v10", 8),
    "press": W("v11", 4),
    "accept": W("v11", 5),
    "kitchen": W("v11", 10),
    "seen": W("v12", 3),
    "print2": W("v12", 5),
    "check1": W("v13", 0),
    "check2": W("v13", 2),
    # 5 - Two receipts
    "s5_in": B("v14") - 0.9,
    "rec_platform": W("v14", 6),
    "rec_fiscal": W("v14", 8),
    "stack": W("v14", 9),
    "zero": W("v14", 12),
    # 6 - Value
    "s6_in": B("v15") - 0.9,
    "n80": W("v15", 2),
    "n1": W("v15", 9),
    "n40": W("v16", 2),
    "month": W("v16", 4),
    "cards": W("v17", 0),
    "kitchen_word": W("v17", 10),
    "clients": W("v17", 13),
    # 7 - End
    "s7_in": B("v18") - 1.1,
    "logo_end": B("v18"),
    "tagline": W("v19", 0),
    "tagline2": W("v19", 2),
}

data = {
    "fps": FPS,
    "duration": END,
    "durationInFrames": int(round(END * FPS)),
    "beats": beats,
    "scenes": {k: {"from": round(a, 3), "to": round(b, 3)} for k, (a, b) in scenes.items()},
    "cues": {k: round(v, 3) for k, v in cues.items()},
}
OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
print(f"duration {END:.2f}s  ({data['durationInFrames']} frames)")
for k, s in data["scenes"].items():
    print(f"  {k}: {s['from']:6.2f} -> {s['to']:6.2f}")
