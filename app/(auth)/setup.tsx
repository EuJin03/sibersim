import { View, Text, Button } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import { useAuth } from '@/contexts/userContext';
import MUI from '@expo/vector-icons/MaterialCommunityIcons';

function Icon(props: {
  name: React.ComponentProps<typeof MUI>['name'];
  color: string;
}) {
  return <MUI size={22} style={{ marginBottom: -6 }} {...props} />;
}

export default function setup() {
  const { signOut } = useAuth();

  return (
    <>
      <Stack.Screen options={{ title: 'SiberSim' }} />
      <View>
        <View>
          <Button title="signout" onPress={signOut} />
        </View>
      </View>
    </>
  );
}
