# Design System - 基于现代极简主义风格

> 参考现代极简主义设计原则，创建清晰、简洁、功能性的用户界面设计系统

## 设计原则

### 核心理念
- **Less is More**: 去除不必要的元素，专注于核心功能
- **功能优先**: 形式服务于功能，确保每个元素都有明确目的
- **认知负荷最小化**: 简化用户决策过程，提供清晰的视觉层次
- **一致性**: 在所有界面中保持统一的设计语言

## 色彩系统 (Color Palette)

### 主色调 (Primary Colors)
```css
/* 中性色系 - 主要用于文本和背景 */
--color-white: #ffffff;           /* 纯白背景 */
--color-gray-50: #f8fafc;         /* 极浅灰 */
--color-gray-100: #f1f5f9;        /* 浅灰背景 */
--color-gray-200: #e2e8f0;        /* 边框色 */
--color-gray-300: #cbd5e1;        /* 分割线 */
--color-gray-400: #94a3b8;        /* 占位符文本 */
--color-gray-500: #64748b;        /* 次要文本 */
--color-gray-600: #475569;        /* 常规文本 */
--color-gray-700: #334155;        /* 重要文本 */
--color-gray-800: #1e293b;        /* 标题文本 */
--color-gray-900: #0f172a;        /* 主要文本 */
```

### 功能色彩 (Functional Colors)
```css
/* 主要操作色 */
--color-primary: #0f172a;         /* 主要按钮、链接 */
--color-primary-light: #334155;   /* 悬停状态 */

/* 状态色彩 */
--color-success: #10b981;         /* 成功状态 */
--color-success-light: #d1fae5;   /* 成功背景 */
--color-warning: #f59e0b;         /* 警告状态 */
--color-warning-light: #fef3c7;   /* 警告背景 */
--color-error: #ef4444;           /* 错误状态 */
--color-error-light: #fee2e2;     /* 错误背景 */
--color-info: #3b82f6;            /* 信息状态 */
--color-info-light: #dbeafe;      /* 信息背景 */
```

## 字体系统 (Typography)

### 字体族 (Font Family)
```css
/* 主要字体 - Inter (现代、清晰、易读) */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;

/* 等宽字体 - 用于代码显示 */
--font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
```

### 字体尺寸 (Font Sizes)
```css
--text-xs: 0.75rem;     /* 12px - 标签、说明文字 */
--text-sm: 0.875rem;    /* 14px - 次要文本 */
--text-base: 1rem;      /* 16px - 正文文本 */
--text-lg: 1.125rem;    /* 18px - 重要文本 */
--text-xl: 1.25rem;     /* 20px - 小标题 */
--text-2xl: 1.5rem;     /* 24px - 中标题 */
--text-3xl: 1.875rem;   /* 30px - 大标题 */
--text-4xl: 2.25rem;    /* 36px - 主标题 */
--text-5xl: 3rem;       /* 48px - 超大标题 */
```

### 字体权重 (Font Weights)
```css
--font-light: 300;      /* 轻量 - 大标题 */
--font-normal: 400;     /* 常规 - 正文 */
--font-medium: 500;     /* 中等 - 强调文本 */
--font-semibold: 600;   /* 半粗 - 小标题 */
--font-bold: 700;       /* 粗体 - 重要标题 */
```

### 行高 (Line Heights)
```css
--leading-tight: 1.25;   /* 紧密 - 标题 */
--leading-normal: 1.5;   /* 常规 - 正文 */
--leading-relaxed: 1.75; /* 宽松 - 长文本 */
```

## 间距系统 (Spacing)

### 基础间距单位
```css
/* 基于 4px 网格系统 */
--space-0: 0;           /* 0px */
--space-1: 0.25rem;     /* 4px */
--space-2: 0.5rem;      /* 8px */
--space-3: 0.75rem;     /* 12px */
--space-4: 1rem;        /* 16px */
--space-5: 1.25rem;     /* 20px */
--space-6: 1.5rem;      /* 24px */
--space-8: 2rem;        /* 32px */
--space-10: 2.5rem;     /* 40px */
--space-12: 3rem;       /* 48px */
--space-16: 4rem;       /* 64px */
--space-20: 5rem;       /* 80px */
--space-24: 6rem;       /* 96px */
--space-32: 8rem;       /* 128px */
```

### 语义化间距
```css
/* 组件内部间距 */
--padding-xs: var(--space-2);    /* 8px */
--padding-sm: var(--space-3);    /* 12px */
--padding-md: var(--space-4);    /* 16px */
--padding-lg: var(--space-6);    /* 24px */
--padding-xl: var(--space-8);    /* 32px */

/* 组件外部间距 */
--margin-xs: var(--space-2);     /* 8px */
--margin-sm: var(--space-4);     /* 16px */
--margin-md: var(--space-6);     /* 24px */
--margin-lg: var(--space-8);     /* 32px */
--margin-xl: var(--space-12);    /* 48px */
```

## 圆角系统 (Border Radius)

```css
--radius-none: 0;           /* 无圆角 */
--radius-sm: 0.25rem;       /* 4px - 小元素 */
--radius-md: 0.5rem;        /* 8px - 按钮、输入框 */
--radius-lg: 0.75rem;       /* 12px - 卡片 */
--radius-xl: 1rem;          /* 16px - 大卡片 */
--radius-2xl: 1.5rem;       /* 24px - 特殊容器 */
--radius-full: 9999px;      /* 完全圆形 - 徽章、头像 */
```

## 阴影系统 (Shadows)

```css
/* 层次阴影 - 用于创建深度感 */
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

/* 特殊阴影 */
--shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
--shadow-none: none;
```

## 响应式断点 (Breakpoints)

```css
/* 移动优先的响应式设计 */
--breakpoint-sm: 640px;     /* 小屏幕 (手机横屏) */
--breakpoint-md: 768px;     /* 中等屏幕 (平板) */
--breakpoint-lg: 1024px;    /* 大屏幕 (桌面) */
--breakpoint-xl: 1280px;    /* 超大屏幕 (大桌面) */
--breakpoint-2xl: 1536px;   /* 超宽屏幕 */
```

## 组件规范

### Button 按钮

#### 尺寸规格
- **Small**: padding: 8px 16px, font-size: 14px, height: 32px
- **Medium**: padding: 12px 24px, font-size: 16px, height: 40px
- **Large**: padding: 16px 32px, font-size: 18px, height: 48px

#### 样式变体
- **Primary**: 主要操作，深色背景，白色文字
- **Secondary**: 次要操作，浅色背景，深色文字
- **Outline**: 边框按钮，透明背景，有边框
- **Ghost**: 幽灵按钮，透明背景，无边框

### Card 卡片

#### 基础规格
- **Padding**: 24px (内容区域)
- **Border Radius**: 12px
- **Background**: 白色
- **Border**: 1px solid gray-200
- **Shadow**: shadow-sm (默认), shadow-md (悬停)

#### 组成部分
- **Header**: 标题区域，padding-bottom: 16px
- **Body**: 主要内容区域
- **Footer**: 底部操作区域，padding-top: 16px

### Badge 徽章

#### 尺寸规格
- **Small**: padding: 2px 8px, font-size: 12px
- **Medium**: padding: 4px 12px, font-size: 14px

#### 样式变体
- **Success**: 绿色系，表示成功状态
- **Warning**: 黄色系，表示警告状态
- **Error**: 红色系，表示错误状态
- **Info**: 蓝色系，表示信息状态
- **Neutral**: 灰色系，表示中性状态

### Input 输入框

#### 基础规格
- **Height**: 40px (medium), 32px (small), 48px (large)
- **Padding**: 12px 16px
- **Border**: 1px solid gray-300
- **Border Radius**: 8px
- **Font Size**: 16px

#### 状态样式
- **Default**: 默认状态
- **Focus**: 聚焦状态，蓝色边框，外发光
- **Error**: 错误状态，红色边框
- **Disabled**: 禁用状态，灰色背景

### Navbar 导航栏

#### 基础规格
- **Height**: 64px
- **Padding**: 0 24px
- **Background**: 白色，带轻微透明度
- **Backdrop Filter**: 毛玻璃效果
- **Border Bottom**: 1px solid gray-200

#### 响应式行为
- **Desktop**: 水平布局，显示所有导航项
- **Mobile**: 汉堡菜单，折叠导航项

### Skeleton 骨架屏

#### 基础规格
- **Background**: gray-200
- **Animation**: 脉冲动画，1.5s 循环
- **Border Radius**: 继承容器圆角

#### 常用尺寸
- **Text Line**: height: 16px, width: 100%
- **Title**: height: 24px, width: 60%
- **Avatar**: width: 40px, height: 40px, border-radius: 50%
- **Button**: height: 40px, width: 120px

## 动画与过渡

### 过渡时长
```css
--duration-fast: 150ms;     /* 快速交互 */
--duration-normal: 300ms;   /* 常规过渡 */
--duration-slow: 500ms;     /* 慢速动画 */
```

### 缓动函数
```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

## 可访问性指南

### 颜色对比度
- **正文文本**: 最小对比度 4.5:1
- **大文本**: 最小对比度 3:1
- **非文本元素**: 最小对比度 3:1

### 焦点状态
- 所有交互元素必须有清晰的焦点指示
- 焦点环使用 2px 蓝色边框，4px 偏移

### 语义化标记
- 使用正确的 HTML 语义标签
- 为图像提供 alt 文本
- 为表单元素提供标签

## 实施指南

### Tailwind CSS 配置
所有设计令牌将在 `tailwind.config.js` 中定义，确保设计系统的一致性。

### 组件库
创建可复用的 React 组件，每个组件都遵循设计系统规范。

### 文档维护
设计系统是活文档，需要随着产品发展持续更新和完善。