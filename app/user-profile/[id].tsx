// [id].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import usePosts from '@/hooks/usePosts';
import useUsersStore from '@/hooks/useUsers';
import PostListItem from '@/components/post';
import UserProfile from '@/components/basic/UserProfile';
import { actuatedNormalizeVertical } from '@/constants/DynamicSize';
import { User } from '@/constants/Types';
import { ActivityIndicator } from 'react-native';
import { Colors } from '@/hooks/useThemeColor';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function UserPostsScreen() {
  const { id } = useLocalSearchParams();
  const fetchPostsByUserId = usePosts(state => state.fetchPostsByUserId);
  const posts = usePosts(state => state.userPosts);
  const loading = usePosts(state => state.loading);
  const error = usePosts(state => state.error);
  const getUserById = useUsersStore(state => state.getUserById);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        await fetchPostsByUserId(id as string);
        const userData = await getUserById(id as string);
        setUser(userData);
      }
    };
    fetchData();
  }, [id, fetchPostsByUserId, getUserById]);

  if (loading) {
    return (
      <View
        style={{
          ...styles.container,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" color={Colors.light.secondary} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          ...styles.container,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MaterialCommunityIcons name="wifi-alert" size={50} color="gray" />
        <Text style={{ color: '#909090', fontWeight: 'bold' }}>
          No internet connection.{' '}
        </Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'User Profile' }} />
      <View style={styles.container}>
        <FlatList
          data={posts}
          renderItem={({ item }) => <PostListItem post={item} />}
          keyExtractor={item => item.id || Math.random().toString()}
          contentContainerStyle={styles.postList}
          ListHeaderComponent={user && <UserProfile user={user} />}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postList: {
    paddingBottom: actuatedNormalizeVertical(10),
  },
});
