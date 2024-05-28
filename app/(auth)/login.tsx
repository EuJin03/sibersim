import React, { useEffect } from 'react';
import { Button, View } from 'react-native';
import { useAuth } from '@/contexts/userContext';
import { Stack, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useUsers from '@/hooks/useUsers';

const SignIn: React.FC = () => {
  const { signIn, signOut } = useAuth();

  const fetchData = async () => {
    console.log(await AsyncStorage.getItem('dbUser'));
  };

  fetchData();

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
