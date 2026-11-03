import React from 'react';
import { View } from 'react-native';

type Props = {
  columns?: number;
  gap?: number;
  children: React.ReactNode;
};

/** Equal-width grid built from rows, so it behaves the same on every platform. */
export function Grid({ columns = 2, gap = 12, children }: Props) {
  const items = React.Children.toArray(children);
  const rows: React.ReactNode[][] = [];
  for (let i = 0; i < items.length; i += columns) {
    rows.push(items.slice(i, i + columns));
  }
  return (
    <View style={{ gap }}>
      {rows.map((row, r) => (
        <View key={r} style={{ flexDirection: 'row', gap }}>
          {Array.from({ length: columns }, (_, c) => (
            <View key={c} style={{ flex: 1 }}>
              {row[c] ?? null}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
