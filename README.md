# 拾光集 · 个人博客

一个简洁、清晰的个人博客。后端 Node.js + Express，前端原生 HTML / CSS / JS 三件套，无框架、无构建步骤。

支持 Markdown 渲染、代码语法高亮与 LaTeX 数学公式。

## 特性

- **Markdown 渲染**：`marked` 服务端渲染，文章以 `.md` 文件形式存放
- **代码高亮**：`highlight.js`，支持带语言标注的代码块
- **数学公式**：KaTeX，支持行内 `$...$` 与块级 `$$...$$`
- **标签筛选**：首页按标签过滤文章，自动计数
- **Frontmatter 元信息**：标题、日期、标签、摘要
- **响应式设计**：移动端与桌面端自适应，适度动画，尊重 `prefers-reduced-motion`
- **零前端依赖**：纯 HTML + CSS + 原生 JS，hash 路由（`#/` 与 `#/post/:slug`）

## 快速开始

```bash
npm install
npm start          # 或 npm run dev（文件变更自动重启）
```

启动后访问 <http://localhost:9527>。

## 发布文章

在 `posts/` 目录下新建一个 `.md` 文件，顶部写 frontmatter：

```markdown
---
title: 文章标题
date: 2026-08-12
tags: [标签一, 标签二]
description: 一句话简介，会显示在首页列表里（可选，不写则自动截取正文开头）。
---

正文就是普通的 Markdown。
```

文件名（不含 `.md` 后缀）即文章的地址标识（slug）。保存后刷新页面即可看到。

支持行内公式 `$c = \pm\sqrt{a^2 + b^2}$` 和块级公式：

```markdown
$$
\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}
$$
```

## 目录结构

```
blog/
├── server.js              # Node.js + Express 后端
├── posts/                 # Markdown 文章目录
│   ├── hello-world.md
│   ├── markdown-guide.md
│   └── how-to-publish.md
└── public/
    ├── index.html         # 单页应用外壳
    ├── css/
    │   ├── style.css      # 全部样式
    │   ├── highlight.css  # 代码高亮主题
    │   └── katex.min.css  # KaTeX 数学公式样式（含字体）
    └── js/
        └── main.js        # 路由 + 拉取 + 渲染
```

## 后端 API

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/posts` | 文章列表（按日期倒序，含标题、日期、标签、摘要） |
| GET | `/api/posts/:slug` | 单篇文章（含服务端渲染后的 `html`） |

## 配置

- **端口**：`server.js` 中的 `PORT`（默认 `9527`）
- **站名与标语**：`public/index.html` 中的 `.site-title` 与 `.site-tagline`
- **数学公式兼容性**：`server.js` 中 KaTeX 的 `nonStandard` 选项。开启时允许 `$` 前后不带空格；若文章中出现美元金额等成对 `$` 会被误判为公式，可改为 `nonStandard: false`。

## 技术栈

- Node.js + Express
- marked / gray-matter / highlight.js / KaTeX
- 原生 HTML + CSS + JavaScript

## License

MIT
