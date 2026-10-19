import React from 'react';
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { FontGate } from './fonts';
import { S1Hook } from './scenes/S1Hook';
import { S2Problem } from './scenes/S2Problem';
import { S3Reveal } from './scenes/S3Reveal';
import { S4Flow } from './scenes/S4Flow';
import { S5Receipts } from './scenes/S5Receipts';
import { S6Value } from './scenes/S6Value';
import { S7End } from './scenes/S7End';
import { C, LIGHT_BG } from './theme';
import { Film, gradeFilter } from './ui/Film';
import { cue, scene, sec } from './timeline';

const Part: React.FC<{ id: Parameters<typeof scene>[0]; children: React.ReactNode }> = ({ id, children }) => {
  const s = scene(id);
  return (
    <Sequence from={s.from} durationInFrames={s.dur} name={id}>
      {children}
    </Sequence>
  );
};

/** Dark world for the problem, light world from the moment kov4 appears. */
const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const light = frame >= cue('logo') + sec(0.6);
  return <AbsoluteFill style={{ background: light ? LIGHT_BG : C.dark }} />;
};

const Graded: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ filter: gradeFilter(frame) }}>{children}</AbsoluteFill>;
};

export const Video: React.FC = () => (
  <AbsoluteFill style={{ background: C.dark }}>
    <Backdrop />
    {/* voiceover + music + sound design, mixed by tools/gen_audio.py on the same timeline */}
    <Html5Audio src={staticFile('audio/master.wav')} />
    <FontGate>
      <Graded>
      <Part id="s1">
        <S1Hook />
      </Part>
      <Part id="s2">
        <S2Problem />
      </Part>
      <Part id="s3">
        <S3Reveal />
      </Part>
      <Part id="s4">
        <S4Flow />
      </Part>
      <Part id="s5">
        <S5Receipts />
      </Part>
      <Part id="s6">
        <S6Value />
      </Part>
      <Part id="s7">
        <S7End />
      </Part>
      </Graded>
      <Film />
    </FontGate>
  </AbsoluteFill>
);
