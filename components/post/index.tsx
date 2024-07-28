import {
  View,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  Dimensions,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Post } from '@/constants/Types';
import { FontAwesome } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import { Icon, Text } from 'react-native-paper';
import { useState } from 'react';
import useRelativeTime from '@/hooks/useTimeFormat';
import { Colors } from '@/hooks/useThemeColor';
import { useAuth } from '@/contexts/userContext';
import usePosts from '@/hooks/usePosts';

type PostListItemProps = {
  post: Post;
};

type FooterButtonProp = {
  text: string;
  icon: React.ComponentProps<typeof FontAwesome>['name'];
};

function FooterButton({ text, icon }: FooterButtonProp) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: actuatedNormalize(2),
      }}
    >
      <FontAwesome name={icon} size={14} color="gray" />
      <Text
        style={{
          marginLeft: 5,
          color: 'gray',
          fontWeight: 500,
          fontSize: 12,
        }}
      >
        {text}
      </Text>
    </View>
  );
}

export default function PostListItem({ post }: PostListItemProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLikeLoading, setIsLikeLoading] = useState<boolean>(false);
  const { dbUser } = useAuth();
  const { likePost } = usePosts();

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const handlePostDetail = () => {
    router.navigate(`/posts/${post.id}`);
  };

  const handleUserPosts = () => {
    router.navigate(`/user-profile/${post.authorId}`);
  };

  if (!post) return <View></View>;

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: '#ffffff',
        }}
      >
        <View style={styles.header}>
          <Pressable onPress={handleUserPosts}>
            <Image
              source={{
                uri: post?.authorImage,
              }}
              style={styles.userImage}
            />
          </Pressable>
          <Pressable
            onPress={handlePostDetail}
            style={styles.pressableContainer}
          >
            <View style={styles.postDetailsContainer}>
              <Text
                style={styles.userName}
                variant="bodyMedium"
                numberOfLines={1}
              >
                {post.postedBy}
              </Text>
              <Text style={styles.authorJob} numberOfLines={1}>
                {post.authorJob === '' ? 'member of SiberSim' : post.authorJob}
              </Text>
              <Text style={styles.createdAt} numberOfLines={1}>
                {useRelativeTime(post.createdAt ?? '2021-09-01T00:00:00')}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Text content */}
        <Text style={styles.content} selectable={true}>
          {post.content}
        </Text>

        {/* Image content */}
        {post.image && post.image.length > 1 ? (
          <FlatList
            data={post.image}
            horizontal
            pagingEnabled={true}
            renderItem={({ item, index }) => (
              <Pressable onPress={() => openImageModal(item)}>
                <View style={styles.imageContainer}>
                  <Text
                    style={{
                      position: 'absolute',
                      right: actuatedNormalize(8),
                      top: actuatedNormalize(8),
                      fontSize: actuatedNormalize(12),
                      backgroundColor: '#ffffff',
                      paddingVertical: actuatedNormalize(5),
                      paddingHorizontal: actuatedNormalize(7),
                      borderRadius: 8,
                      opacity: 0.3,
                      color: '#f1f1f1',
                      zIndex: 100,
                    }}
                  >{`${index + 1}/${post?.image?.length}`}</Text>
                  <Image
                    source={{ uri: item }}
                    style={{
                      width: Dimensions.get('screen').width,
                      height: Dimensions.get('screen').width * 0.7625,
                      backgroundColor: '#f1f1f1',
                    }}
                    resizeMode="cover"
                  />
                </View>
              </Pressable>
            )}
            keyExtractor={item =>
              item
                .split('')
                .sort(function () {
                  return 0.5 - Math.random();
                })
                .join('')
            }
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          post.image?.[0] && (
            <Pressable onPress={() => openImageModal(post?.image?.[0] ?? '')}>
              <View style={styles.singleImageContainer}>
                <Image
                  source={{ uri: post.image[0] }}
                  style={{
                    width: '100%',
                    height: undefined,
                    aspectRatio: 1.91,
                    backgroundColor: '#f1f1f1',
                  }}
                  resizeMode="cover"
                />
              </View>
            </Pressable>
          )
        )}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: actuatedNormalize(20),
            paddingBottom: actuatedNormalize(8),
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: actuatedNormalize(8),
            }}
          >
            <Icon size={16} source="thumb-up" color={Colors.light.primary} />
            <Text style={{ fontSize: 12, color: '#696969' }}>{`${
              post.upvote.length ?? 0
            }`}</Text>
          </View>
          <Pressable onPress={() => router.navigate(`/posts/${post.id}`)}>
            <Text
              style={{ fontSize: 12, color: '#696969' }}
            >{`${post.comments.length} comments`}</Text>
          </Pressable>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => {
              likePost(post.id ?? '', dbUser?.id ?? '');
            }}
            style={{
              flexDirection: 'row',

              gap: actuatedNormalize(2),
              paddingVertical: actuatedNormalize(8),
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <FontAwesome
              name={'thumbs-o-up'}
              size={14}
              color={
                (post.upvote || []).find(id => id === dbUser?.id)
                  ? Colors.light.primary
                  : '#909090'
              }
            />
            <Text
              style={{
                marginLeft: 5,
                fontWeight: 500,
                fontSize: 12,
                color: (post.upvote || []).find(id => id === dbUser?.id)
                  ? Colors.light.primary
                  : '#909090',
              }}
            >
              Like
            </Text>
          </TouchableOpacity>
          <Pressable
            onPress={() => router.navigate(`/posts/${post.id}`)}
            style={{
              paddingVertical: actuatedNormalize(8),
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <FooterButton text={`Comment`} icon="comment-o" />
          </Pressable>
          <Pressable
            style={{
              paddingVertical: actuatedNormalize(8),
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <FooterButton text="Share" icon="share" />
          </Pressable>
        </View>
      </View>
      <Modal
        visible={!!selectedImage}
        transparent={true}
        animationType="none"
        onRequestClose={closeImageModal}
      >
        <Pressable onPress={closeImageModal}>
          <View style={styles.modalContainer}>
            <Image
              source={{ uri: selectedImage || '' }}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f1f1f1',
    width: '100%',
    maxWidth: actuatedNormalize(500),
    alignSelf: 'center',
    marginBottom: actuatedNormalizeVertical(5),
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: actuatedNormalize(10),
  },
  pressableContainer: {
    flex: 1,
  },
  postDetailsContainer: {
    flex: 1,
  },

  authorJob: {
    fontSize: actuatedNormalize(10),
    color: '#121212',
  },
  createdAt: {
    marginVertical: actuatedNormalizeVertical(1),
    color: '#888888',
    fontSize: actuatedNormalize(10),
  },
  userName: {
    fontWeight: 'bold',
  },
  userImage: {
    width: actuatedNormalize(44),
    height: actuatedNormalize(44),
    borderRadius: 25,
    marginRight: actuatedNormalize(10),
  },

  // Body
  content: {
    margin: 10,
    marginTop: 0,
  },

  // Image
  singleImageContainer: {
    marginVertical: actuatedNormalizeVertical(10),
  },
  imageContainer: {
    flex: 1,
    marginBottom: actuatedNormalizeVertical(8),
  },

  // footer
  footer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 0.5,
    borderColor: 'lightgray',
    borderBottomWidth: 0.5,
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#000',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
});
