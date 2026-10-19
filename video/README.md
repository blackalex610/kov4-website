# kov4 explainer video

~92 s, 1920×1080, 30 fps. Bulgarian voiceover by ElevenLabs voice **Milena**
(`M1ydWt7KnBCiuv4CnEDC`, model `eleven_v4`), score composed with ElevenLabs Music,
3D scenes in React Three Fiber, rendered with Remotion. Sound effects are synthesized
in code. A film layer (`src/ui/Film.tsx`) adds the grade, vignette, light leaks and grain.

The previous Microsoft Kalina voiceover and mix are kept in `backup_kalina/`.

## Pipeline

Timing has a single source of truth, so picture and sound always stay in sync:

```
tools/gen_vo.py          script (BEATS) -> public/audio/vo/*.wav + src/data/vo.json (edge-tts path)
tools/split_vo.py        or: one long ElevenLabs take -> the same vo/*.wav + vo.json
tools/build_timeline.py  vo.json -> src/data/timeline.json (beats, scenes, cues)
tools/gen_audio.py       timeline.json -> public/audio/master.wav (VO + music + SFX, ducked)
                         uses public/audio/score_a.mp3 (up to the logo) + score_b.mp3 (from the logo)
                         when both exist, otherwise the synthesized music
src/                     Remotion scenes read timeline.json for every animation cue
```

## Common edits

| Change | Do |
|---|---|
| Voiceover wording | edit `BEATS` in `tools/gen_vo.py`, then run all three tools |
| Pauses between lines | edit `GAPS` in `tools/build_timeline.py`, then run it and `gen_audio.py` |
| Music / SFX levels | `tools/gen_audio.py` (see the `place(...)` gains) |
| Restaurant / order on receipts | `ORDER` in `src/theme.ts` |
| Brand colours | `C` / `BRAND_GRADIENT` in `src/theme.ts`, icon in `src/screens/misc.ts` |

ElevenLabs voiceover: generate the whole script in one take (the `BEATS` text joined,
with `[pause]` tags between lines), save it as `public/audio/vo_take_milena.mp3`, then
`PYTHONIOENCODING=utf-8 python tools/split_vo.py public/audio/vo_take_milena.mp3` and
`python tools/qa_vo.py`. If a split lands in the wrong pause, pin it in `CUT_OVERRIDES`.

```bash
PYTHONIOENCODING=utf-8 python tools/gen_vo.py        # or: python tools/gen_vo.py v07 v19 (only those lines)
PYTHONIOENCODING=utf-8 python tools/build_timeline.py
python tools/gen_audio.py
npm run studio                                       # live preview
npm run render                                       # -> out/kov4-explainer.mp4
node tools/stills.mjs 12.5s 40s 1500                 # quick stills -> out/stills
```

Spoken brand names are written phonetically in Cyrillic (`Ков фор`, `Глово, Волт, Болт`)
so the voice pronounces them naturally. On screen they stay `kov4`, `Glovo`, `Wolt`, `Bolt`.

## Scenes

1. **Hook** – three platform terminals light up, orders fly in from everywhere.
2. **Problem** – accept → the terminal prints a receipt → staff retype it into the POS (with a typo) → rush-hour pile-up.
3. **Reveal** – the chaos collapses into light, which bursts into the kov4 icon and wordmark.
4. **How it works** – Glovo/Wolt/Bolt stream into kov4 → the kitchen display and the fiscal printer print automatically.
5. **Two receipts** – platform receipt + касова бележка, stapled to the courier bag.
6. **Value** – 80 orders × 1 min = 40 hours a month (labelled as an example).
7. **End card** – kov4 · „Приеми. Готово.“
