import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { useAuth } from '@/contexts/userContext';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import { IconButton, Searchbar } from 'react-native-paper';

export default function simulation() {
  const { dbUser } = useAuth();

  const { group } = dbUser;
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <View
      style={{
        width: Dimensions.get('window').width,
      }}
    >
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Enter Invitation Link"
          onChangeText={query => setSearchQuery(query)}
          value={searchQuery}
          mode="view"
          icon="account-multiple-plus-outline"
          style={{
            backgroundColor: 'white',
            height: actuatedNormalizeVertical(50),
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
            onPress={() => console.log('Pressed')}
          />
        </View>
      </View>

      <View
        style={{
          width: '100%',
          height: actuatedNormalizeVertical(600),
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text>No Content Yet</Text>
      </View>
    </View>
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
