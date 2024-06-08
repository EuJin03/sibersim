import { View, FlatList, TouchableHighlight, Image } from 'react-native';
import React, { useCallback, useState, useEffect } from 'react';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import { Text } from 'react-native-paper';
import YoutubePlayer, { getYoutubeMeta } from 'react-native-youtube-iframe';
import { Material } from '@/constants/Types';
import { materials } from '@/assets/seeds/material';
import { router } from 'expo-router';

const loadVideoThumbnail = async (videoId: string) => {
  return (await getYoutubeMeta(videoId)).thumbnail_url;
};

export default function VideoCourseList() {
  const [items, setItems] = useState<Material[]>([]);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      setCurrentPlayingIndex(null);
    }
  }, []);

  useEffect(() => {
    const fetchThumbnails = async () => {
      const videoMaterials = materials.filter(
        material => material.type === 'video'
      );

      const thumbnailPromises = videoMaterials.map(async material => {
        const thumbnail = await loadVideoThumbnail(material.videoUrl || '');
        return {
          ...material,
          thumbnail,
        };
      });

      const fetchedItems = await Promise.all(thumbnailPromises);
      setItems(fetchedItems);
      setIsLoading(false); // Set loading state to false after fetching thumbnails
    };

    fetchThumbnails();
  }, []);

  return (
    <View style={{ marginTop: actuatedNormalizeVertical(10) }}>
      <Text
        variant="titleMedium"
        style={{
          marginBottom: actuatedNormalizeVertical(3),
          marginLeft: actuatedNormalize(3),
        }}
      >
        Video Course
      </Text>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <View>
            <TouchableHighlight
              onPress={() => router.navigate(`/video-course/${item.id}`)}
              style={{
                width: actuatedNormalize(240),
                height: actuatedNormalize(138),
              }}
            >
              <Image
                source={{ uri: item.thumbnail || '' }}
                style={{
                  width: actuatedNormalize(240),
                  height: actuatedNormalize(138),
                  borderWidth: 2,
                  borderColor: '#f1f1f1',
                }}
                resizeMode="cover"
              />
            </TouchableHighlight>
          </View>
        )}
        keyExtractor={item => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

{
  /* <FlatList
  data={items}
  renderItem={({ item, index }) =>
    currentPlayingIndex === index ? (
      <View
        style={{
          borderRadius: 9,
          borderWidth: 2,
          borderColor: '#f1f1f1',
        }}
      >
        {item.type === 'video' && (
          <YoutubePlayer
            height={actuatedNormalizeVertical(150)}
            width={actuatedNormalize(240)}
            play={true}
            videoId={item.videoUrl || ''}
            onChangeState={onStateChange}
            contentScale={0.7}
          />
        )}
      </View>
    ) : (
      <View>
        <TouchableHighlight onPress={() => setCurrentPlayingIndex(index)}>
          <Image
            source={{ uri: item.thumbnail || '' }}
            style={{
              width: actuatedNormalize(240),
              height: actuatedNormalizeVertical(154),
              borderWidth: 2,
              borderColor: '#f1f1f1',
            }}
            resizeMode="cover"
          />
        </TouchableHighlight>
      </View>
    )
  }
  keyExtractor={item => item.id}
  horizontal={true}
  showsHorizontalScrollIndicator={false}
/>; */
}
