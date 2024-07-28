import React, { useState } from 'react';
import { useAuth } from '@/contexts/userContext';
import { Stack } from 'expo-router';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import BackgroundAnimation from '@/components/basic/BackgroundAnimation';
import { Colors } from '@/hooks/useThemeColor';

export default function SignIn() {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn();
    } catch (error) {
      console.error('Sign in error:', error);
      // Optionally handle the error, e.g., show an error message to the user
    } finally {
      setIsLoading(false);
    }
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
              fontSize: 20,
              fontWeight: 'bold',
              color: '#ffffff',
              textAlign: 'center',
              width: '70%',
            }}
          >
            Let's Sibersim-lah!🎉
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: 'bold',
              color: '#ffffff',
              textAlign: 'center',
              width: '80%',
              lineHeight: 18,
            }}
          >
            Level up your cybersecurity skills with us. Learn, Play, and Secure
            Your Digital World Together!
          </Text>
        </View>
        <View style={styles.bottomView}>
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
              <ActivityIndicator size="large" color={Colors.light.secondary} />
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

const styles = StyleSheet.create({
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
