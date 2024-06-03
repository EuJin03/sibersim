import { View } from 'react-native';
import React from 'react';
import { Text } from 'react-native-paper';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ScaledImage } from '@/components/basic/ScaledImage';
import { actuatedNormalize } from '@/constants/DynamicSize';

export default function Course() {
  const { title, thumbnail } = useLocalSearchParams();
  return (
    <>
      <Stack.Screen options={{ title: '' }} />
      <View
        style={{ padding: actuatedNormalize(20), backgroundColor: '#f1f1f1' }}
      >
        <Text>{title}</Text>
        <Text>Course</Text>
        {thumbnail && <ScaledImage uri={thumbnail} />}
      </View>
    </>
  );
}
