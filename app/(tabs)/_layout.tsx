import { Tabs } from 'expo-router';
import React from 'react';
import { Colors } from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from 'react-native';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={20} style={{ marginBottom: -6 }} {...props} />;
}

export default function TabLayout({}) {
  // const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colorScheme = 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tint,
        tabBarInactiveTintColor: Colors.light.inactive,
        tabBarActiveBackgroundColor: Colors.light.background,
        tabBarInactiveBackgroundColor: Colors.light.background,
        headerShown: false,
        tabBarLabelStyle: {
          paddingBottom: 6,
        },
        tabBarStyle: {
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ color }: { color: string }) => (
            <TabBarIcon name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="blog"
        options={{
          title: 'Learning',
          tabBarIcon: ({ color }: { color: string }) => (
            <TabBarIcon name="book" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="single_post"
        options={{
          title: 'Blogs',
          tabBarIcon: ({ color }: { color: string }) => (
            <TabBarIcon name="newspaper-o" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="simulation"
        options={{
          title: 'Simulation',
          tabBarIcon: ({ color }: { color: string }) => (
            <TabBarIcon name="flag" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }: { color: string }) => (
            <TabBarIcon name="gear" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
