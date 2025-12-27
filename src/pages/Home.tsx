import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Brain, Sparkles, Zap, Cpu } from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { postsApi } from '../services/api';
import { Post } from '../types';

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

// 从HTML内容中提取纯文本的函数
const stripHtml = (html: string): string => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postsApi.getAll();
        setPosts(data);
      } catch (err) {
        setError('加载文章失败');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const featuredPost = posts.length > 0 ? posts[0] : null;
  const otherPosts = posts.length > 1 ? posts.slice(1) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400 mb-4"></div>
          <p className="text-slate-300">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 via-cyan-600/10 to-emerald-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Brain className="h-12 w-12 text-emerald-400 animate-pulse" />
              <Sparkles className="h-8 w-8 text-cyan-400" />
              <Cpu className="h-12 w-12 text-emerald-400 animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              基于大模型的
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {' '}应用开发技术
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              探索人工智能+的创新应用，分享大模型开发实践经验，与开发者社区共同成长
            </p>
            <div className="flex items-center justify-center space-x-2 text-slate-400">
              <Zap className="h-5 w-5" />
              <span className="text-sm">AI驱动 · 智能创新 · 技术前沿</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12">
            <Link
              to={`/posts/${featuredPost.id}`}
              className="group block bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl overflow-hidden shadow-2xl border border-emerald-700/30 hover:border-emerald-500/50 transition-all hover:shadow-emerald-500/25"
            >
              {featuredPost.coverImage && (
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                </div>
              )}
              <div className="p-8">
                <div className="flex items-center space-x-4 text-sm text-slate-400 mb-4">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {featuredPost.created_at ? new Date(featuredPost.created_at).toLocaleDateString('zh-CN') : '未知日期'}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {featuredPost.readingTime || '5'} 分钟阅读
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-slate-300 mb-6 line-clamp-2">
                  {featuredPost.excerpt || stripHtml(renderMarkdown(featuredPost.content)).substring(0, 200)}
                </p>
                <div className="flex items-center text-emerald-400 font-medium">
                  阅读更多
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Other Posts Grid */}
        {otherPosts.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
              <Sparkles className="h-6 w-6 mr-2 text-cyan-400" />
              最新文章
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/posts/${post.id}`}
                  className="group block bg-gradient-to-br from-slate-900/30 to-slate-800/30 rounded-xl overflow-hidden shadow-lg border border-emerald-700/20 hover:border-emerald-500/40 transition-all hover:shadow-emerald-500/20"
                >
                  {post.coverImage && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent"></div>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center space-x-3 text-xs text-slate-400 mb-3">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {post.created_at ? new Date(post.created_at).toLocaleDateString('zh-CN') : '未知日期'}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {post.readingTime || '5'} 分钟
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-slate-300 text-sm line-clamp-2">
                      {post.excerpt || stripHtml(renderMarkdown(post.content)).substring(0, 100)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-16">
            <Brain className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">暂无文章</h3>
            <p className="text-slate-300 mb-6">
              还没有发布任何文章，快来创建第一篇吧！
            </p>
            <Link
              to="/posts/new"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-full font-medium hover:from-emerald-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-emerald-500/25"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              创建第一篇文章
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;