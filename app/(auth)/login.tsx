import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/userContext';
import { Stack, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';

export default function SignIn() {
  const { signIn, signOut } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignIn = () => {
    setIsLoading(true);
    signIn();
    setIsLoading(false);
  };

  return (
    <View style={{ backgroundColor: '#ffffff', height: '100%' }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Image
        source={{
          uri: 'https://firebasestorage.googleapis.com/v0/b/sibersim-2a3c3.appspot.com/o/onboarding.png?alt=media&token=e7203442-f738-4dd3-ad5a-7bf5d095292b',
        }}
        style={{
          width: actuatedNormalize(320),
          height: actuatedNormalize(320),
          marginVertical: actuatedNormalizeVertical(50),
        }}
        resizeMode="cover"
      />
      <Text>Embrace the future of learning with Sibersim!🎉</Text>
      <Text>
        Boost your cybersecurity skills with us. Let's get started on securing
        your digital life!
      </Text>
      <Button onPress={handleSignIn} loading={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign in with Google'}
      </Button>
      <Button onPress={signOut}>sign out</Button>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
