import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';
import React, { useEffect, useState } from 'react';
import { continueRender, delayRender } from 'remotion';

const WEIGHTS = ['400', '500', '600', '700', '800'] as const;

const inter = loadInter('normal', { weights: [...WEIGHTS], subsets: ['latin', 'latin-ext', 'cyrillic'] });
const mono = loadMono('normal', { weights: ['400', '700'], subsets: ['latin', 'cyrillic'] });

export const FONT = inter.fontFamily;
export const MONO = mono.fontFamily;

// Canvas textures draw text with these fonts, so nothing may render before they
// are available - otherwise the first frames bake a fallback font into screens.
export const FontGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [handle] = useState(() => delayRender('Loading fonts'));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([inter.waitUntilDone(), mono.waitUntilDone()])
      .then(() =>
        Promise.all([
          ...WEIGHTS.map((w) => document.fonts.load(`${w} 40px ${FONT}`, 'АБВабв')),
          ...['400', '700'].map((w) => document.fonts.load(`${w} 40px ${MONO}`, 'АБВабв')),
        ]),
      )
      .then(() => {
        setReady(true);
        continueRender(handle);
      });
  }, [handle]);

  return ready ? <>{children}</> : null;
};
