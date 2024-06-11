import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/userContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import {
  Avatar as PaperAvatar,
  Surface,
  TouchableRipple,
} from 'react-native-paper';

export default function Avatar() {
  const router = useRouter();
  const { dbUser } = useAuth();
  return (
    <TouchableRipple
      onPress={() => router.navigate('/settings')}
      rippleColor="#fff"
      borderless={true}
      style={{
        borderRadius: 20,
      }}
    >
      <View
        style={{
          borderRadius: 20,
          borderWidth: 2.5,
          borderColor: Colors.light.secondary, // Use the borderColor based on the color scheme
        }}
      >
        <PaperAvatar.Image
          size={32}
          source={{
            uri:
              dbUser?.profilePicture ||
              'https://firebasestorage.googleapis.com/v0/b/sibersim-2a3c3.appspot.com/o/scam%20icon.png?alt=media&token=126c681e-09b2-40ce-8407-3d735fc13041',
          }}
        />
      </View>
    </TouchableRipple>
  );
}
