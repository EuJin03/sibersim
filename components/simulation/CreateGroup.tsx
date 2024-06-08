import { View, Alert, Modal, Pressable, Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { generateUUID } from '@/hooks/useUuid';
import GroupCardSkeleton from './GroupCardSkeleton';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import { Button, IconButton, TextInput } from 'react-native-paper';
import { Colors } from '@/hooks/useThemeColor';

interface GroupCardSkeletonProps {
  invitationLink: string;
  name: string;
  description: string;
  avatar?: string;
}

export default function CreateGroup({
  isVisible,
  toggleModal,
}: {
  isVisible: boolean;
  toggleModal: () => void;
}) {
  const [groupInfo, setGroupInfo] = useState<GroupCardSkeletonProps>({
    invitationLink: generateUUID(8),
    name: 'Group Name',
    description: 'Group Description',
    avatar:
      'https://firebasestorage.googleapis.com/v0/b/sibersim-2a3c3.appspot.com/o/phishing.jpg?alt=media&token=138cd671-3a91-43ad-b2d8-2dc1a5b56735',
  });

  const handleGroupInfoChange = (newGroupInfo: GroupCardSkeletonProps) => {
    setGroupInfo(newGroupInfo);
  };

  return (
    <Modal
      animationType="slide"
      visible={isVisible}
      presentationStyle="pageSheet"
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        toggleModal();
      }}
    >
      <ScrollView
        style={{
          paddingHorizontal: actuatedNormalize(20),
          backgroundColor: '#f1f1f1',
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: actuatedNormalizeVertical(20),
          }}
        >
          <Text
            style={{
              fontSize: actuatedNormalize(20),
              fontWeight: 700,
            }}
          >
            Create Cyber Group
          </Text>
          <IconButton
            icon="exit-to-app"
            size={20}
            onPress={() => toggleModal()}
            style={{ alignSelf: 'flex-end' }}
          />
        </View>
        <GroupCardSkeleton
          groupInfo={groupInfo}
          handleGroupInfoChange={handleGroupInfoChange}
        />

        <TextInput
          label="Group Name"
          mode="outlined"
          value={groupInfo.name}
          onChangeText={text =>
            handleGroupInfoChange({ ...groupInfo, name: text })
          }
          style={{
            marginVertical: actuatedNormalizeVertical(14),
          }}
        />
        <TextInput
          label="Group Description"
          mode="outlined"
          value={groupInfo.description}
          onChangeText={text =>
            handleGroupInfoChange({ ...groupInfo, description: text })
          }
          style={{
            marginVertical: actuatedNormalizeVertical(14),
          }}
        />
        <Button
          mode="outlined"
          style={{
            marginVertical: actuatedNormalizeVertical(14),
            borderRadius: 0,
            borderColor: Colors.light.primary,
          }}
          onPress={() => toggleModal()}
        >
          Create Group
        </Button>
      </ScrollView>
    </Modal>
  );
}
