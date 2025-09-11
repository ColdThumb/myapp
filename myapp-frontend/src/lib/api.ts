import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  withCredentials: true // 启用 Cookie 支持会话
});

// 认证相关API
export const authApi = {
  // 用户注册
  register: (userData: RegisterData) => api.post('/register', { user: userData }),
  
  // 用户登录
  login: (credentials: LoginCredentials) => api.post('/login', credentials),
  
  // 用户登出
  logout: () => api.delete('/logout'),
  
  // 获取当前用户信息
  getCurrentUser: () => api.get('/me')
};

// 用户相关API
export const userApi = {
  // 获取所有用户
  getUsers: () => api.get('/users'),
  
  // 获取单个用户
  getUser: (id: number) => api.get(`/users/${id}`),
  
  // 获取所有作者
  getAuthors: () => api.get('/users', { params: { is_author: true } }),
  
  // 获取所有客户
  getClients: () => api.get('/users', { params: { is_client: true } }),
  
  // 创建用户
  createUser: (userData: any) => api.post('/users', userData),
  
  // 更新用户
  updateUser: (id: number, userData: any) => api.put(`/users/${id}`, userData),
  
  // 删除用户
  deleteUser: (id: number) => api.delete(`/users/${id}`)
};

// 文章相关API
export const articleApi = {
  // 获取所有文章（支持分页、搜索、筛选）
  getArticles: (page: number = 1, per_page: number = 10, search?: string, visibility?: string) => 
    api.get('/articles', { params: { page, per_page, search, visibility } }),
  
  // 获取公开文章
  getPublicArticles: () => api.get('/articles', { params: { is_public: true } }),
  
  // 获取单个文章
  getArticle: (id: number) => api.get(`/articles/${id}`),
  
  // 获取作者的文章
  getAuthorArticles: (authorId: number) => api.get('/articles', { params: { author_id: authorId } }),
  
  // 创建文章
  createArticle: (articleData: any) => api.post('/articles', articleData),
  
  // 更新文章
  updateArticle: (id: number, articleData: any) => api.put(`/articles/${id}`, articleData),
  
  // 删除文章
  deleteArticle: (id: number) => api.delete(`/articles/${id}`),
  
  // 获取文章挑战问题
  getChallenge: (id: number) => api.get(`/articles/${id}/challenge`),
  getArticleChallenge: (id: number) => api.get(`/articles/${id}/challenge`),
  
  // 验证答案访问权限
  verifyAnswer: (id: number, answer: string) => 
    api.post(`/articles/${id}/verify_access`, { answer }),
  verifyAnswerAccess: (id: number, answer: string) => 
    api.post(`/articles/${id}/verify_access`, { answer })
};

// 委托相关API
export const commissionApi = {
  // 获取所有委托
  getCommissions: (params?: any) => api.get('/commissions', { params }),
  
  // 获取单个委托
  getCommission: (id: number) => api.get(`/commissions/${id}`),
  
  // 获取客户的委托
  getCustomerCommissions: (customerId: number) => api.get('/commissions', { params: { customer_id: customerId } }),
  
  // 获取作者的委托
  getAuthorCommissions: (authorId: number) => api.get('/commissions', { params: { assigned_author_id: authorId } }),
  
  // 获取可用的委托（状态为open）
  getAvailableCommissions: () => api.get('/commissions', { params: { status: 'open' } }),
  
  // 创建委托
  createCommission: (commissionData: any) => api.post('/commissions', commissionData),
  
  // 更新委托
  updateCommission: (id: number, commissionData: any) => api.put(`/commissions/${id}`, commissionData),
  
  // 删除委托
  deleteCommission: (id: number, email?: string) => api.delete(`/commissions/${id}`, { data: { email } }),
  
  // 分配委托给作者
  assignCommission: (id: number, authorId: number) => api.put(`/commissions/${id}/assign`, { assigned_author_id: authorId }),
  
  // 更新委托状态
  updateCommissionStatus: (id: number, status: string) => api.put(`/commissions/${id}/status`, { status }),
  
  // 验证邮箱并获取委托详情
  verifyEmailAndGetDetail: (id: number, email: string) => api.post(`/commissions/${id}/verify_email`, { email }),
  
  // 发送委托提交成功邮件
  sendCommissionSuccessEmail: (commissionId: number) => api.post(`/commissions/${commissionId}/send_success_email`)
};

// 认证相关类型定义
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  bio?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface AuthError {
  error: string;
  errors?: string[];
}

// 类型定义
export interface User {
  id: number;
  name: string;
  email: string;
  is_author: boolean;
  is_client: boolean;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: number;
  title: string;
  body: string;
  visibility: 'public' | 'restricted' | 'private';
  author_id: number;
  author?: User;
  created_at: string;
  updated_at: string;
}

export interface Commission {
  id: number;
  title: string;
  description?: string;
  budget?: number;
  status: 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  customer_id: number;
  customer?: User;
  assigned_author_id?: number;
  assigned_author?: User;
  estimated_delivery_date?: string;
  created_at: string;
  updated_at: string;
}
