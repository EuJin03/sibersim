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
import { Colors } from '@/hooks/useThemeColor';
import NetInfo from '@react-native-community/netinfo';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function simulation() {
  const { dbUser, fetchUpdatedDbUser } = useAuth();
  const { groupDetail, getGroupByInvitationLink, fetchResults } =
    useGroupStore();

  const [templateModalVisible, setTemplateModalVisible] =
    useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean>(true);

  const toggleSelectTemplateModal = () => {
    setTemplateModalVisible(!templateModalVisible);
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const newConnectionStatus = state.isConnected ?? true;
      if (newConnectionStatus !== isConnected) {
        setIsConnected(newConnectionStatus);
        if (!newConnectionStatus) {
          showMessage({
            message: 'No internet connection',
            description: "You're offline. Some features may be unavailable.",
            type: 'warning',
            duration: 3000,
          });
        } else {
          showMessage({
            message: 'Back online',
            description: 'Your internet connection has been restored.',
            type: 'success',
            duration: 3000,
          });
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isConnected]);

  useEffect(() => {
    const fetch = async () => {
      if (isConnected) {
        await fetchUpdatedDbUser();
        try {
          if (dbUser?.group) {
            await getGroupByInvitationLink(dbUser.group);
          }
        } catch (error) {
          console.error('Error fetching updated dbUser and group:', error);
        }
      }
    };
    fetch();
  }, [isConnected]);

  const onRefresh = useCallback(async () => {
    if (isConnected) {
      setRefreshing(true);
      await fetchUpdatedDbUser();
      try {
        if (dbUser?.group) {
          await getGroupByInvitationLink(dbUser.group);
          await fetchResults(dbUser.group);
        }
      } catch (error) {
        console.error('Error fetching updated dbUser and group:', error);
      }
      setRefreshing(false);
    } else {
      showMessage({
        message: "Can't refresh",
        description: "You're offline. Please check your internet connection.",
        type: 'warning',
        duration: 3000,
      });
    }
  }, [getGroupByInvitationLink, dbUser?.group, isConnected]);

  const groupResult: GroupResult[] = groupDetail
    ? groupTemplate(groupDetail)
    : [];

  const renderNoConnectionView = () => (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
      }}
    >
      <MaterialIcons
        name="signal-wifi-statusbar-connected-no-internet-4"
        size={30}
        color={Colors.light.secondary}
      />
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center',
          marginTop: 20,
        }}
      >
        No internet connection
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: 'gray',
          textAlign: 'center',
          marginTop: 10,
        }}
      >
        Please check your connection and try again
      </Text>
    </View>
  );

  return (
    <View style={{ height: '100%' }}>
      <FlashMessage position="top" />
      {!isConnected && (
        <View style={{ backgroundColor: 'red', padding: 10 }}>
          <Text style={{ color: 'white', textAlign: 'center' }}>
            No internet connection
          </Text>
        </View>
      )}
      {dbUser && groupDetail?.members?.[0] === dbUser.id && isConnected && (
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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={'#ffffff'}
            progressBackgroundColor={'#ffffff'}
            colors={[Colors.light.secondary]}
          />
        }
      >
        {!isConnected ? (
          renderNoConnectionView()
        ) : dbUser && dbUser.group === '' ? (
          <JoinGroup onJoinGroup={onRefresh} />
        ) : (
          <AdminGroup groupId={dbUser?.group ?? ''} onLeaveGroup={onRefresh} />
        )}
        <SelectTemplate
          isVisible={templateModalVisible}
          toggleModal={toggleSelectTemplateModal}
          groupId={dbUser?.group || ''}
        />

        {isConnected && dbUser?.group && groupResult.length === 0 ? (
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
        ) : isConnected && dbUser?.group ? (
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
                  key={Math.random()}
                  userInfo={result.userResults}
                  template={template}
                  groupInfo={groupDetail!}
                />
              );
            })}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
