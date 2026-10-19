import React from 'react';
import { Composition } from 'remotion';
import { H, W } from './theme';
import { DURATION, FPS } from './timeline';
import { Video } from './Video';

export const RemotionRoot: React.FC = () => (
  <Composition id="Kov4Explainer" component={Video} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
);
