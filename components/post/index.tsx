import { View, StyleSheet, Image, Pressable } from 'react-native';
import { Post } from '@/constants/Types';
import { FontAwesome } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import { ScaledImage } from '../basic/ScaledImage';
import { Text } from 'react-native-paper';

type PostListItemProps = {
  post: Post;
};

type FooterButtonProp = {
  text: string;
  icon: React.ComponentProps<typeof FontAwesome>['name'];
};

function FooterButton({ text, icon }: FooterButtonProp) {
  return (
    <View style={{ flexDirection: 'row' }}>
      <FontAwesome name={icon} size={16} color="gray" />
      <Text style={{ marginLeft: 5, color: 'gray', fontWeight: '500' }}>
        {text}
      </Text>
    </View>
  );
}

export default function PostListItem() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Link href={`/posts/1`} asChild>
        <Pressable>
          {/* Header */}

          <View style={styles.header}>
            <Pressable onPressOut={() => router.push('/users/1')}>
              <Image
                source={require('@/assets/images/10221134.jpg')}
                style={styles.userImage}
              />
            </Pressable>
            <View>
              <Pressable onPressOut={() => router.push('/users/1')}>
                <Text style={styles.userName} variant="bodyMedium">
                  Eugene
                </Text>
              </Pressable>
              <Text
                style={{ fontSize: actuatedNormalize(10), color: '#121212' }}
              >
                Student at APU
              </Text>
              <Text
                style={{
                  marginVertical: actuatedNormalizeVertical(-1),
                  color: '#888888',
                  fontSize: actuatedNormalize(10),
                }}
              >
                1d ago
              </Text>
            </View>
          </View>
        </Pressable>
      </Link>
      {/* Text content */}
      <Text style={styles.content}>blablablablablablabla</Text>

      {/* Image content */}

      <View>
        <ScaledImage
          uri={
            'https://firebasestorage.googleapis.com/v0/b/sibersim-2a3c3.appspot.com/o/10221134.jpg?alt=media&token=898ef675-72de-4b27-bb7c-342efb786b04'
          }
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <FooterButton text="Like" icon="thumbs-o-up" />
        <FooterButton text="Comment" icon="comment-o" />
        <FooterButton text="Share" icon="share" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
    maxWidth: actuatedNormalize(500),
    alignSelf: 'center',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: actuatedNormalize(10),
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: actuatedNormalizeVertical(-2),
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

  // footer
  footer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'space-around',
    borderTopWidth: 0.5,
    borderColor: 'lightgray',
    borderBottomWidth: 0.5,
  },
});
