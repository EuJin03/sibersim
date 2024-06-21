import { ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Surface, Text, Avatar as PaperAvatar } from 'react-native-paper';
import Avatar from '@/components/user/Avatar';
import usePosts from '@/hooks/usePosts';
import PostDetail from '@/components/post/PostDetails';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import CommentCard from '@/components/post/CommentCard';
import { View } from 'react-native';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { TouchableOpacity, TextInput } from 'react-native';
import { useAuth } from '@/contexts/userContext';
import { Colors } from '@/hooks/useThemeColor';

type FormData = {
  content: string;
};

export default function PostDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { dbUser } = useAuth();

  const { posts, loading, postLoading, error, fetchPostById } = usePosts();
  const { control, handleSubmit, reset, getValues } = useForm<FormData>();
  const { submitComment, upvoteComment } = usePosts();

  const onSubmit: SubmitHandler<FormData> = async data => {
    await submitComment(post?.id ?? '', {
      ...data,
      postedBy: dbUser?.displayName || '',
      authorId: dbUser?.id || '',
      upvote: [],
      authorJob: dbUser?.jobPosition || '',
      authorImage: dbUser?.profilePicture || '',
    });
    reset();
  };

  const handlePostRefresh: () => void = () => {
    if (id) {
      fetchPostById(id as string);
    }
  };

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
      <View style={{ flex: 1 }}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={handlePostRefresh}
              tintColor={'#ffffff'}
              progressBackgroundColor={'#ffffff'}
              colors={[Colors.light.secondary]}
            />
          }
          style={{ flexGrow: 1, marginBottom: actuatedNormalizeVertical(65) }}
        >
          <PostDetail post={post} />
          <View style={{ backgroundColor: '#ffffff' }}>
            {/* Render comments for the specific post */}
            {post.comments.map(comment => (
              <CommentCard
                key={comment.createdAt}
                comment={comment}
                postId={post.id ?? ''}
              />
            ))}
          </View>
        </ScrollView>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: actuatedNormalize(10),
            paddingVertical: actuatedNormalizeVertical(14),
            backgroundColor: '#ffffff',
            gap: actuatedNormalize(10),
          }}
        >
          <PaperAvatar.Image
            style={{ flexBasis: '8%' }}
            source={{ uri: dbUser?.profilePicture }}
            size={actuatedNormalize(32)}
          />
          <Controller
            control={control}
            name="content"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Leave your thoughts here..."
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                style={{
                  flexBasis: '78%',
                  height: actuatedNormalizeVertical(36),
                  borderRadius: 10,
                  backgroundColor: '#ffffff',

                  paddingHorizontal: actuatedNormalize(10),
                }}
                multiline
              />
            )}
          />
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={{
              flexBasis: '14%',
            }}
            disabled={postLoading}
          >
            <Text
              style={{
                color: postLoading ? '#979797' : Colors.light.secondary,
                fontWeight: 'bold',
              }}
            >
              Post
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
