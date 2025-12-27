import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Building, 
  Briefcase, 
  FileText, 
  Phone, 
  Mail, 
  Check, 
  X, 
  RefreshCw,
  AlertCircle,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { authApi } from '../services/api';
import { User as UserType } from '../types';

const UserApproval: React.FC = () => {
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<number | null>(null);

  // 获取当前用户信息
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  useEffect(() => {
    // 检查是否是管理员
    if (currentUser.role !== 'admin') {
      setError('您没有权限访问此页面');
      setLoading(false);
      return;
    }

    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const data = await authApi.getPendingUsers(currentUser.email);
      setPendingUsers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取待审批用户失败');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: number) => {
    if (!window.confirm('确定要批准该用户的注册申请吗？')) {
      return;
    }

    setProcessing(userId);
    try {
      await authApi.approveUser({
        userId,
        action: 'approve',
        adminEmail: currentUser.email,
      });
      // 重新获取待审批用户列表
      await fetchPendingUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : '审批失败');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (userId: number) => {
    if (!window.confirm('确定要拒绝该用户的注册申请吗？')) {
      return;
    }

    setProcessing(userId);
    try {
      await authApi.approveUser({
        userId,
        action: 'reject',
        adminEmail: currentUser.email,
      });
      // 重新获取待审批用户列表
      await fetchPendingUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : '拒绝失败');
    } finally {
      setProcessing(null);
    }
  };

  if (currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">访问被拒绝</h2>
          <p className="text-gray-600 mb-6">您没有权限访问此页面</p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">用户审批</h1>
              <p className="text-gray-600">管理待审批的用户注册申请</p>
            </div>
            <button
              onClick={fetchPendingUsers}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
              刷新
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-red-700">{error}</div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : pendingUsers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">没有待审批的用户</h3>
            <p className="text-gray-600">所有用户申请都已处理完毕</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {pendingUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* 用户基本信息 */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {user.realName || user.username}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">@{user.username}</p>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <Mail className="h-4 w-4 mr-2" />
                          {user.email}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                      <div className="flex items-start">
                        <Building className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 mb-1">单位/机构</p>
                          <p className="text-sm font-medium text-gray-900">{user.organization}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Briefcase className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 mb-1">职位</p>
                          <p className="text-sm font-medium text-gray-900">{user.position}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 mb-1">联系方式</p>
                          <p className="text-sm font-medium text-gray-900">{user.contactInfo}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 mb-1">职责描述</p>
                          <p className="text-sm text-gray-700 line-clamp-2">{user.responsibilities}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="lg:col-span-1 flex flex-col justify-center space-y-3">
                    <button
                      onClick={() => handleApprove(user.id)}
                      disabled={processing === user.id}
                      className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Check className="h-5 w-5 mr-2" />
                      {processing === user.id ? '处理中...' : '批准'}
                    </button>
                    <button
                      onClick={() => handleReject(user.id)}
                      disabled={processing === user.id}
                      className="flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X className="h-5 w-5 mr-2" />
                      {processing === user.id ? '处理中...' : '拒绝'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserApproval;