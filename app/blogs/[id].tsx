import { View, Text } from 'react-native';
import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';

interface props {
  blogid: string;
}

export default function Blog() {
  const { blogid } = useLocalSearchParams();

  return (
    <>
      <Stack.Screen options={{ title: 'SiberSim' }} />
      <View>
        <Text>{blogid}</Text>
      </View>
    </>
  );
}
