import {
  StyleSheet,
  useColorScheme,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useAuth } from '@/contexts/userContext';
import SearchBar from '@/components/blog/SearchBar';
import Slider from '@/components/blog/Slider';
import VideoCourseList from '@/components/blog/VideoCourseList';
import CourseList from '@/components/blog/CourseList';
import { actuatedNormalize } from '@/constants/DynamicSize';
import { useState } from 'react';

export default function HomeScreen() {
  const colorScheme = 'light';
  const { dbUser, signOut } = useAuth();

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <>
      <ScrollView
        style={{
          ...style.container,
          backgroundColor: colorScheme === 'light' ? '#f1f1f1' : '#2f3233',
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <SearchBar />
        <Slider />
        <VideoCourseList />
        <CourseList />
      </ScrollView>
    </>
  );
}

const style = StyleSheet.create({
  container: {
    paddingHorizontal: actuatedNormalize(20),
    height: '100%',
  },
});
