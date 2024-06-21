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
  fetchMaterials: () => Promise<void>;
}

const useMaterialStore = create<MaterialState>(set => ({
  materials: [],
  courseItems: [],
  videoItems: [],
  loading: false,

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
}));

export default useMaterialStore;
