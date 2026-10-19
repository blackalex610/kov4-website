"""Tile rendered stills into one labelled contact sheet: python tools/sheet.py out.png [cols]."""
import sys
from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parent.parent
files = sorted((root / "out" / "stills").glob("f*.png"))
cols = int(sys.argv[2]) if len(sys.argv) > 2 else 2
tw, th = 960, 540
rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGB", (cols * tw, rows * th), "white")
for i, f in enumerate(files):
    im = Image.open(f).convert("RGB").resize((tw, th), Image.LANCZOS)
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, 150, 34], fill="black")
    d.text((8, 8), f"{f.stem[1:]}  {int(f.stem[1:]) / 30:.1f}s", fill="white")
    sheet.paste(im, ((i % cols) * tw, (i // cols) * th))
sheet.save(sys.argv[1])
print(sys.argv[1], len(files), "frames")
