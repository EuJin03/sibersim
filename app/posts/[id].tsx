import { ActivityIndicator, ScrollView } from 'react-native';
import PostListItem from '@/components/post';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Surface, Text } from 'react-native-paper';
import Avatar from '@/components/user/Avatar';
import usePosts from '@/hooks/usePosts';
import { useEffect } from 'react';
import PostDetail from '@/components/post/PostDetails';
import { actuatedNormalizeVertical } from '@/constants/DynamicSize';

export default function PostDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { posts, loading, error, fetchPostById } = usePosts();

  useEffect(() => {
    if (id) {
      fetchPostById(id as string);
    }
  }, [id]);

  if (loading) {
    return (
      <ActivityIndicator
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: actuatedNormalizeVertical(400),
        }}
      />
    );
  }

  if (error) {
    console.log(error);
    return <Text>Something went wrong...</Text>;
  }

  const post = posts.find(post => post.id === id);

  if (!post) {
    return <Text>Post not found</Text>;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerRight: () => <Avatar />,
          animation: 'slide_from_right',
          animationDuration: 50,
        }}
      />
      <ScrollView>
        <PostDetail post={post} />
        <Surface>
          <Text>Comments</Text>
          {/* Render comments for the specific post */}
          {post.comments.map(comment => (
            <Text key={comment.id}>{comment.content}</Text>
          ))}
        </Surface>
      </ScrollView>
    </>
  );
}
