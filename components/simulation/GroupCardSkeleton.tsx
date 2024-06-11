import { View, Dimensions } from 'react-native';
import React, { useState } from 'react';
import {
  actuatedNormalizeVertical,
  actuatedNormalize,
} from '@/constants/DynamicSize';
import { Card, IconButton, Button, Text, Icon } from 'react-native-paper';
import { Colors } from '@/hooks/useThemeColor';
import { useAuth } from '@/contexts/userContext';
import { generateUUID } from '@/hooks/useUuid';
import Avatar from '../user/Avatar';
import { User } from '@/constants/Types';

interface GroupCardSkeletonProps {
  invitationLink: string;
  name: string;
  description: string;
  avatar?: string;
}

export default function GroupCardSkeleton({
  groupInfo,
  handleGroupInfoChange,
}: {
  groupInfo: GroupCardSkeletonProps;
  handleGroupInfoChange: (newGroupInfo: GroupCardSkeletonProps) => void;
}) {
  const { dbUser } = useAuth();

  return (
    <Card
      style={{
        width: Dimensions.get('screen').width - 40,
        minHeight: actuatedNormalizeVertical(200),
        backgroundColor: '#ffffff',
        marginVertical: actuatedNormalize(10),
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
            {groupInfo.name}
          </Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: actuatedNormalize(4),
              alignItems: 'center',
            }}
          >
            <Icon source="link" color={Colors.light.primary} size={18} />
            <Text style={{ color: Colors.light.primary }}>
              {groupInfo.invitationLink}
            </Text>
          </View>
        </View>
        <Text style={{ color: 'gray' }} numberOfLines={4}>
          {groupInfo.description}
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
  );
}
