import React, { createContext, useContext } from 'react';

import type { ThemeKind } from './bands';
import { themes, type Theme } from './tokens';

const ThemeContext = createContext<Theme>(themes.intermediate);

/**
 * Wrap a part of the app in a ThemeProvider and every component inside
 * (Button, Card, Text...) takes on that look. This is how one codebase
 * becomes three learner experiences plus a parent experience.
 */
export function ThemeProvider({ kind, children }: { kind: ThemeKind; children: React.ReactNode }) {
  return <ThemeContext.Provider value={themes[kind]}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
