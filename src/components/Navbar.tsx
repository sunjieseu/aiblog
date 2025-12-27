import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Brain, Menu, X, User, LogOut, Shield, CheckCircle } from 'lucide-react';
import { User as UserType } from '../types';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 shadow-lg border-b border-blue-700/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Brain className="h-8 w-8 text-blue-400 group-hover:text-purple-400 transition-colors" />
            <span className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors">
              AI技术博客
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-blue-400' : 'text-gray-300 hover:text-blue-400'
              }`}
            >
              首页
            </Link>
            <Link
              to="/posts"
              className={`text-sm font-medium transition-colors ${
                isActive('/posts') ? 'text-blue-400' : 'text-gray-300 hover:text-blue-400'
              }`}
            >
              文章
            </Link>
            {currentUser?.role === 'admin' && (
              <Link
                to="/admin/approvals"
                className={`text-sm font-medium transition-colors ${
                  isActive('/admin/approvals') ? 'text-blue-400' : 'text-gray-300 hover:text-blue-400'
                }`}
              >
                用户审批
              </Link>
            )}
            <a
              href="https://www.cnieco.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors"
            >
              技术团队
            </a>
            {currentUser && (
              <Link
                to="/posts/new"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-full hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-blue-500/25"
              >
                写文章
              </Link>
            )}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{currentUser.realName || currentUser.username}</span>
                    {currentUser.role === 'admin' && (
                      <span className="text-xs text-blue-400 flex items-center">
                        <Shield className="h-3 w-3 mr-1" />
                        管理员
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  退出
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-full hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-blue-500/25"
                >
                  注册
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-blue-900/95 to-purple-900/95 backdrop-blur-sm">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link
              to="/"
              className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                isActive('/') ? 'text-blue-400 bg-blue-800/30' : 'text-gray-300 hover:text-blue-400 hover:bg-blue-800/20'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              首页
            </Link>
            <Link
              to="/posts"
              className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                isActive('/posts') ? 'text-blue-400 bg-blue-800/30' : 'text-gray-300 hover:text-blue-400 hover:bg-blue-800/20'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              文章
            </Link>
            {currentUser?.role === 'admin' && (
              <Link
                to="/admin/approvals"
                className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                  isActive('/admin/approvals') ? 'text-blue-400 bg-blue-800/30' : 'text-gray-300 hover:text-blue-400 hover:bg-blue-800/20'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                用户审批
              </Link>
            )}
            <a
              href="https://www.cnieco.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-purple-400 hover:bg-blue-800/20 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              技术团队
            </a>
            {currentUser && (
              <Link
                to="/posts/new"
                className="block px-3 py-2 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-md hover:from-blue-700 hover:to-purple-700 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                写文章
              </Link>
            )}
            
            {/* User Actions in Mobile Menu */}
            {currentUser ? (
              <div className="pt-4 border-t border-blue-700/30">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{currentUser.realName || currentUser.username}</span>
                    {currentUser.role === 'admin' && (
                      <span className="text-xs text-blue-400 flex items-center">
                        <Shield className="h-3 w-3 mr-1" />
                        管理员
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full mt-2 flex items-center justify-center px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  退出登录
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-blue-700/30 space-y-2">
                <Link
                  to="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-md hover:from-blue-700 hover:to-purple-700 transition-all text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;