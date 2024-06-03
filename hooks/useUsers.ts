import { create } from 'zustand';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
  updateDoc,
  addDoc,
} from 'firebase/firestore';
import { User } from '@/constants/Types';

interface UserState {
  users: User[];
  loading: boolean;
  error: Error | null;
  fetchUsers: () => Promise<void>;
  getUserByEmail: (email: string) => Promise<User | null>;
  getUserById: (id: string) => Promise<User | null>;
  updateUser: (userId: string, updatedData: Partial<User>) => Promise<void>;
  addNewUser: (newUser: User) => Promise<User | null>;
}

const useUsersStore = create<UserState>((set, get) => ({
  users: [],
  loading: true,
  error: null,

  fetchUsers: async () => {
    try {
      set({ loading: true, error: null });
      const usersCollection = collection(getFirestore(), 'users');
      const querySnapshot = await getDocs(usersCollection);
      const userData: User[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as User),
      }));
      set({ users: userData, loading: false });
    } catch (err) {
      set({ error: err as Error, loading: false });
    }
  },

  getUserByEmail: async (email: string) => {
    try {
      set({ loading: true, error: null });
      const usersCollection = collection(getFirestore(), 'users');
      const q = query(usersCollection, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        set({ loading: false });
        return null;
      }
      const userDoc = querySnapshot.docs[0];
      const userData = { id: userDoc.id, ...(userDoc.data() as User) };
      set({ loading: false });
      return userData;
    } catch (err) {
      set({ error: err as Error, loading: false });
      return null;
    }
  },

  getUserById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const userDocRef = doc(getFirestore(), 'users', id);
      const docSnapshot = await getDoc(userDocRef);
      if (!docSnapshot.exists()) {
        set({ loading: false });
        return null;
      }
      const userData = { id: docSnapshot.id, ...(docSnapshot.data() as User) };
      set({ loading: false });
      return userData;
    } catch (err) {
      set({ error: err as Error, loading: false });
      return null;
    }
  },

  updateUser: async (userId: string, updatedData: Partial<User>) => {
    try {
      set({ loading: true, error: null });
      const userDocRef = doc(getFirestore(), 'users', userId);
      await updateDoc(userDocRef, updatedData);
      set(state => ({
        users: state.users.map(user =>
          user.id === userId ? { ...user, ...updatedData } : user
        ),
        loading: false,
      }));
    } catch (err) {
      set({ error: err as Error, loading: false });
      console.error('Error updating user:', err);
    }
  },

  addNewUser: async (newUser: User) => {
    try {
      set({ loading: true, error: null });
      const usersCollection = collection(getFirestore(), 'users');
      const docRef = await addDoc(usersCollection, newUser);
      const userData = { id: docRef.id, ...newUser };
      set(state => ({ users: [...state.users, userData], loading: false }));
      return userData;
    } catch (err) {
      set({ error: err as Error, loading: false });
      console.error('Error adding new user:', err);
      return null;
    }
  },
}));

export default useUsersStore;
