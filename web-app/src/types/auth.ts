// 用户信息
export interface User {
  id: number;
  username: string;
  email: string;
}

// 注册请求
export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

// 注册响应
export interface RegisterResponse {
  id: number;
  username: string;
  email: string;
}

// 登录请求
export interface LoginRequest {
  username: string;
  password: string;
}

// 登录响应
export interface LoginResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
}
