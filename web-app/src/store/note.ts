// 笔记状态管理
import { create } from 'zustand';
import { Note, NoteListItem, CreateNoteRequest, UpdateNoteRequest } from '../types';
import * as noteApi from '../api/notes';

interface NoteState {
  notes: NoteListItem[];
  currentNote: Note | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchNotes: (categoryId?: number | null) => Promise<void>;
  fetchNoteById: (id: number) => Promise<void>;
  createNote: (data: CreateNoteRequest) => Promise<Note>;
  updateNote: (id: number, data: UpdateNoteRequest) => Promise<Note>;
  deleteNote: (id: number) => Promise<void>;
  generateSummary: (noteId: number) => Promise<void>;
  clearCurrentNote: () => void;
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  currentNote: null,
  loading: false,
  error: null,

  fetchNotes: async (categoryId?: number | null) => {
    set({ loading: true, error: null });
    try {
      const notes = await noteApi.getNotes(categoryId);
      set({ notes, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  fetchNoteById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const note = await noteApi.getNoteById(id);
      set({ currentNote: note, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  createNote: async (data: CreateNoteRequest) => {
    set({ loading: true, error: null });
    try {
      const note = await noteApi.createNote(data);
      set({ loading: false });
      return note;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateNote: async (id: number, data: UpdateNoteRequest) => {
    set({ loading: true, error: null });
    try {
      const note = await noteApi.updateNote(id, data);
      set({ currentNote: note, loading: false });
      return note;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteNote: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await noteApi.deleteNote(id);
      set((state) => ({
        notes: state.notes.filter((n) => n.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  generateSummary: async (noteId: number) => {
    set({ loading: true, error: null });
    try {
      await noteApi.generateSummary({ noteId });
      // 重新获取笔记详情以更新 AI 总结
      if (get().currentNote?.id === noteId) {
        await get().fetchNoteById(noteId);
      }
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  clearCurrentNote: () => {
    set({ currentNote: null });
  },
}));
