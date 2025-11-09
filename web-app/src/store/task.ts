// 任务状态管理
import { create } from 'zustand';
import { TodayTask, SubmitReviewRequest, SubmitReviewResponse } from '../types';
import * as taskApi from '../api/tasks';
import * as reviewApi from '../api/reviews';

interface TaskState {
  tasks: TodayTask[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchTodayTasks: () => Promise<void>;
  submitReview: (data: SubmitReviewRequest) => Promise<SubmitReviewResponse>;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTodayTasks: async () => {
    set({ loading: true, error: null });
    try {
      const tasks = await taskApi.getTodayTasks();
      set({ tasks, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  submitReview: async (data: SubmitReviewRequest) => {
    set({ loading: true, error: null });
    try {
      const result = await reviewApi.submitReview(data);
      set({ loading: false });
      return result;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));
