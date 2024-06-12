import { View, StyleSheet, Dimensions } from 'react-native';
import React, { useState } from 'react';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import { IconButton, Searchbar, Text } from 'react-native-paper';
import CreateGroup from './CreateGroup';
import useGroupStore from '@/hooks/useGroup';
import { useAuth } from '@/contexts/userContext';

export default function JoinGroup({
  onJoinGroup,
}: {
  onJoinGroup: () => void;
}) {
  const { dbUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { joinGroup, loading } = useGroupStore();

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleJoinGroup = async () => {
    try {
      await joinGroup(searchQuery, dbUser?.id ?? '');
      setSearchQuery('');
      onJoinGroup();
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  return (
    <>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Enter Invitation Link"
          onChangeText={query => setSearchQuery(query)}
          value={searchQuery}
          mode="view"
          icon="account-multiple-plus-outline"
          style={{
            backgroundColor: 'white',
            height: actuatedNormalizeVertical(46),
            flex: 1,
            justifyContent: 'center',
          }}
          showDivider={true}
          inputStyle={{
            minHeight: 0,
          }}
          onSubmitEditing={handleJoinGroup}
          loading={loading}
        />
        <View>
          <IconButton
            icon="account-group"
            size={24}
            onPress={() => toggleModal()}
          />
          <CreateGroup isVisible={modalVisible} toggleModal={toggleModal} />
        </View>
      </View>

      <View
        style={{
          width: '100%',
          height: actuatedNormalizeVertical(560),
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'gray' }}>No Content Yet</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: actuatedNormalize(10),
    paddingVertical: actuatedNormalize(16),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: Dimensions.get('window').width,
  },
});
