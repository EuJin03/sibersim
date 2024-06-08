import {
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import Avatar from '@/components/user/Avatar';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import { Text } from 'react-native-paper';
import { Colors } from '@/hooks/useThemeColor';
import LearningProgressBar from '@/components/blog/LearningProgressBar';
import { materials } from '@/assets/seeds/material';
import { Material, Topic } from '@/constants/Types';

export default function CourseChapter() {
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const { id, topicId } = useLocalSearchParams();
  let chapterRef = useRef<FlatList | null>(null);
  const router = useRouter();

  const { topic } = materials.find(material => material.id === id) as Material;
  const { lesson } = topic?.find(topic => topic.id === topicId) as Topic;
  const topicLength = lesson?.length ?? 1;

  const [progress, setProgress] = useState<number>(1 / topicLength);
  const onClickNext = (index: number) => {
    try {
      if (index === topicLength - 1) {
        router.back();
        return;
      }
      // @ts-ignores
      chapterRef.scrollToIndex({ animated: true, index: index + 1 });
      setProgress((index + 2) / topicLength);
    } catch (err) {
      console.warn('Error: ', err);
      router.back();
    }
  };

  useEffect(() => {
    console.log('TODO: add course chapter details');
  }, []);
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
        data={lesson}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        ref={ref => {
          // @ts-ignore
          chapterRef = ref;
        }}
        renderItem={({ item, index }) => (
          <View
            style={{
              width: Dimensions.get('screen').width,
              display: 'flex',
              justifyContent: 'space-between',
              flex: 1,
              paddingVertical: actuatedNormalize(24),
              paddingHorizontal: actuatedNormalize(20),
            }}
          >
            <LearningProgressBar progress={progress} />
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text
                variant="titleLarge"
                style={{
                  fontWeight: 700,
                  marginVertical: actuatedNormalizeVertical(12),
                }}
              >
                {item.title}
              </Text>
              <Text variant="bodySmall">{item.description}</Text>
              <Text variant="bodySmall">{item.description}</Text>

              <Text variant="bodySmall">{item.description}</Text>

              <Text variant="bodySmall">{item.description}</Text>
            </ScrollView>

            <TouchableOpacity
              onPress={() => onClickNext(index)}
              style={{
                backgroundColor: Colors[colorScheme].primary,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: actuatedNormalize(10),
                borderRadius: 7,
                marginTop: actuatedNormalizeVertical(18),
              }}
            >
              <Text style={{ color: '#ffffff' }}>
                {index === topicLength - 1 ? 'Complete' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </>
  );
}