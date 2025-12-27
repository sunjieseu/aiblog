# AI技术博客 - 基于大模型的应用开发

这是一个基于React和Firebase的技术博客网站，专注于大模型应用开发（如RAG系统、领域精准回答服务等）的技术分享。该网站支持用户注册、发布图文博客，并可以部署到Gitee Pages上以获得百度收录。

## 技术栈

- **前端**: React 19 + Vite + Tailwind CSS + React Router
- **后端**: Firebase (Authentication + Firestore + Storage)
- **部署**: Gitee Pages
- **SEO**: 针对百度收录优化的Meta标签和Open Graph协议

## 功能特性

- ✅ 用户注册和登录功能
- ✅ 博客文章的增、删、改、查
- ✅ 支持图文混排的博客内容
- ✅ 响应式设计，适配各种设备
- ✅ 针对百度收录的SEO优化
- ✅ 可以轻松部署到Gitee Pages

## 本地开发

### 1. 安装依赖

```bash
npm install
```

### 2. 配置Firebase

在`src/services/firebase.js`文件中配置你的Firebase项目信息：

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173/ 查看项目

## 部署到Gitee Pages

### 1. 准备工作

- 确保你有一个Gitee账号（sunjieLLM）
- 创建一个名为`gitee_io`的仓库

### 2. 配置项目

项目已经配置好以下内容：

- `vite.config.js`中添加了`base: '/gitee_io/'`
- 已安装所需依赖
- 已修复Tailwind CSS v4的PostCSS插件配置

### 3. 构建项目

```bash
npm run build
```

这将生成`dist`目录，包含可部署的生产版本文件。

### 4. 部署到Gitee

#### 方法一：手动部署

1. 在Gitee上创建一个名为`gitee_io`的仓库
2. 将`dist`目录的内容上传到仓库的`master`或`main`分支
3. 进入仓库的「服务」->「Gitee Pages」
4. 选择分支为`master`或`main`，目录为根目录
5. 点击「启动服务」

#### 方法二：使用Git自动部署

```bash
# 初始化Git仓库（如果尚未初始化）
git init

# 添加远程仓库
git remote add origin https://gitee.com/sunjieLLM/gitee_io.git

# 提交代码
git add .
git commit -m "Initial commit"

# 推送代码到Gitee
git push -u origin master
```

然后按照上述「手动部署」的步骤3-5配置Gitee Pages。

### 5. 验证部署

部署成功后，你可以通过以下地址访问你的网站：
```
https://sunjiellm.gitee.io/gitee_io/
```

## 百度收录优化

### 1. 站点验证

1. 登录百度搜索资源平台
2. 添加你的网站 https://sunjiellm.gitee.io/gitee_io/
3. 获取站点验证代码
4. 在`index.html`和`src/components/SEO/MetaTags.jsx`中替换`YOUR_BAIDU_SITE_VERIFICATION_CODE`为你的验证代码

### 2. 提交sitemap

1. 创建一个`sitemap.xml`文件（可以使用在线工具生成）
2. 将其放置在`public`目录下
3. 在百度搜索资源平台提交该sitemap

### 3. 其他优化

- 确保每个页面都有独特的标题和描述
- 使用语义化的HTML标签
- 优化图片大小和alt属性
- 确保网站加载速度快

## 项目结构

```
src/
├── components/           # 组件目录
│   ├── Auth/            # 认证相关组件（登录、注册）
│   ├── Blog/            # 博客相关组件（列表、详情、创建、编辑）
│   ├── Layout/          # 布局组件（导航栏、页脚）
│   ├── Pages/           # 页面组件（首页）
│   └── SEO/             # SEO相关组件
├── contexts/            # React Context（认证状态管理）
├── services/            # 服务层（Firebase配置、博客服务）
├── App.jsx              # 应用入口组件
└── main.jsx             # React渲染入口
```

## 许可证

MIT

## 联系方式

如果你有任何问题或建议，欢迎通过Gitee联系我：[sunjieLLM](https://gitee.com/sunjieLLM)
