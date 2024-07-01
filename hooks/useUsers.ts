import { create } from 'zustand';
import { User, UserProgress } from '@/constants/Types';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  addDoc,
  getDoc,
  onSnapshot,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserState {
  dbUser: User | null;
  setDbUser: (user: User | null) => void;
  removeDbUser: () => void;
  getUserByEmail: (email: string) => Promise<User | null>;
  addNewUser: (newUser: Omit<User, 'id'>) => Promise<User | null>;
  updateUser: (userId: string, updatedData: Partial<User>) => Promise<void>;
  getUserById: (userId: string) => Promise<User | null>;
  updateUserProgress: (
    userId: string,
    courseId: string,
    topicId: string
  ) => Promise<void>;
  getUserProgress: (
    userId: string,
    courseId: string
  ) => Promise<UserProgress | null>;
  getUserProgressByUserId: (userId: string) => Promise<UserProgress[]>;
  subscribeToUserUpdates: (userId: string) => () => void;
}

const useUsersStore = create<UserState>((set, get) => ({
  dbUser: null,
  setDbUser: user => set({ dbUser: user }),
  removeDbUser: () => set({ dbUser: null }),

  getUserByEmail: async (email: string) => {
    try {
      const usersCollection = collection(getFirestore(), 'users');
      const q = query(usersCollection, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return null;
      }
      const userDoc = querySnapshot.docs[0];
      const userData = { id: userDoc.id, ...(userDoc.data() as User) };
      set({ dbUser: userData });
      return userData;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  },

  getUserById: async (userId: string) => {
    try {
      const userDocRef = doc(getFirestore(), 'users', userId);
      const docSnapshot = await getDoc(userDocRef);
      if (!docSnapshot.exists()) {
        return null;
      }
      const userData = { id: docSnapshot.id, ...(docSnapshot.data() as User) };
      return userData;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  },

  addNewUser: async newUser => {
    try {
      const usersCollection = collection(getFirestore(), 'users');
      const docRef = await addDoc(usersCollection, newUser);
      const userData = { id: docRef.id, ...newUser } as User;
      set({ dbUser: userData });
      return userData;
    } catch (error) {
      console.error('Error adding new user:', error);
      return null;
    }
  },

  updateUser: async (userId, updatedData) => {
    try {
      const userDocRef = doc(getFirestore(), 'users', userId);
      await updateDoc(userDocRef, updatedData);
      const updatedUser = { ...get().dbUser!, ...updatedData } as User;
      set({ dbUser: updatedUser });
      await AsyncStorage.setItem('dbUser', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  },

  updateUserProgress: async (
    userId: string,
    courseId: string,
    topicId: string
  ) => {
    try {
      // Update the user store first
      const dbUser = get().dbUser;
      if (dbUser) {
        const progress = dbUser.progress || [];
        const courseProgress = progress.find(
          (p: UserProgress) => p.courseId === courseId
        );

        if (courseProgress) {
          if (!courseProgress.completedTopics.includes(topicId)) {
            courseProgress.completedTopics.push(topicId);
          }
        } else {
          progress.push({
            courseId,
            completedTopics: [topicId],
          });
        }

        const updatedUser = { ...dbUser, progress };
        set({ dbUser: updatedUser });
        await AsyncStorage.setItem('dbUser', JSON.stringify(updatedUser));
      }

      // Update Firestore in the background
      const userDocRef = doc(getFirestore(), 'users', userId);
      const docSnapshot = await getDoc(userDocRef);

      if (docSnapshot.exists()) {
        const userData = docSnapshot.data() as User;
        const progress = userData.progress || [];

        const courseProgress = progress.find(
          (p: UserProgress) => p.courseId === courseId
        );

        if (courseProgress) {
          if (!courseProgress.completedTopics.includes(topicId)) {
            courseProgress.completedTopics.push(topicId);
          }
        } else {
          progress.push({
            courseId,
            completedTopics: [topicId],
          });
        }

        await updateDoc(userDocRef, { progress });
        console.log('User progress updated successfully');
      } else {
        console.warn('User document does not exist');
      }
    } catch (error) {
      console.error('Error updating user progress:', error);
    }
  },

  getUserProgress: async (userId: string, courseId: string) => {
    try {
      const userDocRef = doc(getFirestore(), 'users', userId);
      const docSnapshot = await getDoc(userDocRef);
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data() as User;
        const courseProgress = userData.progress?.find(
          (p: UserProgress) => p.courseId === courseId
        );
        const updatedUser = { ...userData, id: userId };
        set({ dbUser: updatedUser });
        await AsyncStorage.setItem('dbUser', JSON.stringify(updatedUser));
        return courseProgress || null;
      }
      return null;
    } catch (error) {
      console.error('Error getting user progress:', error);
      return null;
    }
  },

  getUserProgressByUserId: async (userId: string) => {
    try {
      const userDocRef = doc(getFirestore(), 'users', userId);
      const docSnapshot = await getDoc(userDocRef);
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data() as User;
        return userData.progress || [];
      }
      return [];
    } catch (error) {
      console.error('Error getting user progress by user ID:', error);
      return [];
    }
  },

  subscribeToUserUpdates: (userId: string) => {
    const userDocRef = doc(getFirestore(), 'users', userId);
    const unsubscribe = onSnapshot(userDocRef, snapshot => {
      if (snapshot.exists()) {
        const updatedUser = { id: snapshot.id, ...(snapshot.data() as User) };
        set({ dbUser: updatedUser });
        AsyncStorage.setItem('dbUser', JSON.stringify(updatedUser));
      }
    });
    return unsubscribe;
  },
}));

export default useUsersStore;
