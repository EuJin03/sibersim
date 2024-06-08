import { View, Image, Alert } from 'react-native';
import React from 'react';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import { Dialog, IconButton, Text } from 'react-native-paper';
import { Colors } from '@/hooks/useThemeColor';
import { Template } from '@/constants/Types';

export default function PhishingCard({ template }: { template: Template }) {
  return (
    <View
      style={{
        height: actuatedNormalizeVertical(180),
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#f9f9f9',
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        alignItems: 'flex-start',
        marginVertical: actuatedNormalizeVertical(10),
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
      }}
    >
      <IconButton
        mode="contained"
        onPress={() =>
          Alert.alert(
            'Create Phishing Simulation',
            'Are you sure you want to create this phishing simulation?',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]
          )
        }
        style={{
          position: 'absolute',
          right: actuatedNormalize(2),
          bottom: actuatedNormalize(2),
          zIndex: 100,
        }}
        icon="plus"
        iconColor="#ffffff"
        size={18}
        containerColor={Colors.light.secondary}
      />

      <Image
        source={{
          uri: 'https://firebasestorage.googleapis.com/v0/b/sibersim-2a3c3.appspot.com/o/google-sign-in-template.jpg?alt=media&token=51d7b17e-70a6-4cb9-9cfb-69868e224f6b',
        }}
        style={{
          width: actuatedNormalize(120),
          height: actuatedNormalizeVertical(180),
          borderTopLeftRadius: 18,
          borderBottomLeftRadius: 18,
          resizeMode: 'cover',
        }}
      />
      <View
        style={{
          paddingVertical: actuatedNormalize(8),
          paddingHorizontal: actuatedNormalize(12),
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <Text
          numberOfLines={2}
          style={{
            color: Colors.light.secondary,
            fontWeight: 700,
            width: actuatedNormalize(190),
          }}
        >
          {template.title}
        </Text>
        <Text
          numberOfLines={5}
          style={{
            width: actuatedNormalize(190),
            color: '#969696',
            fontSize: actuatedNormalize(11),
            marginTop: actuatedNormalizeVertical(5),
            textAlign: 'justify',
            lineHeight: actuatedNormalize(15),
            height: actuatedNormalizeVertical(84),
          }}
        >
          {template.description}
        </Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: actuatedNormalize(10),
            marginTop: actuatedNormalizeVertical(10),
          }}
        >
          <Text
            style={{
              fontSize: actuatedNormalize(11),
              borderRadius: 18,
              borderWidth: 1,
              color: Colors.light.primary,
              borderColor: Colors.light.primary,

              paddingVertical: actuatedNormalize(3),
              paddingHorizontal: actuatedNormalize(8),
            }}
          >
            {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
          </Text>
          <Text
            style={{
              fontSize: actuatedNormalize(11),
              borderRadius: 18,
              borderWidth: 1,
              paddingVertical: actuatedNormalize(3),
              paddingHorizontal: actuatedNormalize(8),
              color: Colors.light.primary,
              borderColor: Colors.light.primary,
            }}
          >
            {template.tag}
          </Text>
        </View>
      </View>
    </View>
  );
}
