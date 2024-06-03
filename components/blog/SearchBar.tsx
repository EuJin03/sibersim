import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { User } from '@/constants/Types';
import { Searchbar } from 'react-native-paper';
import { actuatedNormalizeVertical } from '@/constants/DynamicSize';

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  return (
    <>
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 9,
          marginTop: actuatedNormalizeVertical(16),
        }}
        elevation={1}
      />
    </>
  );
}
