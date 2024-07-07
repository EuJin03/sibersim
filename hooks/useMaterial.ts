// useMaterialStore.ts
import { create } from 'zustand';
import { Material } from '@/constants/Types';
import sanityClient from '@sanity/client';
import { client } from '@/utils/sanity';

interface MaterialState {
  materials: Material[];
  courseItems: Material[];
  videoItems: Material[];
  loading: boolean;
  currentCourse: Material | null;
  fetchMaterials: () => Promise<void>;
  fetchCourseById: (id: string) => Promise<void>;
}

const useMaterialStore = create<MaterialState>((set, get) => ({
  materials: [],
  courseItems: [],
  videoItems: [],
  loading: false,
  currentCourse: null,

  fetchMaterials: async () => {
    set({ loading: true });

    try {
      const query = '*[_type == "material"]';
      const materials = await client.fetch(query);
      const courseItems = materials.filter(
        (material: Material) => material.type === 'course'
      );
      const videoItems = materials.filter(
        (material: Material) => material.type === 'video'
      );
      set({ materials, courseItems, videoItems, loading: false });
    } catch (error) {
      console.error('Error fetching materials:', error);
      set({ loading: false });
    }
  },

  fetchCourseById: async (id: string) => {
    set({ loading: true });

    try {
      const query = `*[_type == "material" && id == $id][0]`;
      const course = await client.fetch(query, { id });

      if (course) {
        set({ currentCourse: course, loading: false });
      } else {
        console.error('Course not found');
        set({ currentCourse: null, loading: false });
      }
    } catch (error) {
      console.error('Error fetching course by ID:', error);
      set({ currentCourse: null, loading: false });
    }
  },
}));

export default useMaterialStore;
