// UserProfile.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-paper';
import { Colors } from '@/hooks/useThemeColor';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import { User } from '@/constants/Types';

interface UserProfileProps {
  user: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Text style={styles.displayName}>{user?.displayName}</Text>
        <Text style={styles.bios} numberOfLines={4}>
          {user?.bios || 'Just a normal person that prioritize security.'}
        </Text>
        <View style={styles.jobPositionContainer}>
          {user?.jobPosition ? (
            <Text style={styles.jobPosition}>{user?.jobPosition}</Text>
          ) : (
            <Text style={styles.jobPosition}>SiberSim's Member</Text>
          )}
        </View>
      </View>
      <View style={styles.avatarContainer}>
        <Avatar.Image
          size={actuatedNormalize(60)}
          source={{
            uri:
              user?.profilePicture ??
              'https://firebasestorage.googleapis.com/v0/b/sibersim-2a3c3.appspot.com/o/scam-virus-spyware-malware-antivirus-concept.jpg?alt=media&token=0d3e9807-0d43-4b59-bf7f-74cd12650ea7',
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#c75030',
    padding: actuatedNormalize(20),
    minHeight: actuatedNormalize(120),
  },
  profileInfo: {
    flexBasis: '70%',
  },
  displayName: {
    color: '#ffffff',
    fontSize: actuatedNormalize(20),
    fontWeight: 'bold',
  },
  bios: {
    color: '#ffffff',
    fontSize: actuatedNormalize(12),
    marginTop: actuatedNormalizeVertical(8),
  },
  jobPositionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  jobPosition: {
    color: '#ffffff',
    fontSize: actuatedNormalize(11),
    marginTop: actuatedNormalizeVertical(8),
    paddingHorizontal: actuatedNormalize(8),
    paddingVertical: actuatedNormalize(3),
    borderRadius: 13,
    borderColor: '#f1f1f1',
    borderWidth: 1,
  },
  avatarContainer: {
    borderRadius: 60,
    borderColor: '#ffffff',
    borderWidth: 3,
  },
});

export default UserProfile;
