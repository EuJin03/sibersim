import { View, Alert, Modal, ScrollView } from 'react-native';
import React from 'react';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import { IconButton, Text, Button, Dialog } from 'react-native-paper';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import PhishingCard from './PhishingCard';
import { templates } from '@/assets/seeds/template';

export default function SelectTemplate({
  isVisible,
  toggleModal,
  groupId,
}: {
  isVisible: boolean;
  toggleModal: () => void;
  groupId: string;
}) {
  return (
    <Modal
      animationType="slide"
      visible={isVisible}
      presentationStyle="pageSheet"
      onRequestClose={() => {
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
            marginBottom: actuatedNormalizeVertical(10),
          }}
        >
          <Text
            style={{
              fontSize: actuatedNormalize(20),
              fontWeight: 700,
            }}
          >
            Choose a Template
          </Text>
          <IconButton
            icon="exit-to-app"
            size={20}
            onPress={() => toggleModal()}
            style={{ alignSelf: 'flex-end' }}
          />
        </View>
        {templates.map((template, index) => (
          <PhishingCard
            key={template.id}
            template={template}
            groupId={groupId}
            toggleModal={toggleModal}
          />
        ))}
        {/* <Button
          mode="outlined"
          style={{
            marginVertical: actuatedNormalizeVertical(14),
            borderRadius: 0,
            borderColor: Colors.light.primary,
          }}
          onPress={() => toggleModal()}
        >
          Add Template
        </Button> */}
      </ScrollView>
    </Modal>
  );
}
