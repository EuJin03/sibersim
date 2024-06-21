import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import { Text } from 'react-native-paper';
import MUI from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';
import { Topic } from '@/constants/Types';
import useUsersStore from '@/hooks/useUsers';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function CourseContent({
  courseId,
  courseTopics,
}: {
  courseId: string;
  courseTopics: Topic[];
}) {
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const router = useRouter();
  const dbUser = useUsersStore(state => state.dbUser);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);

  const getUserProgress = useUsersStore(state => state.getUserProgress);

  useEffect(() => {
    const fetchUserProgress = async () => {
      if (dbUser && dbUser.id) {
        const progress = await getUserProgress(dbUser.id, courseId);
        setCompletedTopics(progress.completedTopics);
      }
    };

    fetchUserProgress();
  }, [dbUser, courseId, getUserProgress]);

  useEffect(() => {
    if (dbUser && dbUser.progress && dbUser.progress[courseId]) {
      setCompletedTopics(dbUser.progress[courseId].completedTopics);
    }
  }, [dbUser, courseId]);

  const isTopicCompleted = (topicId: string) => {
    return completedTopics.includes(topicId);
  };

  return (
    <>
      <View style={{ marginTop: actuatedNormalizeVertical(10) }}>
        <Text variant="labelLarge">Course Content</Text>
        <FlatList
          data={courseTopics}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() =>
                router.navigate({
                  pathname: `/course-chapter/${courseId}`,
                  params: { topicId: item.id },
                })
              }
              style={style.contentContainer}
            >
              <Text style={style.contentIndex}>
                {index < 10 ? '0' + (index + 1) : index + 1}
              </Text>
              <Text numberOfLines={1} style={style.contentTitle}>
                {item.name}
              </Text>
              {isTopicCompleted(item.id) ? (
                <MUI name="check-circle" color="green" size={24} />
              ) : (
                <MUI
                  name="play-circle"
                  size={24}
                  color={Colors[colorScheme].secondary}
                />
              )}
            </TouchableOpacity>
          )}
        />
      </View>
    </>
  );
}

const style = StyleSheet.create({
  contentContainer: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginVertical: actuatedNormalizeVertical(6),
    padding: actuatedNormalize(14),
    alignItems: 'center',
    borderRadius: 5,
  },
  contentIndex: {
    fontWeight: 'bold',
    fontSize: actuatedNormalize(16),
    color: 'gray',
    marginRight: actuatedNormalize(14),
  },
  contentTitle: {
    fontWeight: 'bold',
    fontSize: actuatedNormalize(14),
    color: 'black',
    flex: 1,
  },
});
