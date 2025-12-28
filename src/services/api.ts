import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://222.94.222.64:7862/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 文章接口
export const postsApi = {
  // 获取所有文章
  getAll: async () => {
    const response = await api.get('/posts');
    return response.data;
  },

  // 获取单个文章
  getById: async (id: number) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  // 创建文章
  create: async (data: { 
    title: string; 
    content: string; 
    imageUrl?: string; 
    authorId: number;
    attachments?: Array<{
      name: string;
      url: string;
      size: number;
      type: string;
    }>;
  }) => {
    const response = await api.post('/posts', data);
    return response.data;
  },

  // 更新文章
  update: async (id: number, data: { 
    title: string; 
    content: string; 
    imageUrl?: string;
    attachments?: Array<{
      name: string;
      url: string;
      size: number;
      type: string;
    }>;
  }) => {
    const response = await api.put(`/posts/${id}`, data);
    return response.data;
  },

  // 删除文章
  delete: async (id: number, adminEmail: string) => {
    const response = await api.delete(`/posts/${id}`, { data: { adminEmail } });
    return response.data;
  },
};

// 认证接口
export const authApi = {
  // 注册（扩展版）
  register: async (data: { 
    username: string; 
    email: string; 
    password: string; 
    realName: string; 
    organization: string; 
    position: string; 
    responsibilities: string; 
    contactInfo: string; 
  }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  // 登录
  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  // 获取待审批用户列表
  getPendingUsers: async (adminEmail: string) => {
    const response = await api.get('/auth/pending-users', { params: { adminEmail } });
    return response.data;
  },

  // 审批用户
  approveUser: async (data: { userId: number; action: 'approve' | 'reject'; adminEmail: string }) => {
    const response = await api.post('/auth/approve-user', data);
    return response.data;
  },
};

export default api;


