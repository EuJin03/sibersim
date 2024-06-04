import { Dimensions, ScrollView, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text } from 'react-native-paper';
import { Stack, useLocalSearchParams } from 'expo-router';
import YoutubePlayer, { getYoutubeMeta } from 'react-native-youtube-iframe';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import Avatar from '@/components/user/Avatar';
import useRelativeTime from '@/hooks/useTimeFormat';
import { Material } from '@/constants/Types';
import { materials } from '@/assets/seeds/material';

const loadVideoThumbnail = async (videoId: string) => {
  return (await getYoutubeMeta(videoId)).thumbnail_url;
};

export default function Video() {
  const { id } = useLocalSearchParams();
  const item = materials.find(material => material.id === id);

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
          {item?.title}
        </Text>
        <Text
          style={{
            color: 'gray',
            fontSize: actuatedNormalize(10),
            marginTop: actuatedNormalizeVertical(7),
            marginBottom: actuatedNormalizeVertical(20),
          }}
        >
          {useRelativeTime(item?.publishedAt || '')}
        </Text>

        <YoutubePlayer
          height={actuatedNormalizeVertical(230)}
          width={Dimensions.get('window').width - actuatedNormalize(40)}
          videoId={item?.videoUrl || ''}
          contentScale={1}
        />
        <Text variant="labelLarge">About Course</Text>
        <Text
          numberOfLines={20}
          style={{
            marginVertical: actuatedNormalizeVertical(6),
            color: '#171617',
            fontWeight: 200,
            fontSize: actuatedNormalize(12),
            lineHeight: actuatedNormalize(20),
          }}
        >
          {item?.description}
        </Text>
      </View>
    </>
  );
}
