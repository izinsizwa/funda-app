import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

/**
 * Funi the book buddy: an original placeholder mascot, the face of the AI tutor.
 * Swap this component for your own artwork when the brand is final.
 */
export function Mascot({ size = 80 }: { size?: number }) {
  return (
    <Svg
      width={size}
      height={(size * 100) / 120}
      viewBox="0 0 120 100"
      accessibilityLabel="Funi the book buddy"
      accessibilityRole="image"
    >
      <Rect x={8} y={14} width={104} height={76} rx={22} fill="#FFC93C" stroke="#1E2A4A" strokeWidth={4} />
      <Path d="M60 14V28" stroke="#1E2A4A" strokeWidth={4} strokeLinecap="round" />
      <Circle cx={42} cy={48} r={7} fill="#1E2A4A" />
      <Circle cx={78} cy={48} r={7} fill="#1E2A4A" />
      <Circle cx={44.5} cy={45.5} r={2.4} fill="#FFFFFF" />
      <Circle cx={80.5} cy={45.5} r={2.4} fill="#FFFFFF" />
      <Circle cx={26} cy={64} r={6} fill="#FF7A66" />
      <Circle cx={94} cy={64} r={6} fill="#FF7A66" />
      <Path d="M48 66Q60 78 72 66" fill="none" stroke="#1E2A4A" strokeWidth={4} strokeLinecap="round" />
    </Svg>
  );
}
