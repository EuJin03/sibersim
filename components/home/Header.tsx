import { View, Text, Image } from 'react-native';
import React from 'react';
import { actuatedNormalize } from '@/constants/DynamicSize';

export default function Header() {
  return (
    //an image component
    <Image
      source={require('@/assets/images/sibersim_logo.png')}
      style={{
        width: actuatedNormalize(124),
        height: actuatedNormalize(36),
        marginLeft: actuatedNormalize(-12),
        marginTop: actuatedNormalize(4),
      }}
    />
  );
}
