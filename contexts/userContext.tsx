import React, { createContext, useState, useEffect, useContext } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { User } from '@/constants/Types';
import useUsersStore from '@/hooks/useUsers';

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
  dbUser: User | null;
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

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authUser, setAuthUser] = useState<firebase.User | null>(null);
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getUserByEmail, addNewUser } = useUsersStore();
  const router = useRouter();

  useEffect(() => {
    const handleRouting = async () => {
      if (authUser) {
        if (!dbUser) {
          router.replace('/login');
        }

        if (dbUser && dbUser.isNewUser) {
          router.replace('/setup');
        }

        if (dbUser && !dbUser.isNewUser) {
          router.replace('/(tabs)');
        }
      } else {
        router.replace('/(login)');
      }
    };

    if (!isLoading) {
      handleRouting();
    }
  }, [dbUser, router, isLoading]);

  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const storedAuthUser = await AsyncStorage.getItem('authUser');
        const storedUser = await AsyncStorage.getItem('dbUser');
        if (storedUser) {
          setAuthUser(storedAuthUser ? JSON.parse(storedAuthUser) : null);
          setDbUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
      } finally {
        setIsLoading(false); // Set loading to false after checking for stored user
      }
    };

    loadUserFromStorage();

    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    });
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('userInfo', userInfo);
      const credential = firebase.auth.GoogleAuthProvider.credential(
        userInfo.idToken
      );
      const result = await firebase.auth().signInWithCredential(credential);
      const authUser = result.user;
      const isNewUser = result.additionalUserInfo?.isNewUser;
      setAuthUser(authUser);
      await AsyncStorage.setItem('authUser', JSON.stringify(authUser));

      if (isNewUser) {
        const newUser: User = {
          email: authUser?.email || '',
          displayName: authUser?.displayName || '',
          profilePicture: authUser?.photoURL || '',
          jobPosition: '',
          bios: '',
          isNewUser: isNewUser || false,
          group: '',
        };
        const user = await addNewUser(newUser);
        // console.log('newUser', newUser);
        setDbUser(newUser);
        await AsyncStorage.setItem('dbUser', JSON.stringify(user));
      } else {
        const user = await getUserByEmail(authUser?.email || '');
        setDbUser(user);
        await AsyncStorage.setItem('dbUser', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await firebase.auth().signOut();
      setAuthUser(null);
      setDbUser(null);
      await AsyncStorage.removeItem('authUser');
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
