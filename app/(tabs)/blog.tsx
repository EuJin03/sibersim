import {
  StyleSheet,
  useColorScheme,
  ScrollView,
  RefreshControl,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '@/contexts/userContext';
import Slider from '@/components/blog/Slider';
import VideoCourseList from '@/components/blog/VideoCourseList';
import CourseList from '@/components/blog/CourseList';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import { useEffect, useState } from 'react';
import useMaterialStore from '@/hooks/useMaterial';
import { ActivityIndicator, Icon, Searchbar, Text } from 'react-native-paper';
import { fuzzySearch } from '@/utils/fuzzySearch';
import { Colors } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  // const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colorScheme = 'light';
  const { dbUser, signOut } = useAuth();
  const router = useRouter();

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { materials, fetchMaterials, courseItems, videoItems, loading } =
    useMaterialStore();
  useEffect(() => {
    fetchMaterials();
  }, []);

  const filteredCourseItems = fuzzySearch(searchQuery, courseItems, [
    'title',
    'description',
  ]);
  const filteredVideoItems = fuzzySearch(searchQuery, videoItems, [
    'title',
    'description',
  ]);

  const isSearching = searchQuery.trim() !== '';
  const showCourseList = filteredCourseItems.length > 0;
  const showVideoCourseList = filteredVideoItems.length > 0;

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMaterials();
    setRefreshing(false);
  };

  return (
    <>
      <ScrollView
        style={{
          ...style.container,
          backgroundColor: colorScheme === 'light' ? '#f1f1f1' : '#2f3233',
          flex: 1,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={'#ffffff'}
            progressBackgroundColor={'#ffffff'}
            colors={[Colors.light.secondary]}
          />
        }
      >
        <View
          style={{
            marginTop: actuatedNormalizeVertical(16),
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: '#ffffff',
              borderRadius: actuatedNormalize(20),
              borderWidth: 1,
              borderColor: Colors.light.secondary,
              flexBasis: '88%',
            }}
          >
            <Searchbar
              placeholder="Search"
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={{
                height: actuatedNormalize(40),
                fontSize: actuatedNormalize(14),
                backgroundColor: '#ffffff',
              }}
              elevation={1}
              inputStyle={{
                minHeight: 0, // Add this
              }}
              iconColor={Colors.dark.secondary}
            />
          </View>
          <TouchableOpacity
            style={{
              flexBasis: '10%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => router.push('/leaderboard')}
          >
            <View
              style={{
                borderRadius: 60,
                borderWidth: 0,
                borderColor: '#ffffff',
                padding: actuatedNormalize(5),
              }}
            >
              <Icon
                source="chart-box-outline"
                color={Colors.light.secondary}
                size={26}
              />
            </View>
          </TouchableOpacity>
        </View>
        {loading ? (
          <View style={style.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.light.secondary} />
          </View>
        ) : (
          <>
            {searchQuery === '' && <Slider materials={courseItems} />}
            {showCourseList && <CourseList courseItems={filteredCourseItems} />}
            {showVideoCourseList && (
              <VideoCourseList videoItems={filteredVideoItems} />
            )}
            {!showCourseList && !showVideoCourseList && (
              <View style={style.noResultsContainer}>
                <Text>
                  {isSearching
                    ? 'No results found'
                    : 'There are no courses available at the moment'}
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </>
  );
}

const style = StyleSheet.create({
  container: {
    paddingHorizontal: actuatedNormalize(20),
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    marginTop: actuatedNormalizeVertical(120),
  },
  noResultsContainer: {
    height: actuatedNormalizeVertical(300),
    width: Dimensions.get('screen').width - 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
