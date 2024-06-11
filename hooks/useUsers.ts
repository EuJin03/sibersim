import { create } from 'zustand';
import { User } from '@/constants/Types';
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
}));

export default useUsersStore;
