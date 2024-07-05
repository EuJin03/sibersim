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
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Icon, Searchbar, Text, TouchableRipple } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { fuzzySearch } from '@/utils/fuzzySearch';
import { materials } from '@/assets/seeds/material';
import { client } from '@/utils/sanity';

export default function Blog() {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
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
    return fuzzySearch(searchQuery, posts, ['content']);
  }, [posts, searchQuery]);

  // useEffect(() => {
  //   const migrateMaterialsToSanity = async () => {
  //     try {
  //       // Create an array to store the migration promises
  //       const migrationPromises = materials.map(async material => {
  //         // Check if the material already exists in Sanity
  //         const existingMaterial = await client.fetch(
  //           `*[_type == "material" && id == $id][0]`,
  //           { id: material.id }
  //         );

  //         if (existingMaterial) {
  //           console.log(
  //             `Material with ID ${material.id} already exists. Skipping...`
  //           );
  //           return;
  //         }

  //         // Create a new document in Sanity for the material
  //         await client.create({
  //           _type: 'material',
  //           ...material,
  //         });

  //         console.log(`Material with ID ${material.id} migrated successfully.`);
  //       });

  //       // Wait for all migration promises to resolve
  //       await Promise.all(migrationPromises);

  //       console.log('Data migration completed successfully.');
  //     } catch (error) {
  //       console.error('Error during data migration:', error);
  //     }
  //   };

  //   migrateMaterialsToSanity();
  // }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <FlatList
          data={filteredPosts}
          renderItem={({ item }) => <PostListItem post={item} />}
          keyExtractor={item => item.id ?? Math.random().toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={'#ffffff'}
              progressBackgroundColor={'#ffffff'}
              colors={[Colors.light.secondary]}
            />
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
                  value={searchQuery}
                  onChangeText={setSearchQuery}
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
                    borderColor: '#ffffff',
                    padding: actuatedNormalize(5),
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
