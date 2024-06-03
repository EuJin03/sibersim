import {
  Dimensions,
  FlatList,
  Image,
  TouchableHighlight,
  View,
} from 'react-native';
import React from 'react';
import { articles, slider } from '@/assets/seeds/material';
import { Text, TouchableRipple } from 'react-native-paper';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import { router, useRouter } from 'expo-router';

interface CourseItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
}

export default function CourseList() {
  const router = useRouter();
  const articleItems: CourseItem[] = articles.map(article => ({
    id: article.id,
    title: article.title,
    description: article.description,
    thumbnail: article.thumbnail,
    duration: article.duration,
  }));

  const courseHandler = (item: CourseItem) => {
    router.push({
      pathname: `/course/${item.id}`,
      params: {
        title: item.title,
        description: item.description,
        thumbnail: item.thumbnail,
        duration: item.duration,
      },
    });
  };

  return (
    <View
      style={{
        marginTop: actuatedNormalizeVertical(10),
      }}
    >
      <Text
        variant="titleMedium"
        style={{
          marginBottom: actuatedNormalizeVertical(3),
          marginLeft: actuatedNormalize(3),
        }}
      >
        Advanced Course
      </Text>
      <FlatList
        data={articleItems}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: '#ffffff',
              marginRight: actuatedNormalize(10),
              borderRadius: 10,
            }}
          >
            <TouchableRipple onPress={() => courseHandler(item)}>
              <View>
                <Image
                  source={{ uri: item.thumbnail }}
                  style={{
                    width: actuatedNormalize(240),
                    borderTopRightRadius: 10,
                    height: actuatedNormalizeVertical(154),
                  }}
                  resizeMode="cover"
                />
                <View style={{ padding: actuatedNormalize(8) }}>
                  <Text
                    variant="bodySmall"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.title.length > 36
                      ? `${item.title.slice(0, 36)}...`
                      : item.title}
                  </Text>
                  <Text style={{ fontSize: 10, color: '#b1b1b1' }}>
                    {item.duration}
                  </Text>
                </View>
              </View>
            </TouchableRipple>
          </View>
        )}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
