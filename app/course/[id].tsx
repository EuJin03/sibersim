import { View } from 'react-native';
import React, { useEffect } from 'react';
import { Text, ActivityIndicator } from 'react-native-paper';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ScaledImage } from '@/components/basic/ScaledImage';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import Avatar from '@/components/user/Avatar';
import CourseContent from '@/components/blog/CourseContent';
import useRelativeTime from '@/hooks/useTimeFormat';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import useMaterialStore from '@/hooks/useMaterial';
import { Colors } from '@/hooks/useThemeColor';

export default function Course() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { fetchCourseById, currentCourse, loading } = useMaterialStore();

  const { showMessage: shouldShowMessage } = useLocalSearchParams();

  useEffect(() => {
    if (id) {
      fetchCourseById(id as string);
    }
  }, [id, fetchCourseById]);

  useEffect(() => {
    if (shouldShowMessage === 'true') {
      showMessage({
        message: 'Congratulations!',
        description: 'You have completed this topic.',
        type: 'success',
        duration: 3000,
        titleStyle: { fontWeight: 'bold' },
        floating: true,
        icon: 'success',
      });
    }

    // Cleanup function to reset the value on unmount
    router.setParams({ showMessage: 'false' });
  }, [shouldShowMessage]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.light.secondary} />
      </View>
    );
  }

  if (!currentCourse) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Course not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerRight: () => <Avatar />,
          animation: 'slide_from_right',
        }}
      />
      <FlashMessage position={'top'} />

      <View
        style={{
          flex: 1,
          padding: actuatedNormalize(20),
          backgroundColor: '#f1f1f1',
        }}
      >
        <Text variant="titleLarge" numberOfLines={2}>
          {currentCourse.title}
        </Text>
        <Text style={{ color: 'gray', fontSize: actuatedNormalize(10) }}>
          {useRelativeTime(currentCourse.publishedAt)}
        </Text>
        {currentCourse?.thumbnail && (
          <ScaledImage uri={currentCourse.thumbnail} />
        )}
        <Text variant="labelLarge">About Course</Text>
        <Text
          numberOfLines={6}
          style={{
            marginVertical: actuatedNormalizeVertical(6),
            color: '#171617',
          }}
          variant="bodySmall"
        >
          {currentCourse.description}
        </Text>

        {currentCourse?.id && currentCourse?.topic && (
          <CourseContent
            courseId={currentCourse.id}
            courseTopics={currentCourse.topic}
          />
        )}
      </View>
    </>
  );
}
