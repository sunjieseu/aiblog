// 文章类型
export interface Post {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  author_id: number;
  username: string;
  created_at: string;
  updated_at?: string;
  attachments?: Attachment[];
}

// 附件类型
export interface Attachment {
  id?: number;
  name: string;
  url: string;
  size: number;
  type: string;
}

// 文章表单数据类型
export interface PostFormData {
  title: string;
  content: string;
  imageUrl?: string;
  authorId?: number;
  attachments?: Attachment[];
}

// 用户类型
export interface User {
  id: number;
  username: string;
  email: string;
  realName?: string;
  organization?: string;
  position?: string;
  responsibilities?: string;
  contactInfo?: string;
  role?: 'admin' | 'user';
  status?: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

// 认证响应类型
export interface AuthResponse {
  token: string;
  user: User;
}

// 注册表单数据类型（扩展版）
export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  realName: string;
  organization: string;
  position: string;
  responsibilities: string;
  contactInfo: string;
}

// 登录表单数据类型
export interface LoginFormData {
  email: string;
  password: string;
}

// 用户审批表单数据类型
export interface UserApprovalData {
  userId: number;
  action: 'approve' | 'reject';
  adminEmail: string;
}
