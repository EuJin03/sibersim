import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { AuthContextProvider } from '@/contexts/userContext';
import seedData from '@/hooks/useSeedData';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const [colorScheme, setColorScheme] = useState(useColorScheme());
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // React.useEffect(() => {
  //   (async () => {
  //     const theme = await AsyncStorage.getItem('theme');
  //     if (Platform.OS === 'web') {
  //       // Adds the background color to the html element to prevent white background on overscroll.
  //       document.documentElement.classList.add('bg-background');
  //     }
  //     if (!theme) {
  //       AsyncStorage.setItem('theme', colorScheme ?? 'light');
  //       return;
  //     }
  //     const colorTheme = theme === 'dark' ? 'dark' : 'light';
  //     if (colorTheme !== colorScheme) {
  //       setColorScheme(colorTheme);
  //       return;
  //     }
  //     setIsColorSchemeLoaded(true);
  //   })().finally(() => {
  //     SplashScreen.hideAsync();
  //   });
  // }, []);

  // if (!isColorSchemeLoaded) {
  //   return null;
  // }

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthContextProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar style={colorScheme === 'dark' ? 'dark' : 'light'} />
        <Stack initialRouteName="(tabs)">
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </AuthContextProvider>
  );
}
