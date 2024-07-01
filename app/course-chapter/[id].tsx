import {
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import Avatar from '@/components/user/Avatar';
import { Text } from 'react-native-paper';
import { Colors } from '@/hooks/useThemeColor';
import LearningProgressBar from '@/components/blog/LearningProgressBar';
import { Material, Topic } from '@/constants/Types';
import useUsersStore from '@/hooks/useUsers';
import useMaterialStore from '@/hooks/useMaterial';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';

export default function CourseChapter() {
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const { id, topicId } = useLocalSearchParams();
  let chapterRef = useRef<FlatList | null>(null);
  const router = useRouter();
  const { materials } = useMaterialStore(state => state);

  const course = materials.find(material => material.id === id) as Material;
  const topic = course?.topic?.find(topic => topic.id === topicId) as Topic;
  const lessons = topic?.lesson || [];
  const topicLength = lessons.length;

  const [progress, setProgress] = useState<number>(1 / topicLength);
  const dbUser = useUsersStore(state => state.dbUser);
  const updateUserProgress = useUsersStore(state => state.updateUserProgress);

  const [isUpdating, setIsUpdating] = useState(false);

  const onClickNext = async (index: number) => {
    if (isUpdating) return;

    setIsUpdating(true);

    if (dbUser && dbUser.id && id) {
      if (index === topicLength - 1) {
        setProgress(1);

        try {
          router.setParams({ showMessage: 'true' });
          router.back();
          // @ts-ignore
          await updateUserProgress(dbUser.id, id, topicId);
        } catch (err) {
          console.warn('Error updating user progress:', err);
        }
      } else {
        chapterRef.current?.scrollToIndex({
          animated: true,
          index: index + 1,
        });
        setProgress((index + 2) / topicLength);
      }
    } else {
      console.warn('User or course ID is missing');
    }

    setIsUpdating(false);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerRight: () => <Avatar />,
          animation: 'slide_from_right',
        }}
      />
      <FlatList
        data={lessons}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        ref={chapterRef}
        renderItem={({ item, index }) => (
          <View style={styles.container}>
            <LearningProgressBar progress={progress} />
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text variant="titleLarge" style={styles.title}>
                {item.title}
              </Text>
              <Text variant="bodySmall">{item.description}</Text>
            </ScrollView>

            <TouchableOpacity
              onPress={() => onClickNext(index)}
              disabled={isUpdating}
              style={[
                styles.button,
                { backgroundColor: Colors[colorScheme].primary },
                isUpdating && styles.buttonDisabled,
              ]}
            >
              {isUpdating ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>
                  {index === topicLength - 1 ? 'Complete' : 'Next'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('screen').width,
    display: 'flex',
    justifyContent: 'space-between',
    flex: 1,
    paddingVertical: actuatedNormalize(24),
    paddingHorizontal: actuatedNormalize(20),
  },
  title: {
    fontWeight: 700,
    marginVertical: actuatedNormalizeVertical(12),
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: actuatedNormalize(10),
    borderRadius: 7,
    marginTop: actuatedNormalizeVertical(18),
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#ffffff',
  },
});
