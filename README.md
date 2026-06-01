# AETHER Digital Twin

<div align="center">
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.2-purple?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind-4.1-blue?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-2.103-green?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
</div>

<p align="center">
  <strong>AETHER</strong> 是一个融合科技美学与交互创新的数字孪生体验平台，通过 WebGL 着色器动画、GSAP 滚动驱动叙事和 AI 对话系统，打造沉浸式的「暖科技」美学体验。
</p>

---

## 核心特性

### 1. 智能 AI 对话系统
- **Google Gemini 集成**：基于 Gemini 2.0 Flash 模型，支持多语言对话
- **Markdown 渲染**：AI 回复支持完整的 Markdown 格式，包括代码高亮
- **打字机效果**：流式文字输出动画，增强对话沉浸感
- **情感系统**：AI 拥有 8 种情感状态，随对话上下文动态切换

### 2. WebGL 着色器动画
- **Fragment Shader**：基于 GLSL 的动态粒子背景，响应鼠标移动
- **性能优化**：自适应分辨率，移动端自动降级
- **视觉融合**：光晕、高斯模糊与渐变的有机组合

### 3. GSAP 滚动叙事
- **ScrollTrigger**：滚动驱动的分步动画系统
- **移动端适配**：使用 `gsap.matchMedia` 实现响应式动画
- **Core Evolution**：首页核心进化模块的三段式分裂动画

### 4. 留言板系统
- **Supabase 后端**：实时数据库存储，支持持久化
- **SWR 缓存策略**：本地 localStorage 缓存 + 后台静默更新
- **超时处理**：8 秒超时机制，优雅降级体验
- **骨架屏**：感知性能优化，减少用户焦虑

### 5. 设计哲��页面
- **The Visionary**：设计师形象展示，模糊到清晰的揭幕动画
- **SVG 签名**：交互式手写签名动画
- **Shader Terminal**：隐藏的 WebGL 着色器代码展示

### 6. 登录与用户系统
- **多平台登录**：Google / GitHub / 微信（预留）
- **头像上传**：支持本地图片上传预览
- **QR 码登录**：微信登录二维码界面（带安全提示）

---

## 技术栈

| 类别 | 技术 | 用途 |
|------|------|------|
| **前端框架** | React 19 + TypeScript 5.8 | 组件化开发，类型安全 |
| **构建工具** | Vite 6.2 | 快速热更新，ESM 支持 |
| **样式系统** | Tailwind CSS 4.1 + clsx + tailwind-merge | 原子化 CSS，条件样式 |
| **动画引擎** | GSAP 3.14 + Motion (Framer Motion) | 复杂动画 + React 动画 |
| **AI 模型** | Google Gemini 2.0 Flash | 多模态 AI 对话 |
| **数据库** | Supabase (PostgreSQL) | 实时数据存储 |
| **图表** | Chart.js + react-chartjs-2 | 数据可视化 |
| **路由** | React Router DOM 7 | 单页应用路由 |
| **国际化** | i18next + react-i18next | 多语言支持 |
| **图标** | Lucide React | 轻量级图标库 |

---

## 项目结构

```
aether-digital-twin/
├── public/
│   ├── fonts/                    # 自定义字体文件
│   │   ├── SpaceGrotesk-Bold.woff2
│   │   └── SpaceGrotesk-Regular.woff2
│   └── AETHER.gif               # 品牌动图
├── src/
│   ├── components/
│   │   ├── AIChat.tsx           # AI 对话组件
│   │   ├── AIBackground.tsx     # WebGL 着色器背景
│   │   ├── CoreEvolution.tsx    # 核心进化滚动动画
│   │   ├── Header.tsx           # 导航头
│   │   ├── Sidebar.tsx          # 侧边栏导航
│   │   ├── StatsChart.tsx       # 数据图表
│   │   └── ThemeToggle.tsx      # 主题切换
│   ├── pages/
│   │   ├── Home.tsx             # 首页
│   │   ├── About.tsx            # 关于页
│   │   ├── DesignBrief.tsx      # 设计哲��页
│   │   ├── Guestbook.tsx        # 留言板
│   │   ├── Login.tsx            # 登录页
│   │   └── NotFound.tsx         # 404 页
│   ├── i18n/                    # 国际化配置
│   ├── App.tsx                  # 根组件
│   ├── main.tsx                 # 入口文件
│   └── index.css                # 全局样式
├── server/                      # 后端服务（可选）
├── index.html                   # HTML 模板
├── vite.config.ts               # Vite 配置
├── tailwind.config.js           # Tailwind 配置
├── tsconfig.json                # TypeScript 配置
└── package.json                 # 依赖管理
```

---

## 快速开始

### 前置要求

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 或 **yarn** >= 1.22.0
- **Google Gemini API Key**（用于 AI 对话功能）
- **Supabase 项目**（用于留言板功能）

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/YOUR_USERNAME/aether-digital-twin.git
   cd aether-digital-twin
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   
   创建 `.env.local` 文件：
   ```env
   # Google Gemini API
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Supabase 配置（用于留言板）
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```
   
   访问 `http://localhost:3000` 查看应用。

### 其他命令

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint

# 清理构建目录
npm run clean
```

---

## 环境变量配置

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `GEMINI_API_KEY` | Google Gemini API 密钥 | ✅ |
| `VITE_SUPABASE_URL` | Supabase 项目 URL | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | ✅ |

### 获取 API 密钥

**Google Gemini API**
1. 访问 [Google AI Studio](https://aistudio.google.com/)
2. 创建新项目并生成 API Key
3. 将密钥添加到 `.env.local`

**Supabase**
1. 访问 [Supabase](https://supabase.com/) 并创建项目
2. 在 Settings > API 中获取 URL 和 anon key
3. 创建 `messages` 表用于留言板功能

---

## 部署

### Vercel 部署（推荐）

1. **连接 GitHub 仓库**
   - 登录 [Vercel](https://vercel.com/)
   - 点击 "New Project" 导入 GitHub 仓库

2. **配置环境变量**
   - 在 Vercel 项目设置中添加上述环境变量

3. **自动部署**
   - 推送到 `main` 分支自动触发部署

### 其他平台

项目支持任何支持 Vite 构建的平台：

- **Netlify**：拖拽 `dist` 文件夹或连接 Git
- **Cloudflare Pages**：使用 `npm run build` 命令
- **GitHub Pages**：需配置 `base` 路径（见下方说明）

---

## 设计理念

### 暖科技美学 (Warm-Tech Aesthetics)

AETHER 的设计哲学是将冰冷的技术转化为温暖的体验：

- **有机形态**：使用曲线、渐变和模糊效果，避免生硬的直角
- **光影呼吸**：动态粒子和光晕效果，模拟自然光的变化
- **情感共鸣**：通过动画节奏和交互反馈建立情感连接

### 设计原则

1. **渐进式披露**：信息分层次展现，避免一次性过载
2. **响应式优先**：移动端优先设计，桌面端增强体验
3. **性能感知**：骨架屏和过渡动画减少等待焦虑
4. **无障碍考虑**：高对比度、键盘导航支持

### 色彩系统

```css
--primary: #6366f1     /* 主色调：靛蓝 */
--secondary: #8b5cf6   /* 辅助色：紫色 */
--accent: #ec4899      /* 强调色：粉色 */
--dark: #0f172a        /* 深色背景 */
--light: #f8fafc       /* 浅色背景 */
```

---

## 组件说明

### AIChat 组件

```tsx
<AIChat />
```

智能对话组件，集成 Google Gemini API。支持：
- 多轮对话上下文
- Markdown 格式渲染
- 打字机动画效果
- 情感状态切换

### CoreEvolution 组件

```tsx
<CoreEvolution />
```

首页核心进化模块，展示三个核心理念：
- **机械灵魂**：数字世界的核心驱动力
- **漆面生长**：界面的有机演化过程
- **空间声场**：多维度的感官体验

桌面端使用 GSAP ScrollTrigger 实现分裂动画，移动端切换为静态布局。

### AIBackground 组件

```tsx
<AIBackground />
```

基于 WebGL 的动态背景，使用 Fragment Shader 实现：
- 流动的粒子效果
- 鼠标交互响应
- 自适应性能优化

---

## 性能优化

### 已实施的优化策略

1. **代码分割**：使用 React.lazy 和 Suspense 实现路由级代码分割
2. **图片优化**：WebP 格式 + 懒加载
3. **字体加载**：使用 `font-display: swap` 避免布局偏移
4. **动画优化**：GPU 加速 + `will-change` 提示
5. **数据缓存**：localStorage SWR 策略减少网络请求

### 性能监控

```bash
# 构建分析
npm run build -- --analyze

# Lighthouse 检测
npx lighthouse http://localhost:3000 --view
```

---

## 浏览器支持

| 浏览器 | 版本 | 支持状态 |
|--------|------|----------|
| Chrome | >= 90 | ✅ 完全支持 |
| Firefox | >= 88 | ✅ 完全支持 |
| Safari | >= 14 | ✅ 完全支持 |
| Edge | >= 90 | ✅ 完全支持 |
| IE | - | ❌ 不支持 |

---

## 常见问题

### Q: 如何获取 Google Gemini API Key？

访问 [Google AI Studio](https://aistudio.google.com/)，登录 Google 账号后即可创建 API Key。免费额度足以满足开发和测试需求。

### Q: 留言板在国内访问很慢怎么办？

项目已内置 SWR 缓存策略：
- 首次加载后数据会缓存到 localStorage
- 后续访问会立即显示缓存数据
- 8 秒超时后会显示友好提示

### Q: 如何自定义主题颜色？

修改 `src/index.css` 中的 CSS 变量：

```css
:root {
  --primary: #your-color;
  --secondary: #your-color;
  /* ... */
}
```

### Q: 移动端动画卡顿怎么办？

项目已针对移动端优化：
- CoreEvolution 组件在移动端禁用复杂动画
- WebGL 背景自动降低分辨率
- 使用 `prefers-reduced-motion` 媒体查询

---

## 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -m 'feat: add your feature'`
4. 推送分支：`git push origin feature/your-feature`
5. 提交 Pull Request

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint + Prettier 配置
- 组件使用函数式组件 + Hooks
- 样式使用 Tailwind CSS 原子类

---

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

## 联系方式

- **项目主页**：[AETHER Digital Twin](https://aether-digital-twin.vercel.app)
- **问题反馈**：[GitHub Issues](https://github.com/YOUR_USERNAME/aether-digital-twin/issues)
- **邮箱**：your-email@example.com

---

<p align="center">
  <strong>AETHER</strong> - 温暖科技，连接未来
</p>
