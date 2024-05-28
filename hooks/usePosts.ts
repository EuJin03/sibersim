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

import { Post, User } from '@/constants/Types';

const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPosts = async () => {
    try {
      const postsCollection = collection(getFirestore(), 'posts');
      const querySnapshot = await getDocs(postsCollection);
      const postData: Post[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Post),
      }));
      setPosts(postData);
      setLoading(false);
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  };

  const getPostById = async (id: string) => {
    try {
      const postDocRef = doc(getFirestore(), 'posts', id);
      const docSnapshot = await getDoc(postDocRef);
      if (!docSnapshot.exists()) {
        return null;
      }
      const postData = { id: docSnapshot.id, ...(docSnapshot.data() as Post) };
      return postData;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  };

  const addPost = async (post: Post) => {
    try {
      const postsCollection = collection(getFirestore(), 'posts');
      const docRef = await addDoc(postsCollection, post);
      return docRef.id;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  };

  const updatePost = async (id: string, post: Partial<Post>) => {
    try {
      const postDocRef = doc(getFirestore(), 'posts', id);
      await updateDoc(postDocRef, post);
    } catch (err) {
      setError(err as Error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    error,
    getPostById,
    addPost,
    updatePost,
    setLoading,
    setError,
  };
};
