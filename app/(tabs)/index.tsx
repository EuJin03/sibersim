import PostListItem from '@/components/post';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import usePosts from '@/hooks/usePosts';
import { Colors } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  View,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { fuzzySearch } from '@/utils/fuzzySearch';
import NetInfo from '@react-native-community/netinfo';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { MaterialIcons } from '@expo/vector-icons';

export default function Blog() {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const router = useRouter();
  const { posts, loading, error, hasMore, fetchPosts, fetchMorePosts } =
    usePosts();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (state.isConnected === false) {
        showMessage({
          message: 'No internet connection',
          description: "You're offline. Some features may be unavailable.",
          type: 'warning',
          duration: 3000,
        });
      } else if (state.isConnected === true && isConnected === false) {
        showMessage({
          message: 'Back online',
          description: 'Your internet connection has been restored.',
          type: 'success',
          duration: 3000,
        });
      }
    });

    fetchPosts();

    return () => {
      unsubscribe();
    };
  }, []);

  const onRefresh = async () => {
    if (isConnected) {
      setRefreshing(true);
      await fetchPosts();
      setRefreshing(false);
    } else {
      showMessage({
        message: "Can't refresh",
        description: "You're offline. Please check your internet connection.",
        type: 'warning',
        duration: 3000,
      });
    }
  };

  const loadMorePosts = async () => {
    if (!loading && hasMore && isConnected) {
      await fetchMorePosts();
    }
  };

  const filteredPosts = useMemo(() => {
    return fuzzySearch(searchQuery, posts, ['content']);
  }, [posts, searchQuery]);

  const renderNoConnectionView = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <MaterialIcons
        name="signal-wifi-statusbar-connected-no-internet-4"
        size={24}
        color="black"
      />
      <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
        No internet connection
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: 'gray',
          textAlign: 'center',
          marginTop: 10,
        }}
      >
        Please check your connection and try again
      </Text>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <FlashMessage position="top" />
        {isConnected === false && posts.length === 0 ? (
          renderNoConnectionView()
        ) : (
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
                  onPress={() => {
                    if (isConnected) {
                      router.push('/new-post');
                    } else {
                      showMessage({
                        message: "Can't create new post",
                        description:
                          "You're offline. Please check your internet connection.",
                        type: 'warning',
                        duration: 3000,
                      });
                    }
                  }}
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
              isConnected === false ? (
                renderNoConnectionView()
              ) : (
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
              )
            }
            bounces
            alwaysBounceVertical
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

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

// useEffect(() => {
//   const migrateBlogsToSanity = async () => {
//     try {
//       // Create an array to store the migration promises
//       const migrationPromises = blogs.map(async blog => {
//         // Check if the blogs already exists in Sanity
//         const existingBlogs = await client.fetch(
//           `*[_type == "blog" && id == $id][0]`,
//           { id: blog.id }
//         );

//         if (existingBlogs) {
//           console.log(`Blog with ID ${blog.id} already exists. Skipping...`);
//           return;
//         }

//         // Create a new document in Sanity for the blogs
//         await client.create({
//           _type: 'blog',
//           ...blog,
//         });

//         console.log(`Blog with ID ${blog.id} migrated successfully.`);
//       });

//       // Wait for all migration promises to resolve
//       await Promise.all(migrationPromises);

//       console.log('Data migration completed successfully.');
//     } catch (error) {
//       console.error('Error during data migration:', error);
//     }
//   };

//   migrateBlogsToSanity();
// }, []);
