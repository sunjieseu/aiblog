import React from 'react';
import { Brain, Github, Twitter, Linkedin, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-gray-300 border-t border-blue-700/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white">AI技术博客</span>
            </div>
            <p className="text-sm text-blue-200 mb-4">
              专注于大模型应用开发技术，探索人工智能+的创新应用，与开发者社区共同成长
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-400 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-400 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-400 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm text-blue-200 hover:text-blue-400 transition-colors">
                  首页
                </a>
              </li>
              <li>
                <a href="/posts" className="text-sm text-blue-200 hover:text-blue-400 transition-colors">
                  文章列表
                </a>
              </li>
              <li>
                <a href="/posts/new" className="text-sm text-blue-200 hover:text-blue-400 transition-colors">
                  写文章
                </a>
              </li>
              <li>
                <a
                  href="https://www.cnieco.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-200 hover:text-purple-400 transition-colors"
                >
                  技术团队
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">联系我们</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <Mail className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:jie.sun@njxzc.edu.cn"
                  className="text-sm text-blue-200 hover:text-blue-400 transition-colors"
                >
                  jie.sun@njxzc.edu.cn
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <a
                  href="http://sunjieseu.github.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-200 hover:text-blue-400 transition-colors"
                >
                  LLM应用开发实验室
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-white font-semibold mb-4">关于我们</h3>
            <p className="text-sm text-blue-200 mb-4">
              我们致力于分享大模型应用开发的最新技术和实践经验，帮助开发者快速掌握AI应用开发技能。
            </p>
            <div className="flex items-center space-x-2 text-sm text-blue-300">
              <Brain className="h-4 w-4" />
              <span>AI驱动 · 智能创新</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-700/30 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-blue-200 text-center md:text-left">
              © {new Date().getFullYear()} AI技术博客. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-blue-200 hover:text-blue-400 transition-colors">
                隐私政策
              </a>
              <a href="#" className="text-sm text-blue-200 hover:text-blue-400 transition-colors">
                服务条款
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;