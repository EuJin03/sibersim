import { ActivityIndicator, ScrollView } from 'react-native';
// import posts from '../../../assets/data/posts.json';
import PostListItem from '@/components/post';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Surface, Text } from 'react-native-paper';
import Avatar from '@/components/user/Avatar';

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
    <>
      <Stack.Screen
        options={{
          title: 'Post',
          headerRight: () => <Avatar />,
          animation: 'slide_from_right',
          animationDuration: 50,
        }}
      />
      <ScrollView>
        <PostListItem />
        <Surface>
          <Text>Comments</Text>
        </Surface>
      </ScrollView>
    </>
  );
}
