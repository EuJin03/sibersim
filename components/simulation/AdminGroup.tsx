import {
  View,
  Dimensions,
  ScrollView,
  Pressable,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import React, { useState } from 'react';
import {
  actuatedNormalizeVertical,
  actuatedNormalize,
} from '@/constants/DynamicSize';
import { Card, IconButton, Text, Button, Icon } from 'react-native-paper';
import { Colors } from '@/hooks/useThemeColor';
import Avatar from '../user/Avatar';
import * as Clipboard from 'expo-clipboard';

export default function AdminGroup({ groupId }: { groupId: string }) {
  const colorScheme = useColorScheme();
  const [showLink, setShowLink] = useState<string>('Invitation');

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(groupId);
  };

  return (
    <View
      style={{
        margin: actuatedNormalize(10),
      }}
    >
      <Card
        style={{
          width: Dimensions.get('screen').width - 20,
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Card.Cover
          source={{
            uri: 'https://firebasestorage.googleapis.com/v0/b/sibersim-2a3c3.appspot.com/o/Interactive%20course%20pics%2Fphishing.jpg?alt=media&token=ed4cc2de-8801-4a66-b854-98952949a976',
          }}
          style={{
            height: actuatedNormalizeVertical(160),
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
        />
        <View
          style={{
            paddingHorizontal: actuatedNormalize(16),
            paddingVertical: actuatedNormalize(10),
          }}
        >
          <View
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                fontSize: actuatedNormalize(18),
                fontWeight: 700,
                color: Colors.light.primary,
                marginBottom: actuatedNormalize(4),
              }}
            >
              SiberSejahtera
            </Text>
            <Button
              icon="link"
              mode="text"
              compact={true}
              onPress={() => {
                setShowLink('Copied!');
                copyToClipboard();
                setTimeout(() => {
                  setShowLink('Invitation');
                }, 4000);
              }}
              style={{ padding: 0 }}
            >
              {showLink}
            </Button>
          </View>
          <Text style={{ color: 'gray' }} numberOfLines={3}>
            A meetup group for cybersecurity enthusiasts in the Klang Valley
            area.
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            width: '100%',
            flexDirection: 'row',
            gap: actuatedNormalize(3),
            paddingHorizontal: actuatedNormalize(12),
            paddingBottom: actuatedNormalize(8),
          }}
        >
          {/* // replace this with a FlatList */}
          <Avatar />
          <Avatar />
          <Avatar />
        </View>
        <IconButton
          icon="exit-to-app"
          size={22}
          onPress={() => console.log('Pressed')}
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
          }}
        />
      </Card>
    </View>
  );
}
