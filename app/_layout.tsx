import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import * as NavigationBar from 'expo-navigation-bar';
import { PaperProvider } from 'react-native-paper';

import { useColorScheme } from '@/hooks/useColorScheme';
import { StatusBar } from 'expo-status-bar';
import { AuthContextProvider } from '@/contexts/userContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LightTheme, DarkTheme } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';
import Avatar from '@/components/user/Avatar';
import Header from '@/components/home/Header';

import { DefaultTheme } from '@react-navigation/native';

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
  const colorScheme = useColorScheme() === 'dark' ? 'light' : 'dark';
  console.log(colorScheme);
  const paperTheme =
    colorScheme === 'dark'
      ? { ...DarkTheme, colors: DarkTheme.colors }
      : { ...LightTheme, colors: LightTheme.colors };

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(
      colorScheme === 'dark' ? '#000000' : '#ffffff'
    );
    NavigationBar.setButtonStyleAsync(
      colorScheme === 'dark' ? 'light' : 'dark'
    );
  }, [colorScheme]);

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

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
      <PaperProvider
        theme={paperTheme}
        settings={{
          icon: props => <MaterialIcons {...props} />,
        }}
      >
        <StatusBar style="auto" />
        <Stack
          initialRouteName="(tabs)"
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors[colorScheme ?? 'light'].background,
            },
            headerTintColor: Colors[colorScheme ?? 'light'].secondary,
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{
              title: '',
              headerLeft: () => <Header />,
              headerRight: () => <Avatar />,
            }}
          />
        </Stack>
      </PaperProvider>
    </AuthContextProvider>
  );
}
