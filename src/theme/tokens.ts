import type { ThemeKind } from './bands';

export type Colors = {
  bg: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  muted: string;
  /** Card and control borders. */
  border: string;
  /** Stronger outline for secondary buttons. */
  outline: string;
  primary: string;
  onPrimary: string;
  /** Dark text for use on bright fills (yellow, teal, coral). */
  ink: string;
  white: string;
  sun: string;
  sunSoft: string;
  teal: string;
  tealSoft: string;
  coral: string;
  coralSoft: string;
  lavender: string;
  lavenderStrong: string;
  track: string;
};

export type ColorKey = keyof Colors;

export type Theme = {
  kind: ThemeKind;
  dark: boolean;
  colors: Colors;
  fonts: {
    heading: string;
    body: string;
    strong: string;
  };
  radius: { card: number; control: number; pill: number };
  /** Smallest comfortable tap target for this audience, in dp. */
  minTap: number;
  borderWidth: number;
  /** Height of the flat "sticker" shadow under cards and buttons. 0 = flat. */
  shadow: number;
};

const kidFonts = {
  heading: 'Fredoka_600SemiBold',
  body: 'Nunito_700Bold',
  strong: 'Nunito_800ExtraBold',
};

const cleanFonts = {
  heading: 'Nunito_800ExtraBold',
  body: 'Nunito_700Bold',
  strong: 'Nunito_800ExtraBold',
};

const cream: Colors = {
  bg: '#FFF7E8',
  surface: '#FFFFFF',
  surfaceAlt: '#FFFFFF',
  text: '#1E2A4A',
  muted: '#4A5675',
  border: '#1E2A4A',
  outline: '#1E2A4A',
  primary: '#3B5BFF',
  onPrimary: '#FFFFFF',
  ink: '#1E2A4A',
  white: '#FFFFFF',
  sun: '#FFC93C',
  sunSoft: '#FFE9A8',
  teal: '#5ED8C3',
  tealSoft: '#D8F5EE',
  coral: '#FF9A8A',
  coralSoft: '#FFE3DD',
  lavender: '#E7E3FF',
  lavenderStrong: '#C9C2FF',
  track: '#F1E7D2',
};

const night: Colors = {
  bg: '#0E1630',
  surface: '#18244A',
  surfaceAlt: '#213060',
  text: '#F4F6FF',
  muted: '#AEB8DB',
  border: '#2C3B6E',
  outline: '#5A6BA3',
  primary: '#FFC93C',
  onPrimary: '#0E1630',
  ink: '#0E1630',
  white: '#FFFFFF',
  sun: '#FFC93C',
  sunSoft: '#33406F',
  teal: '#3DD6BE',
  tealSoft: '#1F3A55',
  coral: '#FF8E7A',
  coralSoft: '#4A2D3F',
  lavender: '#213060',
  lavenderStrong: '#2C3B6E',
  track: '#2C3B6E',
};

const calm: Colors = {
  bg: '#FFFBF2',
  surface: '#FFFFFF',
  surfaceAlt: '#FFF1C9',
  text: '#1E2A4A',
  muted: '#4A5675',
  border: '#E8DFC9',
  outline: '#1E2A4A',
  primary: '#3B5BFF',
  onPrimary: '#FFFFFF',
  ink: '#1E2A4A',
  white: '#FFFFFF',
  sun: '#FFC93C',
  sunSoft: '#FFF1C9',
  teal: '#5ED8C3',
  tealSoft: '#D8F5EE',
  coral: '#FFB4A6',
  coralSoft: '#FFE3DD',
  lavender: '#E7E3FF',
  lavenderStrong: '#C9C2FF',
  track: '#EFE6D2',
};

export const themes: Record<ThemeKind, Theme> = {
  foundation: {
    kind: 'foundation',
    dark: false,
    colors: cream,
    fonts: kidFonts,
    radius: { card: 28, control: 24, pill: 999 },
    minTap: 60,
    borderWidth: 3,
    shadow: 5,
  },
  intermediate: {
    kind: 'intermediate',
    dark: false,
    colors: cream,
    fonts: kidFonts,
    radius: { card: 24, control: 20, pill: 999 },
    minTap: 52,
    borderWidth: 3,
    shadow: 5,
  },
  senior: {
    kind: 'senior',
    dark: true,
    colors: night,
    fonts: cleanFonts,
    radius: { card: 16, control: 12, pill: 999 },
    minTap: 48,
    borderWidth: 1,
    shadow: 0,
  },
  parent: {
    kind: 'parent',
    dark: false,
    colors: calm,
    fonts: cleanFonts,
    radius: { card: 20, control: 14, pill: 999 },
    minTap: 48,
    borderWidth: 1.5,
    shadow: 0,
  },
};
