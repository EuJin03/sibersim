import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/userContext';
import MUI from '@expo/vector-icons/MaterialCommunityIcons';
import { Avatar, Button, IconButton, TextInput } from 'react-native-paper';
import { Colors } from '@/hooks/useThemeColor';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import { useForm, Controller } from 'react-hook-form';
import useUsersStore from '@/hooks/useUsers';

interface EditProfile {
  displayName: string;
  bios: string;
  jobPosition: string;
  profilePicture: string;
  email: string;
  phoneNum: string;
}

export default function setup() {
  const { dbUser } = useAuth();
  const router = useRouter();
  const { updateUser } = useUsersStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfile>({
    defaultValues: {
      displayName: dbUser?.displayName || 'John Doe',
      bios: dbUser?.bios || 'Just a normal person that prioritize security.',
      jobPosition:
        dbUser?.jobPosition === ''
          ? 'SiberSim Member'
          : dbUser?.jobPosition ?? 'SiberSim Member',
      profilePicture:
        dbUser?.profilePicture ||
        'https://firebasestorage.googleapis.com/v0/b/sibersim-2a3c3.appspot.com/o/10221134.jpg?alt=media&token=898ef675-72de-4b27-bb7c-342efb786b04',
      email: dbUser?.email || '',
      phoneNum: dbUser?.phoneNum == '' ? '+60' : dbUser?.phoneNum || '+60',
    },
  });

  const skipToHome = () => {
    router.navigate('/(tabs)');
  };

  const onSubmit = async (data: EditProfile) => {
    try {
      if (dbUser?.id) {
        await updateUser(dbUser.id, { ...data, isNewUser: false });
        console.log('User details updated successfully');
        if (router.canGoBack()) {
          router.dismissAll();
        }
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'SiberSim',
          headerRight: () => (
            <Button
              onPress={skipToHome}
              labelStyle={{
                color: Colors.light.secondary,
                fontSize: actuatedNormalize(14),
              }}
              style={{ marginRight: actuatedNormalize(-10) }}
            >
              Skip
            </Button>
          ),
        }}
      />
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <View style={styles.profileInfo}>
            <Controller
              control={control}
              render={({ field: { value } }) => (
                <Text style={styles.displayName}>{value}</Text>
              )}
              name="displayName"
            />

            <Controller
              control={control}
              render={({ field: { value } }) => (
                <Text style={styles.bios} numberOfLines={4}>
                  {value || 'Just a normal person that prioritize security.'}
                </Text>
              )}
              name="bios"
            />
            <View style={styles.jobPositionContainer}>
              <Controller
                control={control}
                render={({ field: { value } }) => (
                  <Text style={styles.jobPosition}>{value}</Text>
                )}
                name="jobPosition"
              />
            </View>
          </View>
          <View style={styles.avatarContainer}>
            <Avatar.Image
              size={actuatedNormalize(60)}
              source={{
                uri: 'https://firebasestorage.googleapis.com/v0/b/sibersim-2a3c3.appspot.com/o/10221134.jpg?alt=media&token=898ef675-72de-4b27-bb7c-342efb786b04',
              }}
            />
            <IconButton
              icon="pencil"
              iconColor={Colors.light.secondary}
              size={12}
              onPress={() => console.log('Pressed')}
              style={{
                position: 'absolute',
                bottom: actuatedNormalize(-8),
                right: actuatedNormalize(-8),
                backgroundColor: '#ffffff',
                width: actuatedNormalize(20),
                height: actuatedNormalize(20),
              }}
            />
          </View>
        </View>

        <ScrollView style={styles.inputContainer}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Display Name"
                onBlur={onBlur}
                onChangeText={value => onChange(value)}
                value={value}
                style={styles.input}
                mode="outlined"
                maxLength={40}
                numberOfLines={2}
                theme={{ colors: { primary: Colors.light.secondary } }}
              />
            )}
            name="displayName"
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Bio"
                onBlur={onBlur}
                onChangeText={value => onChange(value)}
                value={value}
                style={styles.input}
                mode="outlined"
                multiline
                numberOfLines={4}
                maxLength={160}
                theme={{ colors: { primary: Colors.light.secondary } }}
              />
            )}
            name="bios"
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Job Position"
                onBlur={onBlur}
                onChangeText={value => onChange(value)}
                value={value}
                style={styles.input}
                mode="outlined"
                theme={{ colors: { primary: Colors.light.secondary } }}
                maxLength={30}
              />
            )}
            name="jobPosition"
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Email"
                onBlur={onBlur}
                onChangeText={value => onChange(value)}
                value={value}
                style={styles.input}
                mode="outlined"
                theme={{ colors: { primary: Colors.light.secondary } }}
                maxLength={30}
                inputMode="email"
                disabled
              />
            )}
            name="email"
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Phone Number"
                onBlur={onBlur}
                onChangeText={value => onChange(value)}
                value={value}
                style={styles.input}
                mode="outlined"
                theme={{ colors: { primary: Colors.light.secondary } }}
                maxLength={30}
                inputMode="tel"
              />
            )}
            name="phoneNum"
          />
          <Button
            onPress={handleSubmit(onSubmit)}
            style={{
              marginTop: actuatedNormalizeVertical(8),
              backgroundColor: Colors.light.secondary,
            }}
            labelStyle={{ color: '#ffffff' }}
          >
            Save Details
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#c75030',
    paddingHorizontal: actuatedNormalize(20),
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
  inputContainer: {
    flex: 1,
    paddingHorizontal: actuatedNormalize(16),
    marginVertical: actuatedNormalizeVertical(20),
  },
  input: {
    marginVertical: actuatedNormalizeVertical(8),
    backgroundColor: '#ffffff',
  },
});
