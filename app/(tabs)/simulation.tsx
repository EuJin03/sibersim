import { View, Dimensions, ScrollView, RefreshControl } from 'react-native';
import React, { useId, useState, useCallback } from 'react';
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
  const { dbUser, fetchUpdatedDbUser } = useAuth();
  console.log(dbUser);

  const groupId = dbUser?.group || '';

  const [templateModalVisible, setTemplateModalVisible] =
    useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);

  const toggleSelectTemplateModal = () => {
    setTemplateModalVisible(!templateModalVisible);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchUpdatedDbUser();
    } catch (error) {
      console.error('Error fetching updated dbUser:', error);
    }
    setRefreshing(false);
  }, [fetchUpdatedDbUser]);

  const groupResult: GroupResult[] = dbUser?.group
    ? groupTemplate(groups[1])
    : [];
  const groupInfo: Group = dbUser?.group ? groups[1] : ({} as Group);
  const adminId = groupInfo.members?.[0] || '';

  return (
    <View style={{ height: '100%' }}>
      {dbUser && adminId === dbUser.id && (
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
      )}
      <ScrollView
        style={{ width: Dimensions.get('window').width }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {dbUser && groupId === '' ? (
          <JoinGroup />
        ) : (
          <AdminGroup groupId={groupId} />
        )}
        <SelectTemplate
          isVisible={templateModalVisible}
          toggleModal={toggleSelectTemplateModal}
          groupId={groupId}
        />

        {dbUser?.group !== '' && groupResult.length === 0 ? (
          <View
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
              {dbUser?.id === adminId
                ? 'No result found. Please create a phishing campaign to view the result.'
                : 'No result found. Please ask the admin to launch a new phishing campaign.'}
            </Text>
          </View>
        ) : (
          dbUser?.group !== '' && (
            <View style={{ paddingHorizontal: actuatedNormalize(10) }}>
              <Text
                style={{
                  fontSize: actuatedNormalize(18),
                  fontWeight: 700,
                  padding: actuatedNormalize(6),
                  marginTop: actuatedNormalizeVertical(6),
                }}
              >
                Phishing Campaign
              </Text>
              {groupResult.map(result => {
                const template = templates.find(
                  template => template.template === result.templateId
                );
                if (!template) {
                  return null;
                }
                return (
                  <ResultCard
                    key={result.templateId}
                    userInfo={result.userResults}
                    template={template}
                    groupInfo={groupInfo}
                  />
                );
              })}
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
}
