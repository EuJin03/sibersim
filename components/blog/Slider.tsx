import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  TouchableHighlight,
} from 'react-native';
import React from 'react';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import { slider } from '@/assets/seeds/material';

export default function Slider() {
  return (
    <View style={{ marginTop: actuatedNormalizeVertical(14) }}>
      <FlatList
        data={slider}
        renderItem={({ item }) => (
          <View>
            <TouchableHighlight
              onPress={() => console.log('press on slider')}
              style={{ borderRadius: 10 }}
            >
              <Image
                source={{ uri: item.image }}
                style={{
                  width: Dimensions.get('window').width - 40,
                  height: actuatedNormalizeVertical(150),
                  borderWidth: 2,
                  borderColor: '#f1f1f1',
                  borderRadius: 10,
                }}
                resizeMode="cover"
              />
            </TouchableHighlight>
          </View>
        )}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
