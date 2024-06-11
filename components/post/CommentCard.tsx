import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { FontAwesome } from '@expo/vector-icons';
import useRelativeTime from '@/hooks/useTimeFormat';
import { Colors } from '@/hooks/useThemeColor';
import { useAuth } from '@/contexts/userContext';
import usePosts from '@/hooks/usePosts';
import { Comment } from '@/constants/Types';

type FormData = {
  content: string;
};

export default function CommentCard({
  comment,
  postId,
}: {
  comment: Comment;
  postId: string;
}) {
  const { dbUser } = useAuth();
  const { control, handleSubmit, reset } = useForm<FormData>();
  const { submitComment, upvoteComment } = usePosts();

  const onSubmit: SubmitHandler<FormData> = async data => {
    await submitComment(postId, {
      ...data,
      postedBy: dbUser?.displayName || '',
      authorId: dbUser?.id || '',
      upvote: [],
      authorJob: dbUser?.jobPosition || '',
      authorImage: dbUser?.profilePicture || '',
    });
    reset();
  };

  const onUpvote = async () => {
    await upvoteComment(postId, comment.id!, dbUser?.id!);
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <View
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
      >
        <Image
          source={{ uri: comment.authorImage }}
          style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8 }}
        />
        <View>
          <Text style={{ fontWeight: 'bold' }}>{comment.postedBy}</Text>
          <Text style={{ fontSize: 12, color: 'gray' }}>
            {comment.authorJob}
          </Text>
          <Text style={{ fontSize: 12, color: 'gray' }}>
            {useRelativeTime(comment.createdAt)}
          </Text>
        </View>
      </View>
      <Text>{comment.content}</Text>
      <View
        style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}
      >
        <TouchableOpacity
          onPress={onUpvote}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <FontAwesome
            name="thumbs-o-up"
            size={14}
            color={
              comment.upvote.includes(dbUser?.id!)
                ? Colors.light.primary
                : 'gray'
            }
            style={{ marginRight: 4 }}
          />
          <Text
            style={{
              fontSize: 12,
              color: comment.upvote.includes(dbUser?.id!)
                ? Colors.light.primary
                : 'gray',
            }}
          >
            {comment.upvote.length}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 16 }}>
        <Controller
          control={control}
          name="content"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Write a comment..."
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                borderRadius: 4,
                padding: 8,
                marginBottom: 8,
              }}
            />
          )}
        />
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          style={{
            backgroundColor: Colors.light.primary,
            padding: 8,
            borderRadius: 4,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
