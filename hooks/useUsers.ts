import { useState, useEffect } from 'react';
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

const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(getFirestore(), 'users');
      const querySnapshot = await getDocs(usersCollection);
      const userData: User[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as User),
      }));
      setUsers(userData);
      setLoading(false);
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  };

  const getUserByEmail = async (email: string) => {
    try {
      const usersCollection = collection(getFirestore(), 'users');
      const q = query(usersCollection, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return null;
      }
      const userDoc = querySnapshot.docs[0];
      const userData = { id: userDoc.id, ...(userDoc.data() as User) };
      return userData;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  };

  const getUserById = async (id: string) => {
    try {
      const userDocRef = doc(getFirestore(), 'users', id);
      const docSnapshot = await getDoc(userDocRef);
      if (!docSnapshot.exists()) {
        return null;
      }
      const userData = { id: docSnapshot.id, ...(docSnapshot.data() as User) };
      return userData;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  };

  const updateUser = async (userId: string, updatedData: Partial<User>) => {
    try {
      const userDocRef = doc(getFirestore(), 'users', userId);
      await updateDoc(userDocRef, updatedData);
      console.log('User updated successfully');
    } catch (err) {
      setError(err as Error);
      console.error('Error updating user:', err);
    }
  };

  const addNewUser = async (newUser: User) => {
    try {
      const usersCollection = collection(getFirestore(), 'users');
      const docRef = await addDoc(usersCollection, newUser);
      const userData = { id: docRef.id, ...newUser };
      setUsers([...users, userData]);
      console.log('New user added successfully');
      return userData;
    } catch (err) {
      setError(err as Error);
      console.error('Error adding new user:', err);
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    getUserByEmail,
    getUserById,
    updateUser,
    addNewUser,
    setLoading,
    setError,
  };
};

export default useUsers;
