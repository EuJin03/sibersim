import { Colors } from '@/constants/Colors';
import React from 'react';
import { View } from 'react-native';
import {
  Avatar as PaperAvatar,
  Surface,
  TouchableRipple,
} from 'react-native-paper';

export default function Avatar() {
  return (
    <TouchableRipple
      onPress={() => console.log('Pressed')}
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
          source={require('@/assets/images/10221134.jpg')}
        />
      </View>
    </TouchableRipple>
  );
}
