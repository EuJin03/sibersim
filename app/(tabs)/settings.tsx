import {
  View,
  Text,
  Dimensions,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React from 'react';
import {
  Avatar,
  Button,
  Divider,
  Icon,
  IconButton,
  List,
  TouchableRipple,
} from 'react-native-paper';
import { useAuth } from '@/contexts/userContext';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import { Colors } from '@/hooks/useThemeColor';
import { useNavigation, useRouter } from 'expo-router';

export default function settings() {
  const { dbUser, signOut } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();

  const [expanded, setExpanded] = React.useState(true);

  const handlePress = () => setExpanded(!expanded);

  return (
    <View
      style={{
        height: '100%',
        width: Dimensions.get('screen').width,
        backgroundColor: '#f1f1f1',
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#c75030',
          paddingHorizontal: actuatedNormalize(20),
          padding: actuatedNormalize(20),
          minHeight: actuatedNormalize(120),
        }}
      >
        <View style={{ flexBasis: '70%' }}>
          <Text
            style={{
              color: '#ffffff',
              fontSize: actuatedNormalize(20),
              fontWeight: 'bold',
            }}
          >
            {dbUser?.displayName}
          </Text>

          <Text
            style={{
              color: '#ffffff',
              fontSize: actuatedNormalize(12),
              marginTop: actuatedNormalizeVertical(8),
            }}
            numberOfLines={4}
          >
            {dbUser?.bios || 'Just a normal person that prioritize security.'}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            {dbUser?.jobPosition && (
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: actuatedNormalize(11),
                  marginTop: actuatedNormalizeVertical(8),
                  paddingHorizontal: actuatedNormalize(8),
                  paddingVertical: actuatedNormalize(3),
                  borderRadius: 13,
                  borderColor: '#f1f1f1',
                  borderWidth: 1,
                }}
              >
                {dbUser?.jobPosition}
              </Text>
            )}
          </View>
        </View>
        <View
          style={{
            borderRadius: 60,
            borderColor: '#ffffff',
            borderWidth: 3,
          }}
        >
          <Avatar.Image
            size={actuatedNormalize(60)}
            source={{
              uri:
                dbUser?.profilePicture ||
                'https://firebasestorage.googleapis.com/v0/b/sibersim-2a3c3.appspot.com/o/10221134.jpg?alt=media&token=898ef675-72de-4b27-bb7c-342efb786b04',
            }}
          />
          <IconButton
            icon="pencil"
            iconColor={Colors.light.secondary}
            size={12}
            onPress={() => console.log('Pressed')}
            style={{
              position: 'absolute',
              bottom: actuatedNormalize(-8),
              right: actuatedNormalize(-8),
              backgroundColor: '#ffffff',
              width: actuatedNormalize(20),
              height: actuatedNormalize(20),
            }}
          />
        </View>
      </View>

      <View style={{ padding: actuatedNormalize(20) }}>
        <Text
          style={{
            color: '#000000',
            fontSize: actuatedNormalize(16),
            fontWeight: 600,
          }}
        >
          Additional Features
        </Text>
        <View>
          <TouchableRipple onPress={() => console.log('jeee')}>
            <View style={style.accordion}>
              <Icon source="exclamation-thick" size={18} />
              <Text>Report Suspicious Activities</Text>
            </View>
          </TouchableRipple>
          <Divider theme={{ colors: { outlineVariant: '#000000' } }} />
          <TouchableRipple onPress={() => console.log('jeee')}>
            <View style={style.accordion}>
              <Icon source="email-alert-outline" size={18} />
              <Text>Scan your Phone Number</Text>
            </View>
          </TouchableRipple>
          <Divider theme={{ colors: { outlineVariant: '#000000' } }} />
          <TouchableRipple onPress={() => console.log('jeee')}>
            <View style={style.accordion}>
              <Icon source="phone-alert-outline" size={18} />
              <Text>Scan your Email Address</Text>
            </View>
          </TouchableRipple>
          <Divider theme={{ colors: { outlineVariant: '#000000' } }} />
          <TouchableRipple onPress={() => console.log('jeee')}>
            <View style={style.accordion}>
              <Icon source="alert-circle-outline" size={18} />
              <Text>Provide Feedback</Text>
            </View>
          </TouchableRipple>
          <Divider theme={{ colors: { outlineVariant: '#000000' } }} />
          <TouchableRipple
            onPress={() =>
              Alert.alert('Signing Out', 'Are you sure you want to sign out?', [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                { text: 'OK', onPress: () => signOut() },
              ])
            }
          >
            <View style={style.accordion}>
              <Icon source="logout" size={18} />
              <Text>Sign Out</Text>
            </View>
          </TouchableRipple>
          <Divider theme={{ colors: { outlineVariant: '#000000' } }} />
        </View>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  accordion: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: actuatedNormalize(10),
    paddingVertical: actuatedNormalizeVertical(20),

    paddingHorizontal: actuatedNormalize(2),
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
});
