// LocalStorage 封装

const TOKEN_KEY = 'ai_plan_notes_token';
const USER_KEY = 'ai_plan_notes_user';

export const storage = {
  // Token 管理
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  // 用户信息管理
  getUser(): any | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  setUser(user: any): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser(): void {
    localStorage.removeItem(USER_KEY);
  },

  // 清除所有
  clearAll(): void {
    this.removeToken();
    this.removeUser();
  }
};
