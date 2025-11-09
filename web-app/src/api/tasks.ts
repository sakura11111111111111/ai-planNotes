// 任务 API
import client from './client';
import { ApiResponse, TodayTask } from '../types';

/**
 * 获取今日复习任务
 */
export async function getTodayTasks(): Promise<TodayTask[]> {
  const response = await client.get<ApiResponse<TodayTask[]>>('/tasks/today');
  return response.data.data;
}
