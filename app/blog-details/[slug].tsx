import React from 'react';
import { View, Text, Image, ScrollView, Linking } from 'react-native';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import useBlogStore from '@/hooks/useBlogs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlatList } from 'react-native';
import { Colors } from '@/hooks/useThemeColor';
import useRelativeTime from '@/hooks/useTimeFormat';
import { Avatar as PaperAvatar } from 'react-native-paper';
import { Stack } from 'expo-router';
import Avatar from '@/components/user/Avatar';

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

export default function BlogDetails() {
  const selectedBlog = useBlogStore(state => state.selectedBlog);

  if (!selectedBlog) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No blog selected</Text>
      </View>
    );
  }

  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
  };

  const renderTextWithLinks = (text: string) => {
    const parts = text.split(URL_REGEX);
    return parts.map((part, index) => {
      if (part.match(URL_REGEX)) {
        return (
          <Text
            key={index}
            style={{ color: 'blue', textDecorationLine: 'underline' }}
            onPress={() => handleLinkPress(part)}
          >
            {part}
          </Text>
        );
      }
      return (
        <Text
          key={index}
          style={{ fontSize: actuatedNormalize(13), lineHeight: 20 }}
        >
          {part}
        </Text>
      );
    });
  };

  return (
    <>
      <Stack.Screen options={{ title: '', headerRight: () => <Avatar /> }} />
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: actuatedNormalize(26),
          paddingTop: actuatedNormalize(16),
        }}
        contentContainerStyle={{
          paddingBottom: actuatedNormalize(30),
        }}
      >
        <Image
          source={{ uri: selectedBlog.image }}
          style={{
            width: '100%',
            height: actuatedNormalize(200),
            borderRadius: actuatedNormalize(10),
            marginBottom: actuatedNormalizeVertical(16),
          }}
          resizeMode="cover"
        />
        <Text
          style={{
            fontSize: actuatedNormalize(24),
            fontWeight: 'bold',
            marginBottom: actuatedNormalizeVertical(6),
          }}
          selectable={true}
        >
          {selectedBlog.title}
        </Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: actuatedNormalize(10),
            marginBottom: actuatedNormalizeVertical(6),
          }}
        >
          <PaperAvatar.Image
            size={28}
            source={{ uri: selectedBlog.authorImage }}
          />
          <Text
            style={{
              fontSize: actuatedNormalize(14),
              color: '#888',
            }}
            selectable={true}
          >
            {selectedBlog.author}
          </Text>

          <Text
            style={{
              fontSize: actuatedNormalize(12),
              color: '#888',
            }}
          >
            {useRelativeTime(selectedBlog.date)}
          </Text>
        </View>
        <FlatList
          data={selectedBlog.tags}
          renderItem={({ item }) => (
            <Text
              style={{
                fontSize: actuatedNormalize(12),
                color: Colors.light.secondary,
                marginRight: actuatedNormalize(5),
                paddingVertical: actuatedNormalize(4),
                paddingHorizontal: actuatedNormalize(10),
                borderWidth: 1,
                borderColor: Colors.light.secondary,
                borderRadius: actuatedNormalize(10),
              }}
            >
              {item}
            </Text>
          )}
          keyExtractor={item => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            marginVertical: actuatedNormalizeVertical(8),
          }}
        />
        {selectedBlog.content.map((item, index) => {
          switch (item.type) {
            case 'text':
              return (
                <Text
                  key={index}
                  style={{
                    fontSize: actuatedNormalize(13),
                    lineHeight: 20,
                    textAlign: 'justify',
                  }}
                  selectable={true}
                >
                  {renderTextWithLinks(item.value)}
                </Text>
              );
            case 'subheader':
              return (
                <Text
                  key={index}
                  style={{
                    fontSize: actuatedNormalize(16),
                    fontWeight: 'bold',
                    marginTop: actuatedNormalize(10),
                  }}
                  selectable={true}
                >
                  {item.value}
                </Text>
              );
            case 'bullet':
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    gap: actuatedNormalize(8),
                    marginTop: actuatedNormalize(5),
                  }}
                >
                  <MaterialCommunityIcons
                    name="checkbox-marked-circle"
                    size={15}
                    color="black"
                    style={{
                      marginTop: actuatedNormalize(5),
                    }}
                  />
                  <Text
                    style={{
                      fontSize: actuatedNormalize(13),
                      lineHeight: 20,
                      flex: 1,
                      textAlign: 'justify',
                    }}
                    selectable={true}
                  >
                    {renderTextWithLinks(item.value)}
                  </Text>
                </View>
              );
            case 'image':
              return (
                <Image
                  key={index}
                  source={{ uri: item.value }}
                  style={{
                    width: '90%',
                    height: actuatedNormalize(180),
                    marginVertical: actuatedNormalize(10),
                    marginHorizontal: 'auto',
                  }}
                  resizeMode="cover"
                />
              );
            default:
              return null;
          }
        })}
      </ScrollView>
    </>
  );
}
