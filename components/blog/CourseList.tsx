import { FlatList, Image, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { materials } from '@/assets/seeds/material';
import { Text, TouchableRipple } from 'react-native-paper';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import { useRouter } from 'expo-router';
import { Material } from '@/constants/Types';
import useRelativeTime from '@/hooks/useTimeFormat';
import { client } from '@/utils/sanity';

export default function CourseList({
  courseItems,
}: {
  courseItems: Material[];
}) {
  const router = useRouter();

  const courseHandler = (item: Material) => {
    const { id } = item;
    router.push({
      pathname: `/course/${id}`,
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
        Recommended Course
      </Text>
      <FlatList
        data={courseItems}
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
                    {item.title}
                  </Text>
                  <Text style={{ fontSize: 10, color: '#b1b1b1' }}>
                    {useRelativeTime(item.publishedAt)}
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
