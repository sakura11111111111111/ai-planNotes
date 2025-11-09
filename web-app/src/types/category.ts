// 分类
export interface Category {
  id: number;
  name: string;
  createdAt: string;
}

// 创建分类请求
export interface CreateCategoryRequest {
  name: string;
}

// 更新分类请求
export interface UpdateCategoryRequest {
  name: string;
}
