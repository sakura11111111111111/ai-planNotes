// 复习 API
import client from './client';
import { ApiResponse, SubmitReviewRequest, SubmitReviewResponse } from '../types';

/**
 * 提交复习结果
 */
export async function submitReview(data: SubmitReviewRequest): Promise<SubmitReviewResponse> {
  const response = await client.post<ApiResponse<SubmitReviewResponse>>('/reviews/submit', data);
  return response.data.data;
}
