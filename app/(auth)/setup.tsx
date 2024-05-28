import { View, Text, Button } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import ThemedView from '@/components/ThemedView';
import { useAuth } from '@/contexts/userContext';

export default function setup() {
  const { signOut } = useAuth();

  return (
    <>
      <Stack.Screen options={{ title: 'SiberSim' }} />
      <View>
        <ThemedView>
          <Button title="signout" onPress={signOut} />
        </ThemedView>
      </View>
    </>
  );
}
