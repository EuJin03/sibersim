import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Pressable,
  ImageBackground,
  Dimensions,
  Modal,
} from 'react-native';
import React, { useId, useState } from 'react';
import { Template, Group, Result } from '@/constants/Types';
import {
  actuatedNormalizeVertical,
  actuatedNormalize,
} from '@/constants/DynamicSize';
import { IconButton, TouchableRipple } from 'react-native-paper';
import { Colors } from '@/hooks/useThemeColor';
import useRelativeTime from '@/hooks/useTimeFormat';
import ResultModal from './ResultModal';

export default function ResultCard({
  template,
  userInfo,
  groupInfo,
}: {
  template: Template;
  userInfo: Result[];
  groupInfo: Group;
}) {
  const [imageModal, setImageModal] = useState<boolean>(false);

  const [resultModal, setResultModal] = useState<boolean>(false);

  const toggleSelectResultModal = () => {
    setResultModal(!resultModal);
  };

  const toggleImageModal = () => {
    setImageModal(!imageModal);
  };

  return (
    <View
      style={{
        height: actuatedNormalizeVertical(180),
        width: '100%',
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 18,
        borderBottomLeftRadius: 18,
        borderWidth: 1,
        borderColor: '#f9f9f9',
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        alignItems: 'flex-start',
        marginVertical: actuatedNormalizeVertical(10),
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
      }}
    >
      <ResultModal
        isVisible={resultModal}
        toggleModal={toggleSelectResultModal}
        userInfo={userInfo}
        groupInfo={groupInfo}
        template={template}
      />
      <Pressable onPress={toggleImageModal}>
        <Image
          source={{
            uri: 'https://firebasestorage.googleapis.com/v0/b/sibersim-2a3c3.appspot.com/o/google-sign-in-template.jpg?alt=media&token=51d7b17e-70a6-4cb9-9cfb-69868e224f6b',
          }}
          style={{
            width: actuatedNormalize(120),
            height: actuatedNormalizeVertical(180),
            borderTopLeftRadius: 18,
            borderBottomLeftRadius: 18,
            resizeMode: 'cover',
          }}
        />
      </Pressable>
      <Modal
        visible={imageModal}
        onRequestClose={toggleImageModal}
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}
        animationType="fade"
      >
        <TouchableOpacity onPress={toggleImageModal}>
          <Image
            source={{
              uri: 'https://firebasestorage.googleapis.com/v0/b/sibersim-2a3c3.appspot.com/o/google-sign-in-template.jpg?alt=media&token=51d7b17e-70a6-4cb9-9cfb-69868e224f6b',
            }}
            style={{
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
              resizeMode: 'contain',
              backgroundColor: '#000000',
            }}
          />
        </TouchableOpacity>
      </Modal>
      <TouchableRipple
        style={{ width: actuatedNormalize(238) }}
        onPress={() => toggleSelectResultModal()}
      >
        <View
          style={{
            paddingVertical: actuatedNormalize(8),
            paddingHorizontal: actuatedNormalize(12),
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
          }}
        >
          <View>
            <Text
              numberOfLines={2}
              style={{
                color: Colors.light.secondary,
                fontWeight: 700,
                width: actuatedNormalize(190),
              }}
            >
              {template.title}
            </Text>
            <Text
              numberOfLines={5}
              style={{
                width: actuatedNormalize(190),
                fontSize: actuatedNormalize(9),
                textAlign: 'justify',
                lineHeight: actuatedNormalize(15),
              }}
            >
              Created {useRelativeTime('2024-06-07T09:15:00Z')}
            </Text>
          </View>

          <View>
            <Text style={{ fontSize: actuatedNormalize(11), fontWeight: 700 }}>
              Participants
            </Text>
            <View
              style={{
                height: actuatedNormalizeVertical(50),
              }}
            >
              {userInfo.map((user, index) => {
                if (index < 4) {
                  return (
                    <Text
                      key={useId()}
                      style={{
                        fontSize: actuatedNormalize(10),
                        color: '#909090',
                      }}
                    >
                      {user.username}
                    </Text>
                  );
                }
                return null;
              })}
            </View>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: actuatedNormalize(10),
              marginTop: actuatedNormalizeVertical(10),
            }}
          >
            <Text
              style={{
                fontSize: actuatedNormalize(11),
                borderRadius: 18,
                borderWidth: 1,
                color: Colors.light.primary,
                borderColor: Colors.light.primary,

                paddingVertical: actuatedNormalize(3),
                paddingHorizontal: actuatedNormalize(8),
              }}
            >
              {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
            </Text>
            <Text
              style={{
                fontSize: actuatedNormalize(11),
                borderRadius: 18,
                borderWidth: 1,
                paddingVertical: actuatedNormalize(3),
                paddingHorizontal: actuatedNormalize(8),
                color: Colors.light.primary,
                borderColor: Colors.light.primary,
              }}
            >
              {template.tag}
            </Text>
          </View>
        </View>
      </TouchableRipple>
    </View>
  );
}
