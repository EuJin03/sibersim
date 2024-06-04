import { ScrollView, View } from 'react-native';
import React from 'react';
import { Text } from 'react-native-paper';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ScaledImage } from '@/components/basic/ScaledImage';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import Avatar from '@/components/user/Avatar';
import CourseContent from '@/components/blog/CourseContent';
import useRelativeTime from '@/hooks/useTimeFormat';
import { Material } from '@/constants/Types';
import { materials } from '@/assets/seeds/material';

export default function Course() {
  const { id } = useLocalSearchParams();
  const item = materials.find(material => material.id === id) as Material;

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
          {item.title}
        </Text>
        <Text style={{ color: 'gray', fontSize: actuatedNormalize(10) }}>
          {useRelativeTime(item.publishedAt)}
        </Text>
        {item?.thumbnail && <ScaledImage uri={item.thumbnail} />}
        <Text variant="labelLarge">About Course</Text>
        <Text
          numberOfLines={6}
          style={{
            marginVertical: actuatedNormalizeVertical(6),
            color: '#171617',
          }}
          variant="bodySmall"
        >
          {item.description}
        </Text>

        {item?.id && item?.topic && (
          <CourseContent courseId={item.id} courseTopics={item.topic} />
        )}
      </View>
    </>
  );
}
