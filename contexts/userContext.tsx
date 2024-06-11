import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePathname, useRouter } from 'expo-router';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { firebase, auth } from '@/firebase';
import useUsersStore, { UserState } from '@/hooks/useUsers';

interface AuthType {
  authUser: firebase.User | null;
  dbUser: UserState['dbUser'];
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  fetchUpdatedDbUser: () => Promise<void>;
}

const AuthContext = createContext<AuthType>({
  authUser: null,
  dbUser: null,
  signIn: async () => {},
  signOut: async () => {},
  fetchUpdatedDbUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    addNewUser,
    getUserByEmail,
    dbUser,
    setDbUser,
    removeDbUser,
    getUserById,
  } = useUsersStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleRouting = async () => {
      if (dbUser) {
        if (dbUser.isNewUser && pathname === '/login') {
          router.replace('/setup');
        } else {
          if (pathname === '/login') {
            router.replace('/(tabs)');
          } else {
            router.replace(pathname);
          }
        }
      } else {
        router.replace('/login');
      }
    };

    handleRouting();
  }, [dbUser, router]);

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
      webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    });
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const credential = firebase.auth.GoogleAuthProvider.credential(
        userInfo.idToken
      );
      const result = await auth.signInWithCredential(credential);
      const authUser = result.user;
      const isNewUser = result.additionalUserInfo?.isNewUser;

      if (isNewUser) {
        const newUser = {
          email: authUser?.email || '',
          displayName: authUser?.displayName || '',
          profilePicture: authUser?.photoURL || '',
          jobPosition: '',
          bios: '',
          isNewUser: isNewUser || true,
          group: '',
        };
        const user = await addNewUser(newUser);
        await AsyncStorage.setItem('dbUser', JSON.stringify(user));
      } else {
        const user = await getUserByEmail(authUser?.email || '');
        await AsyncStorage.setItem('dbUser', JSON.stringify(user));
      }

      if (router.canGoBack()) {
        router.dismissAll();
      }
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await firebase.auth().signOut();
      removeDbUser();
      await AsyncStorage.removeItem('dbUser');
      if (router.canGoBack()) {
        router.dismissAll();
      }
      router.replace('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      if (router.canGoBack()) {
        router.dismissAll();
      }
      router.replace('/login');
    }
  };

  const fetchUpdatedDbUser = useCallback(async () => {
    if (dbUser) {
      const updatedUser = await getUserById(dbUser?.id ?? '');
      setDbUser(updatedUser);
      await AsyncStorage.setItem('dbUser', JSON.stringify(updatedUser));
    }
  }, [dbUser, getUserById, setDbUser]);

  const authContext: AuthType = {
    authUser: dbUser ? ({ uid: dbUser.id } as firebase.User) : null,
    dbUser,
    signIn,
    signOut,
    fetchUpdatedDbUser,
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};
