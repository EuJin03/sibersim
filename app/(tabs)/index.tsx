import { View, Text, ScrollView, RefreshControl, FlatList } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import PostListItem from '@/components/post';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { actuatedNormalize } from '@/constants/DynamicSize';
import { useRouter } from 'expo-router';

export default function blog() {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push('/settings');
    }, 500);
  });

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
