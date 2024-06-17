import {
  View,
  Text,
  Modal,
  ScrollView,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import React, { useId } from 'react';
import { Group, Result, Template } from '@/constants/Types';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import { IconButton } from 'react-native-paper';
import { Colors } from '@/hooks/useThemeColor';
import CourseList from '../blog/CourseList';

export default function ResultModal({
  isVisible,
  toggleModal,
  userInfo,
  groupInfo,
  template,
}: {
  isVisible: boolean;
  toggleModal: () => void;
  userInfo: Result[];
  groupInfo: Group;
  template: Template;
}) {
  const numOfUsers = userInfo.length;
  const numOfFailedUsers = userInfo.filter(
    user => user.comment === 'User clicked the phishing link'
  ).length;

  return (
    <Modal
      visible={isVisible}
      onRequestClose={toggleModal}
      presentationStyle="pageSheet"
      animationType="slide"
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Campaign Result</Text>
          <IconButton
            icon="exit-to-app"
            size={20}
            onPress={toggleModal}
            style={styles.closeButton}
          />
        </View>

        <View style={styles.cardContainer}>
          <Image
            source={{
              uri: 'https://firebasestorage.googleapis.com/v0/b/sibersim-2a3c3.appspot.com/o/Interactive%20course%20pics%2Fphishing.jpg?alt=media&token=ed4cc2de-8801-4a66-b854-98952949a976',
            }}
            style={styles.image}
          />
          <View style={styles.statsContainer}>
            <Text style={styles.failedUsers}>{numOfFailedUsers}</Text>
            <Text style={styles.totalUsers}>{' / ' + numOfUsers}</Text>
            <Text style={styles.usersFailed}>{'   '}of Users Failed</Text>
          </View>

          <View style={styles.templateContainer}>
            <Text style={styles.templateTitle}>{template.title}</Text>

            <View style={styles.tagContainer}>
              <Text style={styles.tag}>{template.type}</Text>
              <Text style={styles.tag}>{template.tag}</Text>
            </View>
          </View>

          <View style={styles.groupContainer}>
            <Text style={styles.groupName}>{groupInfo.name}</Text>
            <Text style={styles.membersLabel}>Group Members</Text>
            {userInfo.map(member => (
              <View key={member.user} style={styles.memberContainer}>
                <Text style={styles.username}>{member.username}</Text>
                <Text
                  style={[
                    styles.comment,
                    member.comment === 'User clicked the phishing link'
                      ? styles.failedComment
                      : null,
                  ]}
                >
                  {member.comment}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <CourseList />
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: actuatedNormalize(20),
    backgroundColor: '#f1f1f1',
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: actuatedNormalizeVertical(20),
    marginBottom: actuatedNormalizeVertical(10),
  },
  headerText: {
    fontSize: actuatedNormalize(20),
    fontWeight: 700,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  cardContainer: {
    width: Dimensions.get('screen').width - 40,
    backgroundColor: '#ffffff',
  },
  image: {
    height: actuatedNormalizeVertical(120),
    width: '100%',
    resizeMode: 'cover',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  statsContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: actuatedNormalizeVertical(20),
    paddingHorizontal: actuatedNormalize(10),
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  failedUsers: {
    fontSize: actuatedNormalize(18),
    fontWeight: 700,
    color: 'red',
  },
  totalUsers: {
    fontSize: actuatedNormalize(18),
    fontWeight: 700,
  },
  usersFailed: {
    fontSize: actuatedNormalize(12),
    alignSelf: 'flex-start',
  },
  templateContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
    paddingVertical: actuatedNormalize(10),
    paddingHorizontal: actuatedNormalize(20),
  },
  templateTitle: {},
  tagContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: actuatedNormalize(10),
  },
  tag: {
    marginTop: actuatedNormalizeVertical(8),
    paddingVertical: actuatedNormalize(4),
    paddingHorizontal: actuatedNormalize(10),
    fontSize: actuatedNormalize(10),
    borderWidth: 1,
    borderColor: Colors.light.secondary,
    color: Colors.light.secondary,
    borderRadius: 18,
  },
  groupContainer: {
    paddingVertical: actuatedNormalize(10),
    paddingHorizontal: actuatedNormalize(20),
  },
  groupName: {
    color: Colors.light.secondary,
    fontSize: actuatedNormalize(18),
    fontWeight: 700,
  },
  membersLabel: {
    marginVertical: actuatedNormalizeVertical(8),
    fontWeight: 700,
  },
  memberContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  username: {
    flexBasis: '40%',
    flexWrap: 'wrap',
  },
  comment: {
    flexBasis: '60%',
    flexWrap: 'wrap',
    marginBottom: actuatedNormalizeVertical(8),
    color: '#000000',
  },
  failedComment: {
    color: 'red',
  },
});
