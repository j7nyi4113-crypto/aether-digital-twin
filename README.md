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

### 1. 首页 Hero 与 360 度观察模块
- **360 度车辆展示**：支持鼠标拖拽/触摸滑动，使用 8 张关键帧序列图实现平滑插值旋转
- **帧间透明度混合**：通过双层图片叠加（Crossfade）实现非关键帧的平滑过渡
- **实时角度 HUD**：悬浮的 360 度查看器界面上方实时显示当前旋转角度
- **核心状态面板**：动态数据面板展示同步率、连接状态，用户留言后触发状态变化动画

### 2. 模块 01 — 机械灵魂 (Mechanical Soul)
四大核心性能指标卡片，点击均弹出深度解析面板：

- **功率 (580 kW)**：动态数值滚动动画、Chart.js 雷达图对比（AETHER vs 竞品在功率/响应/散热/静谧性四维度）、背景视差联动聚焦电机
- **扭矩 (850 N·m)**：Chart.js 曲线图对比扭矩输出衰减、底盘半轴光效联动、移动端触觉反馈（Haptic Vibration）
- **风阻 (0.198 Cd)**：粒子系统模拟气流划过车身、交互式滑块对比传统造型与仿生设计、底盘风洞视图高亮关键气动部位
- **重量 (2,150 kg)**：自动触发的重量拆解动效（固态电池包/前后一体化压铸悬浮）、重心标记 CG 点可视化、滚动联动底盘晃动

### 3. 模块 02 — 漆面生长 (Surface Growth)
- **五色漆面流转**：背景色在曜石黑、珍珠白、赛博黄、霓虹紫、量子蓝之间自动平滑过渡
- **金属光泽模拟**：叠加渐变高光遮罩（`mix-blend-overlay`），模拟真实车漆的液态金属反光质感

### 4. 设计纲要 (Design Brief)
- **设计哲学详情**：温润科技美学五大章节完整呈现
- **The Visionary 远见者专栏**：设计师形象展示（带模糊到清晰揭幕动画）、交互式 SVG 签名、社交矩阵图标（微信/QQ/电话悬浮显示 ID）
- **实时留言系统**：基于 Supabase Realtime 的全用户留言板，支持自定义头像与昵称、仅允许删除自己的消息
- **昵称强制修改**：用户必须修改默认 "Guest" 昵称后才能发送留言，带红色边框警告动画

### 5. 全局用户系统
- **头像上传**：支持从 Navbar 头像按钮上传自定义头像，通过 FileReader 转 Base64 存储
- **昵称编辑**：下拉面板实时编辑昵称，同步更新留言板显示

### 6. 声音景观 (Acoustic)
- **音频播放/暂停**：点击声景卡片切换播放状态
- **淡入淡出效果**：音量从 0 逐级递增至 0.75 / 递减至 0（setInterval 驱动）
- **音量记忆**：默认 75% 音量

### 7. 页脚三大系统页面
- **Privacy Policy（隐私政策）**：毛玻璃弹窗 + 背景光晕动画 + 阅读进度条 + 底部悬浮同意按钮
- **System Status（系统状态）**：全屏极客风面板，Hex 16进制数据流背景，神经脉络图交互（悬停左侧模块触发右侧 3D 车身对应部位发光），心跳脉冲状态指示
- **Manual（使用手册）**：交互式热点（4 个可点击的 3D 模型热点）、搜索即所得（输入关键词自动切换对应内容）、循环动效说明（UWB 靠近/手势悬浮/动力模式/充电口等）

### 8. 智能 AI 对话系统
- **Google Gemini 集成**：基于 Gemini 2.0 Flash 模型，支持多语言对话
- **Markdown 渲染**：AI 回复支持完整的 Markdown 格式
- **打字机效果**：流式文字输出动画
- **情感系统**：8 种情感状态随对话上下文动态切换

### 9. 多语言支持 (i18n)
- **中英文切换**：全站 100+ 词条覆盖（首页、机械模块、声景、设计纲要、导航栏等）
- **动态语言切换**：无需刷新页面即可切换语言

---

## 技术栈

| 类别 | 技术 | 用途 |
|------|------|------|
| **前端框架** | React 19 + TypeScript 5.8 | 组件化开发，类型安全 |
| **构建工具** | Vite 6.2 | 快速热更新，ESM 支持 |
| **样式系统** | Tailwind CSS 4.1 + clsx + tailwind-merge | 原子化 CSS，条件样式 |
| **动画引擎** | Motion (Framer Motion) + GSAP | 复杂动画 + 滚动驱动叙事 |
| **AI 模型** | Google Gemini 2.0 Flash | 多模态 AI 对话 |
| **数据库** | Supabase (PostgreSQL) | 实时数据存储 + Realtime 订阅 |
| **图表** | Chart.js + react-chartjs-2 | 雷达图 / 曲线图数据可视化 |
| **路由** | React Router DOM 7 | 单页应用路由 |
| **国际化** | i18next + react-i18next | 多语言支持 |
| **图标** | Lucide React | 轻量级图标库 |

---

## 项目结构

```
aether-digital-twin/
├── public/
│   └── fonts/                      # 自定义字体文件
├── src/
│   ├── assets/
│   │   ├── 360/                    # 360 度观察序列帧 (0.jpg - 315.jpg)
│   │   ├── hero-bg.jpg             # 底盘/车身素材
│   │   └── visionary-avatar.jpg    # 设计师头像
│   ├── components/
│   │   ├── Navbar.tsx              # 顶部导航栏（含头像上传 + 昵称编辑）
│   │   ├── Sidebar.tsx             # 侧边栏导航
│   │   ├── Footer.tsx              # 底部导航（含 Privacy/System/Manual 三大弹窗）
│   │   ├── AIChat.tsx              # AI 对话组件
│   │   └── AIBackground.tsx        # WebGL 着色器背景
│   ├── pages/
│   │   ├── Home.tsx                # 首页（Hero + 360° Viewer + 品牌介绍 + 入口卡片）
│   │   ├── Mechanical.tsx          # 机械灵魂（功率/扭矩/风阻/重量深度弹窗）
│   │   ├── SurfaceGrowth.tsx       # 漆面生长
│   │   ├── Acoustic.tsx            # 声音景观（音频播放 + 淡入淡出）
│   │   ├── DesignBrief.tsx         # 设计纲要 + The Visionary + 留言板
│   │   ├── Login.tsx               # 登录页
│   │   └── NotFound.tsx            # 404 页面
│   ├── lib/
│   │   ├── i18n.ts                 # 国际化配置与翻译词典
│   │   ├── supabase.ts             # Supabase 客户端初始化
│   │   └── utils.ts                # 工具函数 (cn)
│   ├── App.tsx                     # 根组件与路由配置
│   ├── main.tsx                    # 入口文件
│   └── index.css                   # 全局样式与字体
├── .env                            # 环境变量（Supabase 密钥）
├── index.html                      # HTML 模板
├── vite.config.ts                  # Vite 配置
├── tsconfig.json                   # TypeScript 配置
└── package.json                    # 依赖管理
```

---

## 快速开始

### 前置要求

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Google Gemini API Key**（用于 AI 对话功能）
- **Supabase 项目**（用于实时留言板功能）

### 安装步骤

```bash
# 1. 克隆仓库
git clone https://github.com/j7nyi4113-crypto/aether-digital-twin.git
cd aether-digital-twin

# 2. 安装依赖
npm install

# 3. 配置环境变量
# 创建 .env 文件，填入以下内容：
```

```env
# Supabase 配置
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini API（用于 AI 聊天）
GEMINI_API_KEY=your_gemini_api_key
```

```bash
# 4. 启动开发服务器
npm run dev
```

访问 `http://localhost:3000` 查看应用。

### 命令参考

```bash
npm run dev       # 启动开发服务器（端口 3000）
npm run build     # 构建生产版本
npm run preview   # 预览生产构建
npm run lint      # TypeScript 类型检查
npm run clean     # 清理构建目录
```

---

## Supabase 配置

### 创建 messages 表

在 Supabase SQL Editor 中执行：

```sql
create table messages (
  id uuid default uuid_generate_v4() primary key,
  user_id text,
  nickname text,
  avatar_url text,
  text text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table messages enable row level security;

create policy "Allow public insert" on messages for insert with check (true);
create policy "Allow public select" on messages for select using (true);
create policy "Allow owner delete" on messages for delete using (auth.uid()::text = user_id);
```

### 启用 Realtime

在 Supabase Dashboard > Database > Replication 中，启用 `messages` 表的 Realtime 功能。

---

## 部署

### Vercel 部署（推荐）

1. 登录 [Vercel](https://vercel.com/)，点击 "New Project"
2. 导入 GitHub 仓库 `j7nyi4113-crypto/aether-digital-twin`
3. 配置环境变量（`VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`）
4. 构建命令：`npm run build`，输出目录：`dist`
5. 推送到 `main` 分支自动触发部署

### 其他平台

项目支持任何支持 Vite 构建的平台：Netlify、Cloudflare Pages、GitHub Pages 等。

---

## 设计理念

### 暖科技美学 (Warm-Tech Aesthetics)

AETHER 的设计哲学是将冰冷的技术转化为温暖的体验：

- **有机形态**：使用曲线、渐变和模糊效果，避免生硬的直角
- **光影呼吸**：动态粒子和光晕效果，模拟自然光的变化
- **情感共鸣**：通过动画节奏和交互反馈建立情感连接

### 色彩系统

| 色彩 | 用途 | 色值 |
|------|------|------|
| Primary | 主色调（荧光蓝） | `#00D2FF` |
| Secondary | 辅助色（紫色） | `#8B5CF6` |
| Tertiary | 强调色（青绿） | `#88ECCF` |
| Background | 深色背景 | `#0A0A0A` |
| Surface | 卡片/面板 | `#111111` |

---

## 浏览器支持

| 浏览器 | 版本 | 支持状态 |
|--------|------|----------|
| Chrome | >= 90 | ✅ 完全支持 |
| Firefox | >= 88 | ✅ 完全支持 |
| Safari | >= 14 | ✅ 完全支持 |
| Edge | >= 90 | ✅ 完全支持 |

---

## 联系方式

- **GitHub**：[j7nyi4113-crypto/aether-digital-twin](https://github.com/j7nyi4113-crypto/aether-digital-twin)
- **设计师**：Junyi Liu

---

<p align="center">
  <strong>AETHER</strong> — 科技，从未如此贴近呼吸
</p>
