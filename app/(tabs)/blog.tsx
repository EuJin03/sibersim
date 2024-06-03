import {
  Image,
  StyleSheet,
  Platform,
  View,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { useAuth } from '@/contexts/userContext';
import SearchBar from '@/components/blog/SearchBar';
import Slider from '@/components/blog/Slider';
import { Colors } from '@/constants/Colors';
import VideoCourseList from '@/components/blog/VideoCourseList';
import CourseList from '@/components/blog/CourseList';
import { actuatedNormalize } from '@/constants/DynamicSize';

export default function HomeScreen() {
  const colorScheme = 'light';
  const { dbUser, signOut } = useAuth();

  return (
    <>
      <ScrollView
        style={{
          ...style.container,
          backgroundColor: colorScheme === 'light' ? '#f1f1f1' : '#2f3233',
        }}
      >
        <SearchBar />
        <Slider />
        <VideoCourseList />
        <CourseList />

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
