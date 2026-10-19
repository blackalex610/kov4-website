"""Transcribe every voiceover clip back to text to catch mispronunciations."""
import json
from pathlib import Path

from faster_whisper import WhisperModel

ROOT = Path(__file__).resolve().parent.parent
model = WhisperModel("medium", device="cpu", compute_type="int8")
for wav in sorted((ROOT / "public" / "audio" / "vo").glob("v*.wav")):
    segs, _ = model.transcribe(str(wav), language="bg", beam_size=5)
    print(wav.stem, "|", " ".join(s.text.strip() for s in segs), flush=True)
