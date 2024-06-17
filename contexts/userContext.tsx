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
import useGroupStore from '@/hooks/useGroup';
import { ActivityIndicator, Dimensions } from 'react-native';

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
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('dbUser');
        if (storedUser) {
          setDbUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading user from storage:', error);
        setIsLoading(false);
      }
    };

    loadUserFromStorage();

    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    });
  }, []);

  useEffect(() => {
    const handleRouting = async () => {
      if (!isLoading) {
        if (dbUser) {
          if (dbUser.isNewUser && pathname === '/login') {
            router.replace('/setup');
          } else {
            if (pathname === '/login') {
              router.replace('/(tabs)');
            }
          }
        } else {
          router.replace('/login');
        }
      }
    };

    handleRouting();
  }, [dbUser, isLoading, router]);

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
      useGroupStore.getState().resetState();
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
    if (dbUser?.id) {
      const userId = dbUser.id;
      // Check if userId is a valid document ID
      if (typeof userId === 'string' && !userId.includes('/')) {
        const updatedUser = await getUserById(userId);
        if (updatedUser) {
          setDbUser(updatedUser);
          await AsyncStorage.setItem('dbUser', JSON.stringify(updatedUser));
        } else {
          console.warn('User not found with ID:', userId);
        }
      } else {
        console.warn('Invalid user ID:', userId);
      }
    }
  }, [dbUser, getUserById, setDbUser]);

  const authContext: AuthType = {
    authUser: dbUser ? ({ uid: dbUser.id } as firebase.User) : null,
    dbUser,
    signIn,
    signOut,
    fetchUpdatedDbUser,
  };

  if (isLoading) {
    return (
      <ActivityIndicator style={{ height: Dimensions.get('screen').height }} />
    ); // Render a loading screen or placeholder while the authentication state is being determined
  }

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};
