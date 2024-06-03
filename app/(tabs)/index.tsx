import { View, Text, ScrollView, RefreshControl, FlatList } from 'react-native';
import React, { useState } from 'react';
import PostListItem from '@/components/post';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { actuatedNormalize } from '@/constants/DynamicSize';

export default function blog() {
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <PostListItem />
          <PostListItem />
          <PostListItem />
          <PostListItem />
          {/* <FlatList data={items} renderItem={({item}) => <PostListItem item={item} />} contentContainerStyle={{gap: actuatedNormalize(10)}} onEndReached={}/> */}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
