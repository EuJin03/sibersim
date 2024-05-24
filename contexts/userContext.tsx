import React, { createContext, useState, useEffect, useContext } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSegments, useRouter } from 'expo-router';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Initialize Firebase (replace with your Firebase configuration)
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_APIKEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTHDOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECTID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APPID,
};

firebase.initializeApp(firebaseConfig);

interface AuthType {
  authUser: firebase.User | null;
  dbUser: firebase.User | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthType>({
  authUser: null,
  dbUser: null,
  signIn: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

function useProtectedRoute(dbUser: firebase.User | null) {
  const router = useRouter();

  useEffect(() => {
    if (!dbUser) {
      router.replace('/login');
    } else {
      router.replace('/(tabs)');
    }
  }, [dbUser]);
}

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authUser, setAuthUser] = useState<firebase.User | null>(null);
  const [dbUser, setDbUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('dbUser');
        if (storedUser) {
          setDbUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
      }
    };

    loadUserFromStorage();

    GoogleSignin.configure({
      webClientId:
        '1082595369275-mlknr9161k4gov8gidtc4dqssqfov6c2.apps.googleusercontent.com',
    });
  }, []);

  useProtectedRoute(dbUser);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const credential = firebase.auth.GoogleAuthProvider.credential(
        userInfo.idToken
      );
      const result = await firebase.auth().signInWithCredential(credential);
      const authUser = result.user;
      setAuthUser(authUser);
      setDbUser(authUser);
      console.log(authUser);
      console.log(result);

      await AsyncStorage.setItem('dbUser', JSON.stringify(authUser));
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await firebase.auth().signOut();
      setAuthUser(null);
      setDbUser(null);
      await AsyncStorage.removeItem('dbUser');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const authContext: AuthType = {
    authUser,
    dbUser,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};
