import { View, Dimensions, ScrollView } from 'react-native';
import React, { useId, useState } from 'react';
import { useAuth } from '@/contexts/userContext';

import JoinGroup from '@/components/simulation/JoinGroup';
import AdminGroup from '@/components/simulation/AdminGroup';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import SelectTemplate from '@/components/simulation/SelectTemplate';
import { Divider, IconButton, Text } from 'react-native-paper';
import { groups } from '@/assets/seeds/group';
import { templates } from '@/assets/seeds/template';
import ResultCard from '@/components/simulation/ResultCard';
import { GroupResult, groupTemplate } from '@/utils/groupTemplate';
import { Group } from '@/constants/Types';

export default function simulation() {
  const { dbUser } = useAuth();

  const groupId = dbUser?.group || '';

  const [templateModalVisible, setTemplateModalVisible] =
    useState<boolean>(false);

  const toggleSelectTemplateModal = () => {
    setTemplateModalVisible(!templateModalVisible);
  };

  const groupResult: GroupResult[] = groupTemplate(groups[1]);
  const groupInfo: Group = groups[1];

  return (
    <View
      style={{
        height: '100%',
      }}
    >
      <IconButton
        onPress={() => toggleSelectTemplateModal()}
        icon="book-plus-outline"
        size={30}
        containerColor="#f9f9f9"
        style={{
          position: 'absolute',
          bottom: actuatedNormalize(10),
          right: actuatedNormalize(10),
          zIndex: 100,
        }}
      />
      <ScrollView
        style={{
          width: Dimensions.get('window').width,
        }}
      >
        {dbUser && groupId === '' ? (
          <JoinGroup />
        ) : (
          <>
            <AdminGroup groupId={groupId} />
          </>
        )}
        <SelectTemplate
          isVisible={templateModalVisible}
          toggleModal={toggleSelectTemplateModal}
          groupId={groupId}
        />

        {/* <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: actuatedNormalizeVertical(300),
          }}
        >
          <Text
            numberOfLines={4}
            style={{
              color: '#909090',
              width: actuatedNormalize(200),
              textAlign: 'center',
              fontSize: actuatedNormalize(12),
            }}
          >
            No result found. Please create a phishing simulation to view the
            result.
          </Text>
        </View> */}

        {groupResult.map(result => {
          const template = templates.find(
            template => template.template === result.templateId
          );
          if (!template) {
            return null; // or handle the case when template is undefined
          }
          return (
            <View
              style={{
                paddingHorizontal: actuatedNormalize(10),
              }}
            >
              <ResultCard
                key={useId()}
                userInfo={result.userResults}
                template={template}
                groupInfo={groupInfo}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
