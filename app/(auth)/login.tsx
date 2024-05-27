import React from 'react';
import { Button, View } from 'react-native';
import { useAuth } from '@/contexts/userContext';
import { Stack } from 'expo-router';

const SignIn: React.FC = () => {
  const { signIn } = useAuth();

  return (
    <>
      <Stack.Screen options={{ title: 'SiberSim' }} />
      <View>
        <Button title="Sign In with Google" onPress={signIn} />
      </View>
    </>
  );
};

export default SignIn;
