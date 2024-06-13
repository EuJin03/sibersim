import { View, Image, Alert, StyleSheet } from 'react-native';
import React from 'react';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import { IconButton, Text } from 'react-native-paper';
import { Colors } from '@/hooks/useThemeColor';
import { Template } from '@/constants/Types';
import handleEmail from '@/hooks/useDispatchEmail';
import useGroupStore from '@/hooks/useGroup';
import useUserStore from '@/hooks/useUsers';
import { generateUUID } from '@/hooks/useUuid';

export default function PhishingCard({
  template,
  groupId,
  toggleModal,
}: {
  template: Template;
  groupId: string;
  toggleModal: () => void;
}) {
  const { groupDetail, addResult } = useGroupStore();
  const { getUserById } = useUserStore();

  const handleDispatchEmail = async () => {
    const uniqueId = generateUUID(8);
    if (groupDetail) {
      const emailPromises = groupDetail.members.map(async userId => {
        const user = await getUserById(userId);
        if (user) {
          const params = {
            to_email: user.email,
            from_service: template.service,
            template: template.template,
            fullname: user.displayName,
            email: user.email,
            userId: userId,
            groupId: groupId,
            uniqueId: uniqueId,
          };
          await handleEmail({ params });
        }
      });

      await Promise.all(emailPromises);

      // Add the result to the group with the selected template and username
      await addResult(
        groupDetail.invitationLink,
        template.template,
        groupDetail.members,
        uniqueId
      );
      toggleModal();
      Alert.alert('Emails dispatched successfully');
    } else {
      Alert.alert('Group not found');
    }
  };

  return (
    <View style={styles.container}>
      <IconButton
        mode="contained"
        onPress={() =>
          Alert.alert(
            'Create Phishing Simulation',
            'Are you sure you want to create this phishing simulation?',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              { text: 'OK', onPress: handleDispatchEmail },
            ]
          )
        }
        style={styles.iconButton}
        icon="plus"
        iconColor="#ffffff"
        size={18}
        containerColor={Colors.light.secondary}
      />

      <Image
        source={{
          uri: 'https://firebasestorage.googleapis.com/v0/b/sibersim-2a3c3.appspot.com/o/google-sign-in-template.jpg?alt=media&token=51d7b17e-70a6-4cb9-9cfb-69868e224f6b',
        }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text numberOfLines={2} style={styles.title}>
          {template.title}
        </Text>
        <Text numberOfLines={5} style={styles.description}>
          {template.description}
        </Text>
        <View style={styles.tagContainer}>
          <Text style={styles.tag}>
            {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
          </Text>
          <Text style={styles.tag}>{template.tag}</Text>
        </View>
      </View>
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
  iconButton: {
    position: 'absolute',
    right: actuatedNormalize(2),
    bottom: actuatedNormalize(2),
    zIndex: 100,
  },
  image: {
    width: actuatedNormalize(120),
    height: actuatedNormalizeVertical(180),
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    resizeMode: 'cover',
  },
  content: {
    paddingVertical: actuatedNormalize(8),
    paddingHorizontal: actuatedNormalize(12),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  title: {
    color: Colors.light.secondary,
    fontWeight: '700',
    width: actuatedNormalize(190),
  },
  description: {
    width: actuatedNormalize(190),
    color: '#969696',
    fontSize: actuatedNormalize(11),
    marginTop: actuatedNormalizeVertical(5),
    textAlign: 'justify',
    lineHeight: actuatedNormalize(15),
    height: actuatedNormalizeVertical(84),
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
