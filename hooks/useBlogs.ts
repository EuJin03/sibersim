import { create } from 'zustand';
import { Blog } from '@/constants/Types';
import { blogs } from '@/assets/seeds/blog';

interface BlogState {
  blogs: Blog[];
  selectedBlog: Blog | null;
  setSelectedBlog: (blog: Blog) => void;
}

const useBlogStore = create<BlogState>(set => ({
  blogs,
  selectedBlog: null,
  setSelectedBlog: blog => set({ selectedBlog: blog }),
}));

export default useBlogStore;
