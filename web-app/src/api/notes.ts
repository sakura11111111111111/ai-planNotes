// 笔记 API
import client from './client';
import { 
  ApiResponse, 
  Note, 
  NoteListItem, 
  CreateNoteRequest, 
  UpdateNoteRequest,
  AiSummary,
  SummarizeRequest 
} from '../types';

/**
 * 获取笔记列表（可按分类筛选）
 */
export async function getNotes(categoryId?: number | null): Promise<NoteListItem[]> {
  const params = categoryId ? { categoryId } : {};
  const response = await client.get<ApiResponse<NoteListItem[]>>('/notes', { params });
  return response.data.data;
}

/**
 * 获取笔记详情
 */
export async function getNoteById(id: number): Promise<Note> {
  const response = await client.get<ApiResponse<Note>>(`/notes/${id}`);
  return response.data.data;
}

/**
 * 创建笔记
 */
export async function createNote(data: CreateNoteRequest): Promise<Note> {
  const response = await client.post<ApiResponse<Note>>('/notes', data);
  return response.data.data;
}

/**
 * 更新笔记
 */
export async function updateNote(id: number, data: UpdateNoteRequest): Promise<Note> {
  const response = await client.put<ApiResponse<Note>>(`/notes/${id}`, data);
  return response.data.data;
}

/**
 * 删除笔记
 */
export async function deleteNote(id: number): Promise<void> {
  await client.delete(`/notes/${id}`);
}

/**
 * 生成 AI 总结
 */
export async function generateSummary(data: SummarizeRequest): Promise<AiSummary> {
  const response = await client.post<ApiResponse<AiSummary>>('/ai/summarize', data);
  return response.data.data;
}
