import { View, FlatList, TouchableHighlight, Image } from 'react-native';
import React, { useCallback, useState, useEffect } from 'react';
import { videos } from '@/assets/seeds/material';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import { Text } from 'react-native-paper';
import YoutubePlayer, { getYoutubeMeta } from 'react-native-youtube-iframe';

interface VideoItem {
  id: string;
  title: string;
  desc: string;
  thumbnail: string;
  URL: string;
}

const loadVideoThumbnail = async (videoId: string) => {
  return (await getYoutubeMeta(videoId)).thumbnail_url;
};

export default function VideoCourseList() {
  const [items, setItems] = useState<VideoItem[]>([]);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(
    null
  );

  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      setCurrentPlayingIndex(null);
    }
  }, []);

  useEffect(() => {
    const fetchThumbnails = async () => {
      const thumbnailPromises = videos.map(async video => {
        const thumbnail = await loadVideoThumbnail(video.attributes.videoUrl);
        return {
          id: video.id,
          title: video.attributes.title,
          desc: video.attributes.description,
          thumbnail,
          URL: video.attributes.videoUrl,
        };
      });

      const fetchedItems = await Promise.all(thumbnailPromises);
      setItems(fetchedItems);
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
        renderItem={({ item, index }) =>
          currentPlayingIndex === index ? (
            <View
              style={{
                borderRadius: 9,
                borderWidth: 2,
                borderColor: '#f1f1f1',
              }}
            >
              <YoutubePlayer
                height={actuatedNormalizeVertical(150)}
                width={actuatedNormalize(240)}
                play={true}
                videoId={item.URL}
                onChangeState={onStateChange}
                contentScale={0.7}
              />
            </View>
          ) : (
            <View>
              <TouchableHighlight onPress={() => setCurrentPlayingIndex(index)}>
                <Image
                  source={{ uri: item.thumbnail }}
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
        keyExtractor={(item, index) => index.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
