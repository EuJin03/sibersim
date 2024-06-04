import { FlatList, StyleSheet, View } from 'react-native';
import React from 'react';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import { Text } from 'react-native-paper';
import MUI from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors } from '@/hooks/useThemeColor';

const topic = [
  {
    id: 't00001',
    title: 'Cybersecurity',
  },
  {
    id: 't00002',
    title: 'Online Safety',
  },
  {
    id: 't00003',
    title: 'Privacy',
  },
];

export default function CourseContent({ course }: { course: string }) {
  const colorScheme = 'light';

  return (
    <View style={{ marginTop: actuatedNormalizeVertical(10) }}>
      <Text variant="labelLarge">Course Content</Text>
      <FlatList
        data={topic}
        renderItem={({ item, index }) => (
          <View style={style.contentContainer}>
            <Text style={style.contentIndex}>
              {index < 10 ? '0' + (index + 1) : index + 1}
            </Text>
            <Text numberOfLines={1} style={style.contentTitle}>
              {item.title}
            </Text>
            <MUI
              name="play-circle"
              size={24}
              color={Colors[colorScheme].secondary}
            />
          </View>
        )}
      />
    </View>
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
