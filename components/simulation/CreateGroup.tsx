import React, { useState } from 'react';
import { View, Alert, Modal, ScrollView, Text } from 'react-native';
import { generateUUID } from '@/hooks/useUuid';
import GroupCardSkeleton from './GroupCardSkeleton';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import { Button, IconButton, TextInput, Snackbar } from 'react-native-paper';
import { Colors } from '@/hooks/useThemeColor';
import useGroupStore from '@/hooks/useGroup';
import { useAuth } from '@/contexts/userContext';

interface GroupCardSkeletonProps {
  invitationLink: string;
  name: string;
  description: string;
  avatar?: string;
}

interface CreateGroupProps {
  isVisible: boolean;
  toggleModal: () => void;
}

export default function CreateGroup({
  isVisible,
  toggleModal,
}: CreateGroupProps) {
  const [groupInfo, setGroupInfo] = useState<GroupCardSkeletonProps>({
    invitationLink: generateUUID(8),
    name: 'Group Name',
    description: 'Group Description',
    avatar:
      'https://firebasestorage.googleapis.com/v0/b/sibersim-2a3c3.appspot.com/o/Interactive%20course%20pics%2Fphishing.jpg?alt=media&token=ed4cc2de-8801-4a66-b854-98952949a976',
  });

  const { createGroup, loading } = useGroupStore();
  const { dbUser } = useAuth();

  const handleGroupInfoChange = (newGroupInfo: GroupCardSkeletonProps) => {
    setGroupInfo(newGroupInfo);
  };

  const handleCreateGroup = async () => {
    if (dbUser) {
      await createGroup(
        {
          name: groupInfo.name,
          description: groupInfo.description,
          members: [],
          invitationLink: groupInfo.invitationLink,
          results: [],
        },
        dbUser?.id ?? ''
      );
      toggleModal();
    }
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
          onPress={handleCreateGroup}
          loading={loading}
        >
          Create Group
        </Button>
      </ScrollView>
    </Modal>
  );
}
