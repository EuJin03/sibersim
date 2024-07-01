import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/userContext';
import { Stack } from 'expo-router';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import BackgroundAnimation from '@/components/basic/BackgroundAnimation';

export default function SignIn() {
  const { signIn } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignIn = () => {
    setIsLoading(true);
    signIn();
    setIsLoading(false);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1 }}>
        <BackgroundAnimation />

        <Image
          source={require('@/assets/images/sibersim_logo_inverted.png')}
          style={{
            width: actuatedNormalize(240),
            height: actuatedNormalize(240),
            marginVertical: actuatedNormalizeVertical(60),
            alignSelf: 'center',
          }}
          resizeMode="contain"
        />
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: 900,
              color: '#ffffff',
              textAlign: 'center',
              width: '70%',
            }}
          >
            Embrace the future of learning with Sibersim!🎉
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: 'bold',
              color: '#ffffff',
              textAlign: 'center',
            }}
          >
            Boost your cybersecurity skills with us. Let's get started on
            securing your digital life!
          </Text>
        </View>
        <View style={style.bottomView}>
          <View
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                marginBottom: actuatedNormalize(20),
              }}
            >
              Welcome Back! Sign in with{' '}
            </Text>
            {isLoading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <GoogleSigninButton
                onPress={handleSignIn}
                size={GoogleSigninButton.Size.Wide}
                style={{}}
              />
            )}

            <Text
              style={{
                fontSize: 10,
                color: '#909090',
                textAlign: 'center',
                marginTop: actuatedNormalize(10),
              }}
            >
              By signing in, you agree to our Terms of Service and Privacy
              Policy
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}

const style = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  bottomView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: actuatedNormalize(20),
    paddingTop: actuatedNormalize(60),
    paddingBottom: actuatedNormalize(60),
    backgroundColor: '#ffffff',
    borderTopLeftRadius: actuatedNormalize(20),
    borderTopRightRadius: actuatedNormalize(20),
    shadowColor: '#909090',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
});
