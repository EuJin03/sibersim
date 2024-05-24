import { ActivityIndicator, ScrollView, Text } from 'react-native';
// import posts from '../../../assets/data/posts.json';
import PostListItem from '@/components/post';
import { useLocalSearchParams } from 'expo-router';
import ThemedView from '@/components/ThemedView';

export default function PostDetailsScreen() {
  // const { id } = useLocalSearchParams();
  // const { loading, error, data } = useQuery(query, { variables: { id } });

  // if (loading) {
  //   return <ActivityIndicator />;
  // }
  // if (error) {
  //   console.log(error);
  //   return <Text>Something went wrong...</Text>;
  // }

  return (
    <ScrollView>
      <PostListItem />
      <ThemedView className="h-[1000px] w-full bg-red-500"></ThemedView>
    </ScrollView>
  );
}
