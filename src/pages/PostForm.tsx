import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Save, ArrowLeft, Loader2, Upload, X, Image as ImageIcon, FileText, Paperclip } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { postsApi } from '../services/api';
import { Post, PostFormData, Attachment, User as UserType } from '../types';
import { stripHtml } from '../utils/helpers';

const PostForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(true);

  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: '',
    imageUrl: '',
    authorId: 1,
    attachments: [],
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  useEffect(() => {
    // 从 localStorage 获取当前登录用户信息
    const userStr = localStorage.getItem('currentUser');
    console.log('localStorage中的用户信息:', userStr);
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log('解析后的用户信息:', user);
        setCurrentUser(user);
        // 设置 authorId 为当前用户的 id
        setFormData(prev => ({
          ...prev,
          authorId: user.id
        }));
      } catch (err) {
        console.error('Failed to parse user from localStorage:', err);
      }
    } else {
      console.log('localStorage中没有用户信息');
    }
  }, []);

  useEffect(() => {
    console.log('useEffect触发:', { isEditing, id, currentUser });
    // 只有在用户信息加载完成后才获取文章数据
    if (isEditing && id && currentUser !== null) {
      console.log('准备获取文章数据, postId:', id);
      fetchPost(parseInt(id));
    } else {
      console.log('不满足获取文章数据的条件:', { isEditing, id, currentUser });
    }
  }, [id, isEditing, currentUser]);

  const fetchPost = async (postId: number) => {
    try {
      setLoading(true);
      const data: Post = await postsApi.getById(postId);
      
      console.log('获取到的文章数据:', data);
      console.log('文章内容:', data.content);
      
      // 检查编辑权限
      if (currentUser) {
        const isAdmin = currentUser.role === 'admin';
        const isAuthor = currentUser.id === data.author_id;
        
        if (!isAdmin && !isAuthor) {
          setHasPermission(false);
          setError('您没有权限编辑这篇文章');
          return;
        }
      } else {
        // 未登录用户不能编辑
        setHasPermission(false);
        setError('请先登录');
        return;
      }
      
      setFormData({
        title: data.title,
        content: data.content,
        imageUrl: data.image_url || '',
        attachments: data.attachments || [],
      });
      
      console.log('设置后的 formData:', {
        title: data.title,
        content: data.content,
        imageUrl: data.image_url || '',
        attachments: data.attachments || [],
      });
      
      if (data.image_url) {
        setImagePreview(data.image_url);
      }
      if (data.attachments) {
        setAttachments(data.attachments);
      }
      setError(null);
    } catch (err) {
      setError('加载文章失败,请稍后重试');
      console.error('Failed to fetch post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert('标题和内容不能为空');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const submitData = {
        title: formData.title,
        content: formData.content,
        imageUrl: formData.imageUrl,
        attachments: attachments,
      };

      if (isEditing && id) {
        await postsApi.update(parseInt(id), {
          ...submitData,
          authorId: formData.authorId,
        });
      } else {
        await postsApi.create({
          ...submitData,
          authorId: formData.authorId || 1,
        });
      }

      navigate('/');
    } catch (err) {
      setError(isEditing ? '更新文章失败' : '创建文章失败');
      console.error('Failed to save post:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContentChange = (content: string | undefined) => {
    setFormData((prev) => ({
      ...prev,
      content: content || '',
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData((prev) => ({
          ...prev,
          imageUrl: base64String,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setFormData((prev) => ({
      ...prev,
      imageUrl: '',
    }));
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          const newAttachment: Attachment = {
            name: file.name,
            url: base64String,
            size: file.size,
            type: file.type,
          };
          setAttachments((prev) => [...prev, newAttachment]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // 如果没有编辑权限,显示错误信息
  if (isEditing && !hasPermission) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || '您没有权限编辑这篇文章'}</p>
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center text-blue-300 hover:text-blue-400 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回首页
        </Link>
        <h1 className="text-4xl font-bold text-white drop-shadow-lg">
          {isEditing ? '编辑文章' : '创建新文章'}
        </h1>
      </div>

      {/* Form */}
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-blue-700/30">
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-blue-200 mb-2">
              文章标题 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="请输入文章标题"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-500"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              封面图片
            </label>
            
            {/* Upload Method Toggle */}
            <div className="flex space-x-4 mb-4">
              <button
                type="button"
                onClick={() => setUploadMethod('url')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  uploadMethod === 'url'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                URL链接
              </button>
              <button
                type="button"
                onClick={() => setUploadMethod('file')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  uploadMethod === 'file'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                本地上传
              </button>
            </div>

            {/* URL Input */}
            {uploadMethod === 'url' && (
              <div>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => {
                    handleChange(e);
                    setImagePreview(e.target.value);
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-500"
                />
              </div>
            )}

            {/* File Input */}
            {uploadMethod === 'file' && (
              <div>
                <div className="relative">
                  <input
                    type="file"
                    id="imageFile"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="imageFile"
                    className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-gray-800/50 transition-all"
                  >
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                      <p className="text-sm text-gray-300">
                        点击选择图片或拖拽图片到此处
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        支持 JPG、PNG、GIF 等格式
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4 relative">
                <img
                  src={imagePreview}
                  alt="预览"
                  className="w-full h-48 object-cover rounded-lg border border-gray-600"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Content with Markdown Editor */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-blue-200 mb-2">
              文章内容 <span className="text-red-400">*</span>
            </label>
            <div data-color-mode="auto">
              <MDEditor
                value={formData.content}
                onChange={handleContentChange}
                placeholder="请输入文章内容...支持Markdown格式,包括表格等..."
                height={400}
                preview="live"
                hideToolbar={false}
                visibleDragBar={true}
              />
            </div>
          </div>

          {/* Attachments Upload */}
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              附件上传
            </label>
            <div className="relative">
              <input
                type="file"
                id="attachments"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.md,.txt"
                onChange={handleAttachmentChange}
                multiple
                className="hidden"
              />
              <label
                htmlFor="attachments"
                className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-gray-800/50 transition-all"
              >
                <div className="text-center">
                  <Paperclip className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                  <p className="text-sm text-gray-300">
                    点击选择附件或拖拽文件到此处
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    支持 PDF、Word、Excel、PPT、MD、TXT 等格式
                  </p>
                </div>
              </label>
            </div>

            {/* Attachments List */}
            {attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-400 mb-2">已上传的附件:</p>
                {attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-600"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getFileIcon(attachment.type)}</span>
                      <div>
                        <p className="text-sm text-gray-200">{attachment.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(index)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4">
            <Link
              to="/"
              className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              取消
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-blue-500/25"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditing ? '更新中...' : '创建中...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? '更新文章' : '发布文章'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;