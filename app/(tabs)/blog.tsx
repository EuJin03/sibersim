import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
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
import NetInfo from '@react-native-community/netinfo';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function HomeScreen() {
  const colorScheme = 'light';
  const router = useRouter();

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { fetchMaterials, courseItems, videoItems, loading } =
    useMaterialStore();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const newConnectionStatus = state.isConnected ?? true;
      if (newConnectionStatus !== isConnected) {
        setIsConnected(newConnectionStatus);
        if (!newConnectionStatus) {
          showMessage({
            message: 'No internet connection',
            description: "You're offline. Some features may be unavailable.",
            type: 'warning',
            duration: 3000,
          });
        } else {
          showMessage({
            message: 'Back online',
            description: 'Your internet connection has been restored.',
            type: 'success',
            duration: 3000,
          });
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isConnected]);

  useEffect(() => {
    if (isConnected) {
      fetchMaterials();
    }
  }, [isConnected]);

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
    if (isConnected) {
      setRefreshing(true);
      await fetchMaterials();
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

  const renderNoConnectionView = () => (
    <View style={style.noConnectionContainer}>
      <MaterialIcons
        name="signal-wifi-statusbar-connected-no-internet-4"
        size={50}
        color={Colors.light.secondary}
      />
      <Text style={style.noConnectionText}>No internet connection</Text>
      <Text style={style.noConnectionSubText}>
        Please check your connection and try again
      </Text>
    </View>
  );

  return (
    <>
      <FlashMessage position="top" />
      <ScrollView
        style={{
          ...style.container,
          backgroundColor: colorScheme === 'light' ? '#f1f1f1' : '#2f3233',
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
        {!isConnected && (
          <View style={style.offlineBar}>
            <Text style={style.offlineText}>No internet connection</Text>
          </View>
        )}
        <View style={style.searchContainer}>
          <View style={style.searchBarContainer}>
            <Searchbar
              placeholder="Search"
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={style.searchBar}
              elevation={1}
              inputStyle={{ minHeight: 0 }}
              iconColor={Colors.dark.secondary}
            />
          </View>
          <TouchableOpacity
            style={style.leaderboardButton}
            onPress={() => {
              if (isConnected) {
                router.push('/leaderboard');
              } else {
                showMessage({
                  message: "Can't access leaderboard",
                  description:
                    "You're offline. Please check your internet connection.",
                  type: 'warning',
                  duration: 3000,
                });
              }
            }}
          >
            <View style={style.leaderboardIcon}>
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
        ) : !isConnected &&
          courseItems.length === 0 &&
          videoItems.length === 0 ? (
          renderNoConnectionView()
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
                    : isConnected
                    ? 'There are no courses available at the moment'
                    : 'Cannot load courses while offline'}
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
  offlineBar: {
    backgroundColor: 'red',
    paddingHorizontal: 10,
  },
  offlineText: {
    color: 'white',
    textAlign: 'center',
  },
  searchContainer: {
    marginTop: actuatedNormalizeVertical(16),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchBarContainer: {
    backgroundColor: '#ffffff',
    borderRadius: actuatedNormalize(20),
    borderWidth: 1,
    borderColor: Colors.light.secondary,
    flexBasis: '88%',
  },
  searchBar: {
    height: actuatedNormalize(40),
    fontSize: actuatedNormalize(14),
    backgroundColor: '#ffffff',
  },
  leaderboardButton: {
    flexBasis: '10%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaderboardIcon: {
    borderRadius: 60,
    borderWidth: 0,
    borderColor: '#ffffff',
    padding: actuatedNormalize(5),
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
  noConnectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: actuatedNormalizeVertical(50),
  },
  noConnectionText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  noConnectionSubText: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginTop: 10,
  },
});
