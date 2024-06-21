import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  TouchableHighlight,
} from 'react-native';
import React, { useState } from 'react';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import { Material } from '@/constants/Types';
import { useRouter } from 'expo-router';

export default function Slider({ materials }: { materials: Material[] }) {
  const router = useRouter();
  const [lessons, setLessons] = useState<Material[]>(
    materials.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
  );

  return (
    <View style={{ marginTop: actuatedNormalizeVertical(14) }}>
      <FlatList
        data={lessons.slice(0, 5)}
        renderItem={({ item }) => (
          <View>
            <TouchableHighlight
              onPress={() =>
                item.type === 'course'
                  ? router.push(`/course/${item.id}`)
                  : router.navigate(`/video-course/${item.id}`)
              }
              style={{ borderRadius: 10 }}
            >
              <Image
                source={{
                  uri:
                    item?.thumbnail ||
                    'https://firebasestorage.googleapis.com/v0/b/sibersim-2a3c3.appspot.com/o/scam-virus-spyware-malware-antivirus-concept.jpg?alt=media&token=0d3e9807-0d43-4b59-bf7f-74cd12650ea7',
                }}
                style={{
                  width: Dimensions.get('window').width - actuatedNormalize(39),
                  height: actuatedNormalizeVertical(160),
                  borderColor: '#f1f1f1',
                  borderWidth: 2,
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
