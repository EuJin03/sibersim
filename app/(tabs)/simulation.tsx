import { View, Dimensions, ScrollView, RefreshControl } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/userContext';
import useGroupStore from '@/hooks/useGroup';

import JoinGroup from '@/components/simulation/JoinGroup';
import AdminGroup from '@/components/simulation/AdminGroup';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import SelectTemplate from '@/components/simulation/SelectTemplate';
import { IconButton, Text } from 'react-native-paper';
import { templates } from '@/assets/seeds/template';
import ResultCard from '@/components/simulation/ResultCard';
import { GroupResult, groupTemplate } from '@/utils/groupTemplate';

export default function simulation() {
  const { dbUser, fetchUpdatedDbUser } = useAuth();
  const { groupDetail, getGroupByInvitationLink } = useGroupStore();

  const [templateModalVisible, setTemplateModalVisible] =
    useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);

  const toggleSelectTemplateModal = () => {
    setTemplateModalVisible(!templateModalVisible);
  };

  useEffect(() => {
    const fetch = async () => {
      await fetchUpdatedDbUser();
      try {
        if (dbUser?.group) {
          await getGroupByInvitationLink(dbUser.group);
        }
      } catch (error) {
        console.error('Error fetching updated dbUser and group:', error);
      }
    };
    fetch();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUpdatedDbUser();
    try {
      if (dbUser?.group) {
        await getGroupByInvitationLink(dbUser.group);
      }
    } catch (error) {
      console.error('Error fetching updated dbUser and group:', error);
    }
    setRefreshing(false);
  }, [getGroupByInvitationLink, dbUser?.group]);

  const groupResult: GroupResult[] = groupDetail
    ? groupTemplate(groupDetail)
    : [];

  return (
    <View style={{ height: '100%' }}>
      {dbUser && groupDetail?.members?.[0] === dbUser.id && (
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
        {dbUser && dbUser.group === '' ? (
          <JoinGroup onJoinGroup={onRefresh} />
        ) : (
          <AdminGroup groupId={dbUser?.group ?? ''} onLeaveGroup={onRefresh} />
        )}
        <SelectTemplate
          isVisible={templateModalVisible}
          toggleModal={toggleSelectTemplateModal}
          groupId={dbUser?.group || ''}
        />

        {dbUser?.group && groupResult.length === 0 ? (
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
              {dbUser?.id === groupDetail?.members?.[0]
                ? 'No result found. Please create a phishing campaign to view the result.'
                : 'No result found. Please ask the admin to launch a new phishing campaign.'}
            </Text>
          </View>
        ) : (
          dbUser?.group && (
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
                    groupInfo={groupDetail!}
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
