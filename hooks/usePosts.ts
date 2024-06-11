import { create } from 'zustand';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  getFirestore,
  doc,
  updateDoc,
  increment,
  getDoc,
  addDoc,
  serverTimestamp,
  arrayUnion,
} from 'firebase/firestore';
import { Comment, Post } from '@/constants/Types';

interface PostsState {
  posts: Post[];
  postDetail: Post | null;
  postLoading: boolean;
  loading: boolean;
  error: Error | null;
  lastVisible: any;
  hasMore: boolean;
  fetchPosts: (userId?: string) => Promise<void>;
  fetchMorePosts: (userId?: string) => Promise<void>;
  likePost: (postId: string, userId: string) => Promise<void>;
  fetchPostById: (postId: string) => Promise<void>;
  addPost: (
    postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  submitComment: (postId: string, commentData: Comment) => Promise<void>;
  upvoteComment: (
    postId: string,
    commentCreatedAt: string,
    userId: string
  ) => Promise<void>;
}

const usePosts = create<PostsState>((set, get) => ({
  posts: [],
  postDetail: null,
  postLoading: false,
  loading: false,
  error: null,
  lastVisible: null,
  hasMore: true,

  fetchPosts: async userId => {
    set({ loading: true, error: null });
    try {
      const db = getFirestore();
      const postsRef = collection(db, 'posts');
      let q = query(postsRef, orderBy('updatedAt', 'desc'), limit(20));
      if (userId) {
        q = query(q, where('authorId', '==', userId));
      }
      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      set({
        posts,
        loading: false,
        lastVisible: snapshot.docs[snapshot.docs.length - 1],
        hasMore: snapshot.docs.length === 20,
      });
    } catch (error) {
      set({ error: error as Error, loading: false });
    }
  },

  fetchMorePosts: async userId => {
    if (!get().hasMore || get().loading) return;
    set({ loading: true, error: null });
    try {
      const db = getFirestore();
      const postsRef = collection(db, 'posts');
      let q = query(
        postsRef,
        orderBy('updatedAt', 'desc'),
        startAfter(get().lastVisible),
        limit(20)
      );
      if (userId) {
        q = query(q, where('authorId', '==', userId));
      }
      const snapshot = await getDocs(q);
      const morePosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      set(state => ({
        posts: [...state.posts, ...morePosts],
        loading: false,
        lastVisible: snapshot.docs[snapshot.docs.length - 1],
        hasMore: snapshot.docs.length === 20,
      }));
    } catch (error) {
      set({ error: error as Error, loading: false });
    }
  },

  addPost: async postData => {
    try {
      const db = getFirestore();
      const docRef = await addDoc(collection(db, 'posts'), {
        ...postData,
        createdAt: new Date().toISOString(),
        updatedAt: serverTimestamp(),
      });
      console.log('Post added with ID: ', docRef.id);
      await get().fetchPosts(); // Fetch the updated posts after adding a new post
    } catch (error) {
      console.error('Error adding post: ', error);
    }
  },

  likePost: async (postId, userId) => {
    try {
      const post = get().posts.find(post => post.id === postId);

      if (post) {
        const upvoteArray = post.upvote || []; // Use an empty array if upvote is undefined
        let updatedUpvoteArray = [];

        if (upvoteArray.includes(userId)) {
          // Remove userId from upvote array
          updatedUpvoteArray = upvoteArray.filter(id => id !== userId);
        } else {
          // Add userId to upvote array
          updatedUpvoteArray = [...upvoteArray, userId];
        }

        // Update the Zustand state first
        set(state => ({
          posts: state.posts.map(post =>
            post.id === postId ? { ...post, upvote: updatedUpvoteArray } : post
          ),
          postDetail:
            state.postDetail?.id === postId
              ? { ...state.postDetail, upvote: updatedUpvoteArray }
              : state.postDetail,
        }));

        // Update the server after updating the Zustand state
        const db = getFirestore();
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
          upvote: updatedUpvoteArray,
        });
      }
    } catch (error) {
      console.error('Error liking post:', error);
      // Revert the Zustand state changes in case of an error
      set(state => ({
        posts: state.posts.map(post =>
          post.id === postId ? { ...post, upvote: post.upvote || [] } : post
        ),
        postDetail:
          state.postDetail?.id === postId
            ? { ...state.postDetail, upvote: state.postDetail.upvote || [] }
            : state.postDetail,
      }));
    }
  },

  fetchPostById: async (postId: string) => {
    try {
      set({ loading: true, error: null });
      const postDocRef = doc(getFirestore(), 'posts', postId);
      const postSnapshot = await getDoc(postDocRef);
      if (postSnapshot.exists()) {
        const postData = {
          id: postSnapshot.id,
          ...(postSnapshot.data() as Post),
        };
        set(state => ({
          posts: state.posts.map(post =>
            post.id === postId ? postData : post
          ),
          postDetail: postData,
          loading: false,
        }));
      } else {
        set({ postDetail: null, loading: false });
      }
    } catch (err) {
      set({ error: err as Error, loading: false });
    }
  },

  submitComment: async (postId, commentData) => {
    try {
      set({ postLoading: true, error: null });
      const db = getFirestore();
      const postRef = doc(db, 'posts', postId);

      // Update the post's comments array with the new comment
      await updateDoc(postRef, {
        comments: arrayUnion({
          ...commentData,
          createdAt: new Date().toISOString(),
        }),
      });

      // Update the Zustand state with the new comment
      set(state => ({
        posts: state.posts.map(post =>
          post.id === postId
            ? {
                ...post,
                comments: [
                  ...post.comments,
                  { ...commentData, createdAt: new Date().toISOString() },
                ].sort(
                  (a, b) =>
                    new Date(b.createdAt ?? '').getTime() -
                    new Date(a.createdAt ?? '').getTime()
                ), // Sort comments by createdAt in descending order
              }
            : post
        ),
        postDetail:
          state.postDetail?.id === postId
            ? {
                ...state.postDetail,
                comments: [
                  ...state.postDetail.comments,
                  { ...commentData, createdAt: new Date().toISOString() },
                ].sort(
                  (a, b) =>
                    new Date(b.createdAt ?? '').getTime() -
                    new Date(a.createdAt ?? '').getTime()
                ), // Sort comments by createdAt in descending order
              }
            : state.postDetail,
      }));
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      set({ postLoading: false, error: null });
    }
  },

  upvoteComment: async (postId, commentCreatedAt, userId) => {
    try {
      const db = getFirestore();
      const postRef = doc(db, 'posts', postId);
      const post = get().posts.find(post => post.id === postId);

      if (post) {
        const comment = post.comments.find(
          comment => comment.createdAt === commentCreatedAt
        );

        if (comment) {
          const upvoteArray = comment.upvote || []; // Use an empty array if upvote is undefined

          if (upvoteArray.includes(userId)) {
            // Remove userId from upvote array
            const updatedUpvoteArray = upvoteArray.filter(id => id !== userId);

            await updateDoc(postRef, {
              comments: post.comments.map(comment =>
                comment.createdAt === commentCreatedAt
                  ? { ...comment, upvote: updatedUpvoteArray }
                  : comment
              ),
            });

            set(state => ({
              posts: state.posts.map(post =>
                post.id === postId
                  ? {
                      ...post,
                      comments: post.comments
                        .map(comment =>
                          comment.createdAt === commentCreatedAt
                            ? { ...comment, upvote: updatedUpvoteArray }
                            : comment
                        )
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt ?? '').getTime() -
                            new Date(a.createdAt ?? '').getTime()
                        ), // Sort comments by createdAt in descending order
                    }
                  : post
              ),
            }));
          } else {
            // Add userId to upvote array
            const updatedUpvoteArray = [...upvoteArray, userId];

            await updateDoc(postRef, {
              comments: post.comments
                .map(comment =>
                  comment.createdAt === commentCreatedAt
                    ? { ...comment, upvote: updatedUpvoteArray }
                    : comment
                )
                .sort(
                  (a, b) =>
                    new Date(b.createdAt ?? '').getTime() -
                    new Date(a.createdAt ?? '').getTime()
                ),
            });

            set(state => ({
              posts: state.posts.map(post =>
                post.id === postId
                  ? {
                      ...post,
                      comments: post.comments
                        .map(comment =>
                          comment.createdAt === commentCreatedAt
                            ? { ...comment, upvote: updatedUpvoteArray }
                            : comment
                        )
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt ?? '').getTime() -
                            new Date(a.createdAt ?? '').getTime()
                        ), // Sort comments by createdAt in descending order
                    }
                  : post
              ),
            }));
          }
        }
      }
    } catch (error) {
      console.error('Error upvoting comment:', error);
    }
  },
}));

export default usePosts;
