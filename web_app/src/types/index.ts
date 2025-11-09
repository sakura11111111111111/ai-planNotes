export interface User {
  id: number;
  username: string;
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
}

export interface Category {
  id: number;
  name: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  categoryId?: number;
  categoryName?: string;
  userId: number;
  supervisionEnabled: boolean;
  supervisionDuration?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: number;
  noteId: number;
  noteTitle: string;
  noteContent: string;
  categoryName?: string;
  reviewCount: number;
  reviewDate: string;
  status: 'PENDING' | 'COMPLETED';
  aiSummary?: string;
  supervisionEnabled: boolean;
  supervisionDuration?: number;
}

export interface ReviewResult {
  result: 'REMEMBERED' | 'VAGUE' | 'FORGOTTEN';
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}