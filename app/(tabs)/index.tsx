import PostListItem from '@/components/post';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import usePosts from '@/hooks/usePosts';
import { Colors } from '@/hooks/useThemeColor';
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  View,
  Pressable,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Icon, Searchbar, Text, TouchableRipple } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Blog() {
  const pathname = usePathname();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const router = useRouter();
  const { posts, loading, error, hasMore, fetchPosts, fetchMorePosts } =
    usePosts();

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const loadMorePosts = async () => {
    if (!loading && hasMore) {
      await fetchMorePosts();
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(post =>
      post.content.toLowerCase().includes(search.toLowerCase())
    );
  }, [posts, search]);

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <FlatList
          data={filteredPosts}
          renderItem={({ item }) => <PostListItem post={item} />}
          keyExtractor={item => item.id ?? Math.random().toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMorePosts}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading ? (
              <ActivityIndicator
                style={{ paddingVertical: actuatedNormalizeVertical(20) }}
              />
            ) : null
          }
          ListHeaderComponent={
            <View
              style={{
                backgroundColor: '#ffffff',
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                flexDirection: 'row',
                paddingHorizontal: actuatedNormalize(4),
                margin: 0,
              }}
            >
              <View
                style={{
                  flexBasis: '87%',
                  paddingHorizontal: actuatedNormalize(20),
                  marginLeft: actuatedNormalize(10),
                  backgroundColor: '#ffffff',
                  borderRadius: actuatedNormalize(20),
                  borderWidth: 1,
                  borderColor: Colors.light.secondary,
                  marginVertical: actuatedNormalizeVertical(10),
                }}
              >
                <TextInput
                  style={{
                    height: actuatedNormalize(40),
                    fontSize: actuatedNormalize(14),
                  }}
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search"
                  inlineImageLeft="search"
                />
              </View>
              <TouchableOpacity
                style={{
                  flexBasis: '13%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => router.push('/new-post')}
              >
                <View
                  style={{
                    borderRadius: 60,
                    borderWidth: 1,
                    borderColor: '#f1f1f1',
                    padding: actuatedNormalize(5),
                    backgroundColor: '#f1f1f1',
                  }}
                >
                  <Icon
                    source="plus-box-outline"
                    color={Colors.light.secondary}
                    size={24}
                  />
                </View>
              </TouchableOpacity>
            </View>
          }
          ListEmptyComponent={
            <View
              style={{
                height: actuatedNormalize(200),
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 14, color: 'gray' }}>
                No results found
              </Text>
            </View>
          }
          bounces
          alwaysBounceVertical
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
