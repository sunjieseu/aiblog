# AI技术博客

一个基于React、Vite和Firebase构建的AI技术博客系统。

## 功能特性

- ✅ 用户认证（登录/注册）
- ✅ 文章管理（创建/编辑/查看）
- ✅ 图片上传功能
- ✅ 响应式设计
- ✅ 支持部署到Gitee Pages

## 技术栈

- **前端框架**: React 19
- **构建工具**: Vite 7
- **路由管理**: React Router 7
- **样式框架**: Tailwind CSS 4
- **后端服务**: Firebase (认证、数据库、存储)

## 快速开始

### 安装依赖

```bash
npm install
```

### 配置Firebase

1. 访问 [Firebase控制台](https://console.firebase.google.com/) 创建一个新的Firebase项目
2. 启用以下服务：
   - Authentication (邮箱/密码认证)
   - Firestore Database
   - Storage
3. 复制项目的配置信息
4. 修改 `src/services/firebase.js` 文件，替换占位符为实际的Firebase配置

```javascript
// Firebase配置
const firebaseConfig = {
  apiKey: "你的API密钥",
  authDomain: "你的认证域名",
  projectId: "你的项目ID",
  storageBucket: "你的存储桶",
  messagingSenderId: "你的消息发送者ID",
  appId: "你的应用ID"
};
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173/gitee_io/ 查看应用

## 部署到Gitee Pages

### 构建项目

```bash
npm run build
```

### 部署到Gitee Pages

1. 将 `dist` 目录中的所有文件推送到Gitee仓库的 `gh-pages` 分支
2. 在Gitee仓库设置中启用Pages服务，选择 `gh-pages` 分支
3. 等待部署完成后，访问Gitee Pages URL

## 项目结构

```
src/
├── components/          # 组件目录
│   ├── Auth/           # 认证相关组件
│   ├── Blog/           # 博客相关组件
│   ├── Layout/         # 布局组件
│   ├── Pages/          # 页面组件
│   └── SEO/            # SEO组件
├── contexts/           # 上下文目录
│   └── AuthContext.jsx # 认证上下文
├── services/           # 服务目录
│   ├── firebase.js     # Firebase配置
│   └── postService.js  # 帖子服务
├── App.jsx             # 应用根组件
└── main.jsx            # 应用入口
```

## 注意事项

1. **Firebase配置**: 必须配置正确的Firebase项目信息才能使用完整功能
2. **Node.js版本**: 建议使用Node.js 20.19+或22.12+版本
3. **认证功能**: 用户需要先注册登录才能创建和编辑文章
4. **图片上传**: 需要在Firebase Storage中设置正确的安全规则

## License

MIT