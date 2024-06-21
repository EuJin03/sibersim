// hooks/useBlogs.ts
import { create } from 'zustand';
import { Blog } from '@/constants/Types';
import { client } from '@/utils/sanity';

interface BlogState {
  blogs: Blog[];
  selectedBlog: Blog | null;
  loading: boolean;
  setSelectedBlog: (blog: Blog) => void;
  fetchBlogs: () => Promise<void>;
}

const useBlogStore = create<BlogState>((set, get) => ({
  blogs: [],
  selectedBlog: null,
  loading: false,
  setSelectedBlog: blog => set({ selectedBlog: blog }),
  fetchBlogs: async () => {
    set({ loading: true });
    try {
      const query = '*[_type == "blog"]';
      const blogs = await client.fetch(query);
      set({ blogs, loading: false });
    } catch (error) {
      console.error('Error fetching blogs:', error);
      set({ loading: false });
    }
  },
}));

export default useBlogStore;
