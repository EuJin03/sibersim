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
import { Post } from '@/constants/Types';

interface PostState {
  posts: Post[];
  loading: boolean;
  error: Error | null;
  fetchPosts: () => Promise<void>;
  getPostById: (id: string) => Promise<Post | null>;
  addPost: (post: Post) => Promise<string | null>;
  updatePost: (id: string, post: Partial<Post>) => Promise<void>;
}

const usePostsStore = create<PostState>((set, get) => ({
  posts: [],
  loading: true,
  error: null,

  fetchPosts: async () => {
    try {
      set({ loading: true, error: null });
      const postsCollection = collection(getFirestore(), 'posts');
      const querySnapshot = await getDocs(postsCollection);
      const postData: Post[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Post),
      }));
      set({ posts: postData, loading: false });
    } catch (err) {
      set({ error: err as Error, loading: false });
    }
  },

  getPostById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const postDocRef = doc(getFirestore(), 'posts', id);
      const docSnapshot = await getDoc(postDocRef);
      if (!docSnapshot.exists()) {
        set({ loading: false });
        return null;
      }
      const postData = { id: docSnapshot.id, ...(docSnapshot.data() as Post) };
      set({ loading: false });
      return postData;
    } catch (err) {
      set({ error: err as Error, loading: false });
      return null;
    }
  },

  addPost: async (post: Post) => {
    try {
      set({ loading: true, error: null });
      const postsCollection = collection(getFirestore(), 'posts');
      const docRef = await addDoc(postsCollection, post);
      const newPost = { id: docRef.id, ...post };
      set(state => ({ posts: [...state.posts, newPost], loading: false }));
      return docRef.id;
    } catch (err) {
      set({ error: err as Error, loading: false });
      return null;
    }
  },

  updatePost: async (id: string, updatedPost: Partial<Post>) => {
    try {
      set({ loading: true, error: null });
      const postDocRef = doc(getFirestore(), 'posts', id);
      await updateDoc(postDocRef, updatedPost);
      set(state => ({
        posts: state.posts.map(post =>
          post.id === id ? { ...post, ...updatedPost } : post
        ),
        loading: false,
      }));
    } catch (err) {
      set({ error: err as Error, loading: false });
    }
  },
}));

export default usePostsStore;
