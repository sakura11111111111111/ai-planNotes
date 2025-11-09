// Axios 配置和拦截器
import axios, { AxiosError } from 'axios';
import { storage } from '../utils/storage';
import { ApiResponse } from '../types';

// 创建 axios 实例
const client = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 自动添加 Token
client.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 统一处理错误
client.interceptors.response.use(
  (response) => {
    // 返回响应数据
    return response;
  },
  (error: AxiosError<ApiResponse<any>>) => {
    // 401 未授权 - 清除 Token 并跳转登录
    if (error.response?.status === 401) {
      storage.clearAll();
      window.location.href = '/login';
      return Promise.reject(new Error('未授权，请重新登录'));
    }

    // 403 禁止访问
    if (error.response?.status === 403) {
      return Promise.reject(new Error('没有权限访问该资源'));
    }

    // 404 未找到
    if (error.response?.status === 404) {
      return Promise.reject(new Error('请求的资源不存在'));
    }

    // 409 冲突
    if (error.response?.status === 409) {
      const message = error.response.data?.message || '操作冲突';
      return Promise.reject(new Error(message));
    }

    // 500 服务器错误
    if (error.response?.status === 500) {
      const message = error.response.data?.message || '服务器错误，请稍后重试';
      return Promise.reject(new Error(message));
    }

    // 其他错误
    const message = error.response?.data?.message || error.message || '网络错误';
    return Promise.reject(new Error(message));
  }
);

export default client;
