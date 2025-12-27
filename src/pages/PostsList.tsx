import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Edit, Trash2 } from 'lucide-react';
import { Post, User as UserType } from '../types';
import { postsApi } from '../services/api';
import { stripHtml, stripMarkdown, truncateText } from '../utils/helpers';

const PostsList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  useEffect(() => {
    fetchPosts();
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await postsApi.getAll();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '发生未知错误');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('确定要删除这篇文章吗？')) {
      return;
    }

    try {
      await postsApi.delete(id, currentUser?.email || '');
      // 重新获取文章列表
      fetchPosts();
    } catch (err) {
      alert(err instanceof Error ? err.message : '删除失败');
    }
  };

  const isAdmin = currentUser?.role === 'admin';
  const isLoggedIn = currentUser !== null;

  // 检查是否可以编辑文章
  const canEdit = (post: Post) => {
    if (!isLoggedIn) return false;
    if (isAdmin) return true;
    return post.user_email === currentUser?.email;
  };

  // 检查是否可以删除文章
  const canDelete = (post: Post) => {
    if (!isLoggedIn) return false;
    if (isAdmin) return true;
    return post.user_email === currentUser?.email;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={fetchPosts}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">文章列表</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            探索我们的技术文章，了解最新的AI技术和开发实践
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-6">暂无文章</p>
            {currentUser && (
              <Link
                to="/posts/new"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-full hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-blue-500/25"
              >
                写第一篇文章
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {truncateText(stripMarkdown(stripHtml(post.content)), 150)}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{post.username || '匿名'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {post.created_at
                          ? new Date(post.created_at).toLocaleDateString('zh-CN')
                          : '未知日期'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/posts/${post.id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      阅读更多
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                    <div className="flex items-center space-x-2">
                      {canEdit(post) && (
                        <Link
                          to={`/posts/${post.id}/edit`}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="编辑"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      )}
                      {canDelete(post) && (
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="删除"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
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

export default PostsList;