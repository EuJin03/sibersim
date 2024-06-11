import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import useRelativeTime from '@/hooks/useTimeFormat';
import { Colors } from '@/hooks/useThemeColor';
import { useAuth } from '@/contexts/userContext';
import usePosts from '@/hooks/usePosts';
import { Comment } from '@/constants/Types';
import { Avatar, Icon } from 'react-native-paper';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';

export default function CommentCard({
  comment,
  postId,
}: {
  comment: Comment;
  postId: string;
}) {
  const { dbUser } = useAuth();
  const { upvoteComment } = usePosts();

  const onUpvote = async () => {
    await upvoteComment(postId, comment.createdAt!, dbUser?.id!);
  };

  return (
    <View
      style={{
        paddingHorizontal: actuatedNormalize(10),
        paddingVertical: actuatedNormalizeVertical(10),
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      }}
    >
      <View
        style={{
          borderRadius: 32,
          borderWidth: 2,
          borderColor: '#ffffff',
        }}
      >
        <Avatar.Image
          source={{ uri: comment.authorImage }}
          size={actuatedNormalize(36)}
          style={{}}
        />
      </View>
      <View
        style={{ display: 'flex', flexDirection: 'column', flexBasis: '88%' }}
      >
        <View
          style={{
            paddingHorizontal: actuatedNormalize(10),
            marginLeft: actuatedNormalize(6),
            backgroundColor: '#f1f1f1',
            borderRadius: 7,
            paddingVertical: actuatedNormalizeVertical(8),
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              marginBottom: actuatedNormalizeVertical(6),
              flex: 1,
            }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                padding: 0,
                marginBottom: actuatedNormalizeVertical(-2),
              }}
            >
              <Text
                style={{
                  flexBasis: '70%',
                  fontWeight: 'bold',
                }}
              >
                {comment.postedBy}
              </Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-end',
                  gap: 6,
                  padding: 0,
                  borderWidth: 0,
                  flexBasis: '30%',
                }}
              >
                <Text style={{ fontSize: 9 }}>
                  {useRelativeTime(comment.createdAt)}
                </Text>
                <View style={{ padding: 2 }}>
                  <Icon source="dots-horizontal" size={10} color="#000000" />
                </View>
              </View>
            </View>
            <Text style={{ fontSize: 11, color: '#909090' }}>
              {comment.authorJob}
            </Text>
          </View>

          <View style={{ backgroundColor: '#f1f1f1' }}>
            <Text>{comment.content}</Text>
          </View>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            flexBasis: '88%',
            paddingTop: actuatedNormalizeVertical(6),
            maxHeight: actuatedNormalizeVertical(24),
            paddingHorizontal: actuatedNormalize(10),
            gap: actuatedNormalize(10),
            borderWidth: 0,
          }}
        >
          <TouchableOpacity onPress={onUpvote}>
            <Icon
              source="thumb-up-outline"
              size={14}
              color={
                comment.upvote.includes(dbUser?.id!)
                  ? Colors.light.primary
                  : 'gray'
              }
            />
          </TouchableOpacity>
          <Text style={{ fontSize: 11 }}>
            {comment.upvote.length > 0
              ? comment.upvote.length + ' likes'
              : '0 like'}
          </Text>
        </View>
      </View>
    </View>
  );
}
