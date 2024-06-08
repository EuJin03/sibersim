import { View, StyleSheet, Dimensions, Alert } from 'react-native';
import React, { useState } from 'react';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import { IconButton, Searchbar, Text, Tooltip } from 'react-native-paper';
import CreateGroup from './CreateGroup';
import * as Clipboard from 'expo-clipboard';

export default function JoinGroup() {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
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
            minHeight: 0, // Add this
          }}
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
