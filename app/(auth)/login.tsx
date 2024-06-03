import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/userContext';
import { Stack, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

export default function SignIn() {
  const { signIn } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignIn = () => {
    setIsLoading(true);
    signIn();
    setIsLoading(true);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'SiberSim' }} />
      <Button onPress={handleSignIn} loading={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign in with Google'}
      </Button>
    </>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
