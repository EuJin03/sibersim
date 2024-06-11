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
    commentId: string,
    userId: string
  ) => Promise<void>;
}

const usePosts = create<PostsState>((set, get) => ({
  posts: [],
  postDetail: null,
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
      console.log(posts);
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
      const db = getFirestore();
      const postRef = doc(db, 'posts', postId);
      const post = get().posts.find(post => post.id === postId);

      if (post) {
        const upvoteArray = post.upvote || []; // Use an empty array if upvote is undefined

        if (upvoteArray.includes(userId)) {
          // Remove userId from upvote array
          const updatedUpvoteArray = upvoteArray.filter(id => id !== userId);

          await updateDoc(postRef, {
            upvote: updatedUpvoteArray,
          });

          set(state => ({
            posts: state.posts.map(post =>
              post.id === postId
                ? { ...post, upvote: updatedUpvoteArray }
                : post
            ),
          }));
        } else {
          // Add userId to upvote array
          const updatedUpvoteArray = [...upvoteArray, userId];

          await updateDoc(postRef, {
            upvote: updatedUpvoteArray,
          });

          set(state => ({
            posts: state.posts.map(post =>
              post.id === postId
                ? { ...post, upvote: updatedUpvoteArray }
                : post
            ),
          }));
        }
      }
    } catch (error) {
      console.error('Error liking post:', error);
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
        set({ postDetail: postData, loading: false });
      } else {
        set({ postDetail: null, loading: false });
      }
    } catch (err) {
      set({ error: err as Error, loading: false });
    }
  },

  submitComment: async (postId, commentData) => {
    try {
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
                ],
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
                ],
              }
            : state.postDetail,
      }));
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  },

  upvoteComment: async (postId, commentId, userId) => {
    try {
      const db = getFirestore();
      const postRef = doc(db, 'posts', postId);
      const post = get().posts.find(post => post.id === postId);

      if (post) {
        const comment = post.comments.find(comment => comment.id === commentId);

        if (comment) {
          const upvoteArray = comment.upvote || []; // Use an empty array if upvote is undefined

          if (upvoteArray.includes(userId)) {
            // Remove userId from upvote array
            const updatedUpvoteArray = upvoteArray.filter(id => id !== userId);

            await updateDoc(postRef, {
              comments: post.comments.map(comment =>
                comment.id === commentId
                  ? { ...comment, upvote: updatedUpvoteArray }
                  : comment
              ),
            });

            set(state => ({
              posts: state.posts.map(post =>
                post.id === postId
                  ? {
                      ...post,
                      comments: post.comments.map(comment =>
                        comment.id === commentId
                          ? { ...comment, upvote: updatedUpvoteArray }
                          : comment
                      ),
                    }
                  : post
              ),
            }));
          } else {
            // Add userId to upvote array
            const updatedUpvoteArray = [...upvoteArray, userId];

            await updateDoc(postRef, {
              comments: post.comments.map(comment =>
                comment.id === commentId
                  ? { ...comment, upvote: updatedUpvoteArray }
                  : comment
              ),
            });

            set(state => ({
              posts: state.posts.map(post =>
                post.id === postId
                  ? {
                      ...post,
                      comments: post.comments.map(comment =>
                        comment.id === commentId
                          ? { ...comment, upvote: updatedUpvoteArray }
                          : comment
                      ),
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
