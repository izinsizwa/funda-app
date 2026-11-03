import { Fredoka_500Medium, Fredoka_600SemiBold } from '@expo-google-fonts/fredoka';
import { Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useActiveProfile, useSession, themeKindFor } from '@/state/session';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { themes } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync();

/**
 * The root of the app, and the place where ONE app becomes several experiences.
 *
 *  1. The active profile decides the THEME (Grade R-3, 4-6, 7-9 or parent).
 *  2. The active profile decides which route groups are reachable
 *     (Stack.Protected): signed out, choosing a profile, learner, or parent.
 *
 * When a guard flips (for example the learner taps "Switch learner"), Expo
 * Router removes that screen and sends the user to `index`, which redirects
 * to wherever the new state belongs.
 */
export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Fredoka_500Medium,
    Fredoka_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  const signedIn = useSession((s) => s.signedIn);
  const profile = useActiveProfile();
  const kind = themeKindFor(profile);
  const theme = themes[kind];

  if (!fontsLoaded && !fontError) return null;

  const isLearner = signedIn && profile?.role === 'learner';
  const isParent = signedIn && profile?.role === 'parent';

  return (
    <SafeAreaProvider>
      <ThemeProvider kind={kind}>
        <StatusBar style={theme.dark ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.bg } }}>
          <Stack.Screen name="index" />

          <Stack.Protected guard={!signedIn}>
            <Stack.Screen name="sign-in" />
          </Stack.Protected>

          <Stack.Protected guard={signedIn && !profile}>
            <Stack.Screen name="who-is-learning" />
          </Stack.Protected>

          <Stack.Protected guard={signedIn && !isParent}>
            <Stack.Screen name="parent-pin" options={{ presentation: 'modal' }} />
          </Stack.Protected>

          <Stack.Protected guard={isLearner}>
            <Stack.Screen name="learner" />
            <Stack.Screen name="lesson/[id]" />
          </Stack.Protected>

          <Stack.Protected guard={isParent}>
            <Stack.Screen name="parent" />
            <Stack.Screen name="add-learner" options={{ presentation: 'modal' }} />
          </Stack.Protected>
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
