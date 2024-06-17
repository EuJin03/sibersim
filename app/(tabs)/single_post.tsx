import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import { Colors } from '@/hooks/useThemeColor';
import { Searchbar } from 'react-native-paper';
import { Blog } from '@/constants/Types';
import useRelativeTime from '@/hooks/useTimeFormat';
import useBlogStore from '@/hooks/useBlogs';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

export default function blogpost() {
  const [search, setSearch] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const blogs = useBlogStore(state => state.blogs);
  const setSelectedBlog = useBlogStore(state => state.setSelectedBlog);
  const navigation = useNavigation();

  const uniqueTags = Array.from(new Set(blogs.flatMap(blog => blog.tags)));

  const handleTagPress = (tag: string) => {
    setSelectedTag(tag === selectedTag ? null : tag);
  };

  const renderTagItem = ({ item }: { item: string }) => {
    const isSelected = item === selectedTag;
    return (
      <TouchableOpacity
        style={{
          borderRadius: actuatedNormalize(20),
          paddingHorizontal: actuatedNormalize(10),
          paddingVertical: actuatedNormalize(7),
          marginRight: actuatedNormalize(10),
          backgroundColor: isSelected ? Colors.light.secondary : 'transparent',
          borderWidth: isSelected ? 0 : 1,
          borderColor: Colors.light.secondary,
          display: 'flex',
          alignItems: 'center',
        }}
        onPress={() => handleTagPress(item)}
      >
        <Text
          style={{
            color: isSelected ? '#ffffff' : Colors.light.secondary,
            fontSize: actuatedNormalize(14),
          }}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderBlogItem = ({ item }: { item: Blog }) => (
    <TouchableOpacity
      style={{
        backgroundColor: '#ffffff',
        borderRadius: actuatedNormalize(10),
        padding: actuatedNormalize(12),
        marginBottom: actuatedNormalizeVertical(16),
        shadowColor: '#909090',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: actuatedNormalize(10),
      }}
      onPress={() => {
        setSelectedBlog(item);
        router.navigate({ pathname: `/blog-details/${item.slug}` });
      }}
    >
      <Image
        source={{ uri: item.image }}
        style={{
          width: actuatedNormalize(120),
          height: actuatedNormalize(150),
          borderRadius: actuatedNormalize(10),
        }}
        resizeMode="cover"
      />

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: actuatedNormalize(11),
            color: '#888',
            marginBottom: actuatedNormalizeVertical(5),
          }}
          numberOfLines={1}
        >
          {item.author} · {useRelativeTime(item.date)}
        </Text>
        <Text
          style={{
            fontSize: actuatedNormalize(16),
            fontWeight: 'bold',
            marginBottom: actuatedNormalizeVertical(8),
          }}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text
          style={{ fontSize: actuatedNormalize(12), color: '#888' }}
          numberOfLines={3}
        >
          {item.content[0].value}
        </Text>
        <FlatList
          data={item.tags}
          renderItem={({ item }) => (
            <Text
              style={{
                fontSize: actuatedNormalize(10),
                color: Colors.light.secondary,
                marginRight: actuatedNormalize(5),
                paddingVertical: actuatedNormalize(4),
                paddingHorizontal: actuatedNormalize(6),
                marginTop: actuatedNormalizeVertical(10),
                borderWidth: 1,
                borderColor: Colors.light.secondary,
                borderRadius: actuatedNormalize(10),
                height: actuatedNormalize(23),
              }}
            >
              {item}
            </Text>
          )}
          keyExtractor={item => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{}}
        />
      </View>
    </TouchableOpacity>
  );

  const filteredBlogs = selectedTag
    ? blogs.filter(
        blog =>
          blog.tags.includes(selectedTag) &&
          blog.title.toLowerCase().includes(search.toLowerCase())
      )
    : blogs.filter(blog =>
        blog.title.toLowerCase().includes(search.toLowerCase())
      );

  return (
    <View
      style={{
        marginHorizontal: actuatedNormalize(10),
        flex: 1,
      }}
    >
      <View
        style={{
          backgroundColor: '#ffffff',
          borderRadius: actuatedNormalize(20),
          borderWidth: 1,
          borderColor: Colors.light.secondary,
          marginTop: actuatedNormalizeVertical(16),
        }}
      >
        <Searchbar
          value={search}
          onChangeText={setSearch}
          placeholder="Search"
          style={{
            backgroundColor: '#ffffff',
            height: actuatedNormalize(40),
            fontSize: actuatedNormalize(14),
          }}
          elevation={1}
          inputStyle={{
            minHeight: 0,
          }}
        />
      </View>
      <View style={{ marginVertical: actuatedNormalizeVertical(10) }}>
        <FlatList
          data={uniqueTags}
          renderItem={renderTagItem}
          keyExtractor={item => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: actuatedNormalize(10) }}
        />
      </View>

      <FlatList
        data={filteredBlogs}
        renderItem={renderBlogItem}
        keyExtractor={item => item.id ?? Math.random().toString()}
        contentContainerStyle={{
          paddingHorizontal: actuatedNormalize(10),
          paddingVertical: actuatedNormalizeVertical(7),
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
