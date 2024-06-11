import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  Modal,
  Dimensions,
  StyleSheet,
} from 'react-native';
import React, { useEffect, useId, useState } from 'react';
import { Template, Group, Result } from '@/constants/Types';
import {
  actuatedNormalizeVertical,
  actuatedNormalize,
} from '@/constants/DynamicSize';
import { TouchableRipple } from 'react-native-paper';
import { Colors } from '@/hooks/useThemeColor';
import useRelativeTime from '@/hooks/useTimeFormat';
import ResultModal from './ResultModal';
import { usePathname } from 'expo-router';

export default function ResultCard({
  template,
  userInfo,
  groupInfo,
}: {
  template: Template;
  userInfo: Result[];
  groupInfo: Group;
}) {
  const pathname = usePathname();
  const [imageModal, setImageModal] = useState<boolean>(false);
  const [resultModal, setResultModal] = useState<boolean>(false);

  const toggleSelectResultModal = () => {
    setResultModal(!resultModal);
  };

  const toggleImageModal = () => {
    setImageModal(!imageModal);
  };

  useEffect(() => {
    if (pathname === '/simulation') {
      setResultModal(false);
    }
  }, [pathname]);

  return (
    <View style={styles.container}>
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
            uri:
              template.image ||
              'https://firebasestorage.googleapis.com/v0/b/sibersim-2a3c3.appspot.com/o/google-sign-in-template.jpg?alt=media&token=51d7b17e-70a6-4cb9-9cfb-69868e224f6b',
          }}
          style={styles.image}
        />
      </Pressable>
      <Modal
        visible={imageModal}
        onRequestClose={toggleImageModal}
        style={styles.modal}
        animationType="fade"
      >
        <TouchableOpacity onPress={toggleImageModal}>
          <Image
            source={{
              uri:
                template.image ||
                'https://firebasestorage.googleapis.com/v0/b/sibersim-2a3c3.appspot.com/o/google-sign-in-template.jpg?alt=media&token=51d7b17e-70a6-4cb9-9cfb-69868e224f6b',
            }}
            style={styles.modalImage}
          />
        </TouchableOpacity>
      </Modal>
      <TouchableRipple
        style={styles.touchableRipple}
        onPress={() => toggleSelectResultModal()}
      >
        <View style={styles.contentContainer}>
          <View>
            <Text numberOfLines={2} style={styles.title}>
              {template.title}
            </Text>
            <Text numberOfLines={5} style={styles.description}>
              Created {useRelativeTime('2024-06-07T09:15:00Z')}
            </Text>
          </View>

          <View>
            <Text style={styles.participantsLabel}>Participants</Text>
            <View style={styles.participantsContainer}>
              {userInfo.map((user, index) => {
                if (index < 4) {
                  return (
                    <Text key={useId()} style={styles.participantName}>
                      {user.username}
                    </Text>
                  );
                }
                return null;
              })}
            </View>
          </View>
          <View style={styles.tagContainer}>
            <Text style={styles.tag}>
              {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
            </Text>
            <Text style={styles.tag}>{template.tag}</Text>
          </View>
        </View>
      </TouchableRipple>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: actuatedNormalizeVertical(180),
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
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
  },
  image: {
    width: actuatedNormalize(120),
    height: actuatedNormalizeVertical(180),
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    resizeMode: 'cover',
  },
  modal: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  modalImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    resizeMode: 'contain',
    backgroundColor: '#000000',
  },
  touchableRipple: {
    width: actuatedNormalize(238),
  },
  contentContainer: {
    paddingVertical: actuatedNormalize(8),
    paddingHorizontal: actuatedNormalize(12),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  title: {
    color: Colors.light.secondary,
    fontWeight: 700,
    width: actuatedNormalize(190),
  },
  description: {
    width: actuatedNormalize(190),
    fontSize: actuatedNormalize(9),
    textAlign: 'justify',
    lineHeight: actuatedNormalize(15),
  },
  participantsLabel: {
    fontSize: actuatedNormalize(11),
    fontWeight: 700,
  },
  participantsContainer: {
    height: actuatedNormalizeVertical(50),
  },
  participantName: {
    fontSize: actuatedNormalize(10),
    color: '#909090',
  },
  tagContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: actuatedNormalize(10),
    marginTop: actuatedNormalizeVertical(10),
  },
  tag: {
    fontSize: actuatedNormalize(11),
    borderRadius: 18,
    borderWidth: 1,
    color: Colors.light.primary,
    borderColor: Colors.light.primary,
    paddingVertical: actuatedNormalize(3),
    paddingHorizontal: actuatedNormalize(8),
  },
});
