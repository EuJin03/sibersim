import { useFonts } from 'expo-font';
import { Stack, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import * as NavigationBar from 'expo-navigation-bar';
import { PaperProvider } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthContextProvider } from '@/contexts/userContext';
import MaterialIcons from '@expo/vector-icons/MaterialCommunityIcons';
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
  console.log(usePathname());
  const colorScheme = 'light';
  const paperTheme = { ...LightTheme, colors: LightTheme.colors };

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync('#000000');
    NavigationBar.setButtonStyleAsync('light');
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
        <StatusBar style="dark" />
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
              headerRight: () =>
                usePathname() === '/settings' ? null : <Avatar />,
            }}
          />
        </Stack>
      </PaperProvider>
    </AuthContextProvider>
  );
}
