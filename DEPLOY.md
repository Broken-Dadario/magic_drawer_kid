# 魔法单词本 - Netlify 部署指南

## 项目说明

这是一个儿童英语学习应用，可以让孩子画画，然后通过AI将绘画转化为精美的插画。

## 部署步骤

### 1. 准备工作

确保你有：
- Netlify 账号（免费）：https://www.netlify.com/
- Google Gemini API Key（你已经有了）：`AIzaSyDuBU_6QZnRVVnN0cNBTOatX-w0-9j6AIo`

### 2. 部署到 Netlify

#### 方式一：通过 Git 部署（推荐）

1. **将项目推送到 GitHub/GitLab**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <你的仓库地址>
   git push -u origin main
   ```

2. **在 Netlify 创建新站点**
   - 登录 Netlify
   - 点击 "Add new site" → "Import an existing project"
   - 选择你的 Git 仓库
   - Netlify 会自动识别 `netlify.toml` 配置
   - 点击 "Deploy site"

#### 方式二：手动部署

1. **打包项目文件**
   - 将整个项目文件夹压缩成 ZIP

2. **在 Netlify 手动上传**
   - 登录 Netlify
   - 点击 "Add new site" → "Deploy manually"
   - 拖拽 ZIP 文件上传

### 3. 配置环境变量（重要！）

部署完成后，必须配置 API Key：

1. 进入你的站点设置
2. 点击左侧菜单 "Site configuration" → "Environment variables"
3. 点击 "Add a variable"
4. 添加以下环境变量：
   - **Key**: `CONST_API_KEY`
   - **Value**: `AIzaSyDuBU_6QZnRVVnN0cNBTOatX-w0-9j6AIo`
5. 点击 "Save"

### 4. 重新部署

配置环境变量后，需要重新部署：
- 点击 "Deploys" 标签
- 点击 "Trigger deploy" → "Deploy site"

### 5. 测试

- 访问 Netlify 提供的网址（例如：`https://your-site-name.netlify.app`）
- 尝试画画并点击"施展魔法"按钮
- 应该能正常生成图片

## 工作原理

### 免翻墙访问原理

```
用户浏览器（中国大陆）
    ↓
Netlify CDN（全球分发，国内可访问）
    ↓
Netlify Function（美国/欧洲服务器）
    ↓
Google Gemini API（国外服务器）
```

- 用户访问的是 Netlify 的域名，在国内可以正常访问
- API 调用通过 Netlify Function 中转，由 Netlify 的服务器去调用 Google API
- 这样就绕过了直接从国内访问 Google API 的限制

### 安全性

- API Key 存储在 Netlify 的环境变量中，不会暴露给用户
- 前端代码不包含任何敏感信息
- 只有你的朋友能通过你分享的链接访问

## 项目结构

```
magic_draw/
├── magic_draw.html          # 前端页面
├── netlify.toml             # Netlify 配置
├── netlify/
│   └── functions/
│       └── generate-image.js  # 后端 API 函数
├── .env                     # 本地环境变量（不会上传）
└── DEPLOY.md               # 本文档
```

## 常见问题

### Q: 部署后提示"服务器配置错误：未找到API密钥"
A: 检查是否正确配置了环境变量 `CONST_API_KEY`，配置后需要重新部署。

### Q: 生成图片失败
A:
1. 检查浏览器控制台的错误信息
2. 检查 Netlify Functions 日志（在 Netlify 后台的 Functions 标签）
3. 确认 API Key 是否有效且有足够的配额

### Q: 如何更新项目
A:
- 如果使用 Git 部署：推送新代码到仓库，Netlify 会自动重新部署
- 如果手动部署：重新上传 ZIP 文件

### Q: 如何查看 Function 日志
A:
1. 进入 Netlify 站点后台
2. 点击 "Functions" 标签
3. 点击 "generate-image" 函数
4. 可以看到实时日志和错误信息

## 自定义域名（可选）

如果你想使用自己的域名：
1. 在 Netlify 后台点击 "Domain settings"
2. 点击 "Add custom domain"
3. 按照指引配置 DNS

## 成本说明

- **Netlify**: 免费版足够使用（每月100GB流量，300分钟构建时间）
- **Google Gemini API**: 根据使用量计费（参考 Google Cloud 定价）

## 技术支持

如有问题，可以查看：
- Netlify 文档：https://docs.netlify.com/
- Google Gemini API 文档：https://ai.google.dev/docs
