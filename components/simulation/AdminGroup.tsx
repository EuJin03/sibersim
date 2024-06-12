import {
  View,
  Dimensions,
  ScrollView,
  Pressable,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  actuatedNormalizeVertical,
  actuatedNormalize,
} from '@/constants/DynamicSize';
import { Card, IconButton, Text, Button, Avatar } from 'react-native-paper';
import { Colors } from '@/hooks/useThemeColor';
import * as Clipboard from 'expo-clipboard';
import useGroupStore from '@/hooks/useGroup';
import useUsersStore from '@/hooks/useUsers';
import { User } from '@/constants/Types';
import { useAuth } from '@/contexts/userContext';

export default function AdminGroup({
  groupId,
  onLeaveGroup,
}: {
  groupId: string;
  onLeaveGroup: () => void;
}) {
  const colorScheme = useColorScheme();
  const [showLink, setShowLink] = useState<string>('Invitation');
  const { groupDetail, leaveGroup, loading } = useGroupStore();
  const { dbUser } = useAuth();
  const { getUserById } = useUsersStore();
  const [memberData, setMemberData] = useState<{ [key: string]: User }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMemberData = async () => {
      if (groupDetail?.members) {
        const memberDataPromises = groupDetail.members.map(async memberId => {
          // Check if memberId is a valid document ID
          if (typeof memberId === 'string' && !memberId.includes('/')) {
            const user = await getUserById(memberId);
            return { [memberId]: user };
          } else {
            console.warn('Invalid memberId:', memberId);
            return null;
          }
        });

        const memberDataArray = await Promise.all(memberDataPromises);
        const filteredMemberData = memberDataArray.filter(
          data => data !== null
        );
        const memberDataObject = Object.assign({}, ...filteredMemberData);
        setMemberData(memberDataObject);
        setIsLoading(false);
      }
    };

    fetchMemberData();
  }, [groupDetail, getUserById]);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(groupId);
  };

  const handleLeaveGroup = async () => {
    if (dbUser && groupDetail) {
      try {
        await leaveGroup(groupDetail.invitationLink, dbUser?.id || '');
        onLeaveGroup();
        // Perform any additional actions after leaving the group
      } catch (error) {
        console.error('Error leaving group:', error);
        // Handle the error appropriately (e.g., show an error message)
      }
    }
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
        {isLoading ? (
          <ActivityIndicator
            style={{ height: actuatedNormalizeVertical(300) }}
          />
        ) : (
          <>
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
                  {groupDetail?.name || 'Group Name'}
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
                {groupDetail?.description || 'Group Description'}
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
              {groupDetail?.members.map(memberId => (
                <Avatar.Image
                  key={memberId}
                  size={32}
                  source={{
                    uri: memberData[memberId]?.profilePicture || '',
                  }}
                />
              ))}
            </View>
            <IconButton
              icon="exit-to-app"
              size={22}
              onPress={handleLeaveGroup}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
              }}
              loading={loading}
              disabled={loading}
            />
          </>
        )}
      </Card>
    </View>
  );
}
