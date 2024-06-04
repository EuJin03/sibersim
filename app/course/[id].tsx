import { ScrollView, View } from 'react-native';
import React from 'react';
import { Text } from 'react-native-paper';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ScaledImage } from '@/components/basic/ScaledImage';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import Avatar from '@/components/user/Avatar';
import CourseContent from '@/components/blog/CourseContent';

export default function Course() {
  const { title, thumbnail, description } = useLocalSearchParams();
  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerRight: () => <Avatar />,
          animation: 'slide_from_right',
        }}
      />
      <View
        style={{ padding: actuatedNormalize(20), backgroundColor: '#f1f1f1' }}
      >
        <Text variant="titleLarge" numberOfLines={2}>
          {title}
        </Text>
        <Text variant="bodySmall">Course</Text>
        {thumbnail && (
          <ScaledImage
            uri={Array.isArray(thumbnail) ? thumbnail[0] : thumbnail}
          />
        )}
        <Text variant="labelLarge">About Course</Text>
        <Text
          numberOfLines={3}
          style={{ marginTop: actuatedNormalizeVertical(4), color: '#171617' }}
          variant="bodySmall"
        >
          {description}
        </Text>
        {description && (
          <CourseContent
            course={Array.isArray(description) ? description[0] : description}
          />
        )}
      </View>
    </>
  );
}
