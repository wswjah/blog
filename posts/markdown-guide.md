---
title: Markdown 语法演示
date: 2026-08-11
tags: [教程, Markdown]
description: 一篇演示文章，展示本博客支持的 Markdown 渲染能力，包括标题、代码块、表格、列表与引用等。
---

这篇文章用来演示本博客所支持的 Markdown 渲染能力。

## 标题层级

从 `#` 到 `######`，表示不同层级的标题：

### 三级标题

#### 四级标题

## 文本样式

**加粗**、*斜体*、~~删除线~~、`行内代码`，以及[超链接](https://example.com)。

## 列表

无序列表：

- 第一项
- 第二项
  - 嵌套子项
  - 另一个子项
- 第三项

有序列表：

1. 打开编辑器
2. 写点东西
3. 保存并发布

## 引用

> 生活不止眼前的苟且，还有诗和远方的田野。
>
> 以及下一行引用。

## 代码块

行内代码：`const answer = 42;`

带语言高亮的代码块：

```javascript
function greet(name) {
  console.log(`你好，${name}！`);
}

greet('世界');
```

```python
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

print(fibonacci(10))
```

```bash
npm install
npm run start
```

## 数学公式

使用 `$...$` 写行内公式，使用 `$$...$$` 写独占一行的公式：

行内公式：一个数向上取整到 10 的倍数，写作 $\lceil \frac{t}{10} \rceil \times 10$。

勾股定理：$c = \pm\sqrt{a^2 + b^2}$。

求和公式：$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$。

块级公式：

$$
\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}
$$

$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
$$

## 表格

| 特性 | 是否支持 | 说明 |
| --- | --- | --- |
| Markdown | 是 | 服务端渲染 |
| 代码高亮 | 是 | highlight.js |
| 数学公式 | 是 | KaTeX |
| 标签 | 是 | 首页筛选 |

## 分隔线

---

以上就是本博客支持的常见 Markdown 语法。
