// 认证 API
import client from './client';
import { ApiResponse, RegisterRequest, RegisterResponse, LoginRequest, LoginResponse } from '../types';

/**
 * 用户注册
 */
export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  const response = await client.post<ApiResponse<RegisterResponse>>('/auth/register', data);
  return response.data.data;
}

/**
 * 用户登录
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await client.post<ApiResponse<LoginResponse>>('/auth/login', data);
  return response.data.data;
}
