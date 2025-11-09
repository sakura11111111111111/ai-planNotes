// 分类 API
import client from './client';
import { ApiResponse, Category, CreateCategoryRequest, UpdateCategoryRequest } from '../types';

/**
 * 获取所有分类
 */
export async function getCategories(): Promise<Category[]> {
  const response = await client.get<ApiResponse<Category[]>>('/categories');
  return response.data.data;
}

/**
 * 创建分类
 */
export async function createCategory(data: CreateCategoryRequest): Promise<Category> {
  const response = await client.post<ApiResponse<Category>>('/categories', data);
  return response.data.data;
}

/**
 * 更新分类
 */
export async function updateCategory(id: number, data: UpdateCategoryRequest): Promise<Category> {
  const response = await client.put<ApiResponse<Category>>(`/categories/${id}`, data);
  return response.data.data;
}

/**
 * 删除分类
 */
export async function deleteCategory(id: number): Promise<void> {
  await client.delete(`/categories/${id}`);
}
