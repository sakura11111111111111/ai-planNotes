// API 响应通用格式
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 分页响应（未来可能使用）
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}
