import React from 'react';
import Svg, { Circle, Path, Polygon, Rect } from 'react-native-svg';

export type IconName =
  | 'home'
  | 'book'
  | 'storybook'
  | 'user'
  | 'chat'
  | 'speaker'
  | 'play'
  | 'lock'
  | 'flame'
  | 'shield'
  | 'star'
  | 'check'
  | 'chevronRight'
  | 'plus'
  | 'bell'
  | 'mic'
  | 'sparkle'
  | 'sun'
  | 'external'
  | 'bars'
  | 'gear'
  | 'alert'
  | 'arrowRight'
  | 'close';

type Props = {
  name: IconName;
  size?: number;
  color: string;
  /** Fill colour for solid icons such as the star and flame. */
  fill?: string;
  strokeWidth?: number;
};

type P = {
  fill: string;
  stroke: string;
  strokeWidth: number;
  strokeLinecap: 'round';
  strokeLinejoin: 'round';
};

function shapes(name: IconName, p: P) {
  switch (name) {
    case 'home':
      return <Path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" {...p} />;
    case 'book':
      return (
        <>
          <Path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" {...p} />
          <Path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20" {...p} fill="none" />
        </>
      );
    case 'storybook':
      return (
        <>
          <Path d="M2.5 5.5C5.5 4 9 4 12 6c3-2 6.5-2 9.5-.5V19c-3-1.5-6.5-1.5-9.5.5-3-2-6.5-2-9.5-.5z" {...p} />
          <Path d="M12 6v13.5" {...p} fill="none" />
        </>
      );
    case 'user':
      return (
        <>
          <Circle cx={12} cy={8} r={4} {...p} />
          <Path d="M4 21a8 8 0 0 1 16 0" {...p} fill="none" />
        </>
      );
    case 'chat':
      return <Path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" {...p} />;
    case 'speaker':
      return (
        <>
          <Path d="M4 9v6h4l5 4V5L8 9H4z" {...p} />
          <Path d="M16.5 9a4 4 0 0 1 0 6" {...p} fill="none" />
        </>
      );
    case 'play':
      return <Polygon points="7,4 20,12 7,20" {...p} />;
    case 'lock':
      return (
        <>
          <Rect x={5} y={11} width={14} height={9} rx={2} {...p} />
          <Path d="M8 11V8a4 4 0 0 1 8 0v3" {...p} fill="none" />
        </>
      );
    case 'flame':
      return <Path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z" {...p} />;
    case 'shield':
      return <Path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3z" {...p} />;
    case 'star':
      return <Polygon points="12,2.5 14.9,8.6 21.5,9.4 16.6,14 18,20.6 12,17.3 6,20.6 7.4,14 2.5,9.4 9.1,8.6" {...p} />;
    case 'check':
      return <Path d="M5 12.5l4.5 4.5L19 7.5" {...p} fill="none" />;
    case 'chevronRight':
      return <Path d="M9 5l7 7-7 7" {...p} fill="none" />;
    case 'plus':
      return <Path d="M12 5v14M5 12h14" {...p} fill="none" />;
    case 'bell':
      return (
        <>
          <Path d="M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7z" {...p} />
          <Path d="M10 20a2 2 0 0 0 4 0" {...p} fill="none" />
        </>
      );
    case 'mic':
      return (
        <>
          <Rect x={9} y={3} width={6} height={11} rx={3} {...p} />
          <Path d="M5 11a7 7 0 0 0 14 0M12 18v3" {...p} fill="none" />
        </>
      );
    case 'sparkle':
      return <Path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" {...p} />;
    case 'sun':
      return (
        <>
          <Circle cx={12} cy={12} r={4} {...p} />
          <Path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" {...p} fill="none" />
        </>
      );
    case 'external':
      return <Path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" {...p} fill="none" />;
    case 'bars':
      return <Path d="M5 20V10M12 20V4M19 20v-7" {...p} fill="none" />;
    case 'gear':
      return (
        <>
          <Circle cx={12} cy={12} r={3} {...p} />
          <Path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" {...p} fill="none" />
        </>
      );
    case 'alert':
      return <Path d="M12 6v8M12 18v.01" {...p} fill="none" />;
    case 'arrowRight':
      return <Path d="M5 12h14M13 6l6 6-6 6" {...p} fill="none" />;
    case 'close':
      return <Path d="M6 6l12 12M18 6L6 18" {...p} fill="none" />;
  }
}

/** Simple outline icons drawn with SVG, so no icon font has to be downloaded. */
export function Icon({ name, size = 24, color, fill = 'none', strokeWidth = 2.2 }: Props) {
  const p: P = { fill, stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round' };
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {shapes(name, p)}
    </Svg>
  );
}
