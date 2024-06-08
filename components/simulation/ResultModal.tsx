import { View, Text, Modal, ScrollView } from 'react-native';
import React from 'react';
import { Group, Result, Template } from '@/constants/Types';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import { IconButton } from 'react-native-paper';

export default function ResultModal({
  isVisible,
  toggleModal,
  userInfo,
  groupInfo,
  template,
}: {
  isVisible: boolean;
  toggleModal: () => void;
  userInfo: Result[];
  groupInfo: Group;
  template: Template;
}) {
  return (
    <Modal
      visible={isVisible}
      onRequestClose={() => {
        toggleModal();
      }}
      presentationStyle="pageSheet"
      animationType="slide"
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
            marginBottom: actuatedNormalizeVertical(10),
          }}
        >
          <Text
            style={{
              fontSize: actuatedNormalize(20),
              fontWeight: 700,
            }}
          >
            Simulation Result
          </Text>
          <IconButton
            icon="exit-to-app"
            size={20}
            onPress={() => toggleModal()}
            style={{ alignSelf: 'flex-end' }}
          />
        </View>
      </ScrollView>
    </Modal>
  );
}
