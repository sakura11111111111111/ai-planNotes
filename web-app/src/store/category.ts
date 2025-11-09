// 分类状态管理
import { create } from 'zustand';
import { Category } from '../types';
import * as categoryApi from '../api/categories';

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchCategories: () => Promise<void>;
  addCategory: (name: string) => Promise<Category>;
  updateCategory: (id: number, name: string) => Promise<Category>;
  deleteCategory: (id: number) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const categories = await categoryApi.getCategories();
      set({ categories, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  addCategory: async (name: string) => {
    set({ loading: true, error: null });
    try {
      const category = await categoryApi.createCategory({ name });
      set((state) => ({
        categories: [...state.categories, category],
        loading: false,
      }));
      return category;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateCategory: async (id: number, name: string) => {
    set({ loading: true, error: null });
    try {
      const category = await categoryApi.updateCategory(id, { name });
      set((state) => ({
        categories: state.categories.map((c) => (c.id === id ? category : c)),
        loading: false,
      }));
      return category;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteCategory: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await categoryApi.deleteCategory(id);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));
