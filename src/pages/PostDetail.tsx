import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Calendar, User, ArrowLeft, Trash2, Edit, Loader2, Download, FileText, Paperclip } from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { postsApi } from '../services/api';
import { Post, Attachment, User as UserType } from '../types';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  useEffect(() => {
    // 从 localStorage 获取当前登录用户信息
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (err) {
        console.error('Failed to parse user from localStorage:', err);
      }
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchPost(parseInt(id));
    }
  }, [id]);

  const fetchPost = async (postId: number) => {
    try {
      setLoading(true);
      const data = await postsApi.getById(postId);
      setPost(data);
      setError(null);
    } catch (err) {
      setError('加载文章失败,请稍后重试');
      console.error('Failed to fetch post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    
    if (!window.confirm('确定要删除这篇文章吗?')) {
      return;
    }

    try {
      const adminEmail = currentUser?.role === 'admin' ? currentUser.email : '';
      await postsApi.delete(post.id, adminEmail);
      navigate('/');
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('删除失败,请稍后重试');
    }
  };

  // 检查是否有编辑权限
  const canEdit = (): boolean => {
    if (!currentUser || !post) return false;
    // 管理员可以编辑所有文章
    if (currentUser.role === 'admin') return true;
    // 普通用户只能编辑自己的文章
    return currentUser.id === post.author_id;
  };

  // 检查是否有删除权限
  const canDelete = (): boolean => {
    if (!currentUser || !post) return false;
    // 管理员可以删除所有文章
    if (currentUser.role === 'admin') return true;
    // 普通用户只能删除自己的文章
    return currentUser.id === post.author_id;
  };

  const handleDownloadAttachment = (attachment: Attachment) => {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('excel') || type.includes('sheet')) return '📊';
    if (type.includes('powerpoint') || type.includes('presentation')) return '📈';
    if (type.includes('text') || type.includes('markdown')) return '📃';
    return '📎';
  };

  // 将Markdown内容转换为HTML
  const renderMarkdown = (markdown: string) => {
    // 配置 marked 以支持 GFM (GitHub Flavored Markdown)，包括表格
    marked.use({
      gfm: true, // 启用 GitHub Flavored Markdown
      breaks: true, // 启用换行符
      headerIds: true, // 启用标题 ID
      mangle: false, // 不混淆电子邮件地址
    });
    
    const html = marked.parse(markdown);
    const cleanHtml = DOMPurify.sanitize(html);
    return cleanHtml;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || '文章不存在'}</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        返回首页
      </Link>

      {/* Post Header */}
      <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {post.image_url && (
          <div className="w-full bg-gray-100 flex items-center justify-center p-8">
            <img
              src={post.image_url}
              alt={post.title}
              className="max-w-full max-h-[500px] object-contain"
            />
          </div>
        )}

        <div className="p-8 md:p-12">
          {/* Meta Information */}
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
            <span className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {post.username}
            </span>
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {format(new Date(post.created_at), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            {post.title}
          </h1>

          {/* Content with Markdown */}
          <div className="prose prose-lg max-w-none mb-8">
            <div 
              dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
              className="markdown-content"
            />
          </div>

          {/* Attachments Section */}
          {post.attachments && post.attachments.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Paperclip className="h-5 w-5 mr-2" />
                附件下载
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {post.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <span className="text-2xl flex-shrink-0">{getFileIcon(attachment.type)}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{attachment.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownloadAttachment(attachment)}
                      className="ml-3 p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors flex-shrink-0"
                      title="下载附件"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回首页
            </Link>
            <div className="flex items-center space-x-4">
              {canEdit() && (
                <Link
                  to={`/posts/${post.id}/edit`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  编辑
                </Link>
              )}
              {canDelete() && (
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  删除
                </button>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default PostDetail;