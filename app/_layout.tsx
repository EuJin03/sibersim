import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { AuthContextProvider } from '@/contexts/userContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  //  React.useEffect(() => {
  //    (async () => {
  //      const theme = await AsyncStorage.getItem('theme');
  //      if (Platform.OS === 'web') {
  //        // Adds the background color to the html element to prevent white background on overscroll.
  //        document.documentElement.classList.add('bg-background');
  //      }
  //      if (!theme) {
  //        AsyncStorage.setItem('theme', colorScheme);
  //        return;
  //      }
  //      const colorTheme = theme === 'dark' ? 'dark' : 'light';
  //      if (colorTheme !== colorScheme) {
  //        setColorScheme(colorTheme);
  //        return;
  //      }
  //      setIsColorSchemeLoaded(true);
  //    })().finally(() => {
  //      SplashScreen.hideAsync();
  //    });
  //  }, []);

  //  if (!isColorSchemeLoaded) {
  //    return null;
  //  }

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
      <ThemeProvider value={colorScheme === 'dark' ? DefaultTheme : DarkTheme}>
        <StatusBar style={colorScheme === 'dark' ? 'dark' : 'light'} />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </AuthContextProvider>
  );
}
