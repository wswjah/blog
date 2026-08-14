'use strict';

const path = require('path');
const fs = require('fs');
const express = require('express');
const matter = require('gray-matter');
const { Marked } = require('marked');
const { markedHighlight } = require('marked-highlight');
const markedKatex = require('marked-katex-extension');
const hljs = require('highlight.js');

const app = express();
const PORT = process.env.PORT || 9527;

const PUBLIC_DIR = path.join(__dirname, 'public');
const POSTS_DIR = path.join(__dirname, 'posts');

// Ensure the posts directory exists so the server never crashes on an empty blog.
if (!fs.existsSync(POSTS_DIR)) {
  fs.mkdirSync(POSTS_DIR, { recursive: true });
}

// Markdown renderer with syntax highlighting and LaTeX math (KaTeX).
const marked = new Marked();

marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = lang && hljs.getLanguage(lang) ? lang : null;
      try {
        return language
          ? hljs.highlight(code, { language }).value
          : hljs.highlightAuto(code).value;
      } catch {
        return code;
      }
    },
  })
);

// `nonStandard` allows compact delimiters like `$x$` without surrounding spaces;
// `throwOnError: false` renders invalid LaTeX as-is instead of crashing the page.
marked.use(
  markedKatex({
    throwOnError: false,
    nonStandard: true,
  })
);

function slugFromFileName(fileName) {
  return fileName.replace(/\.md$/, '');
}

function normalizeDate(value) {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
  }
  return null;
}

function buildExcerpt(markdown, maxLength = 160) {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, ' ') // drop fenced code blocks
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // drop images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links -> text
    .replace(/[#>*`_~\-|]/g, '') // strip markdown punctuation
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > maxLength ? `${plain.slice(0, maxLength).trimEnd()}…` : plain;
}

function readPost(fileName) {
  const raw = fs.readFileSync(path.join(POSTS_DIR, fileName), 'utf8');
  const { data, content } = matter(raw);
  const slug = slugFromFileName(fileName);
  const title = data.title || slug;

  return {
    slug,
    title,
    date: normalizeDate(data.date),
    tags: Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [],
    description: data.description || buildExcerpt(content),
    content,
    html: marked.parse(content),
  };
}

function listPosts() {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith('.md'))
    .map(readPost)
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

function getPost(slug) {
  // Restrict slugs to a safe character set to prevent path traversal.
  if (!/^[A-Za-z0-9_-]+$/.test(slug)) return null;
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return readPost(`${slug}.md`);
}

// --- API ---

app.get('/api/posts', (req, res) => {
  const posts = listPosts().map(({ slug, title, date, tags, description }) => ({
    slug,
    title,
    date,
    tags,
    description,
  }));
  res.json(posts);
});

app.get('/api/posts/:slug', (req, res) => {
  const post = getPost(req.params.slug);
  if (!post) return res.status(404).json({ error: '文章不存在' });
  res.json(post);
});

app.get('/9e8825c4b696dec18a4f7d41cf3118bd.txt', (req, res) => {
  res.type('text/plain').send('536ccf00837755aa4dfcdb9785fe24f453de9df6');
});

// --- Static frontend ---

app.use(express.static(PUBLIC_DIR));

// Fallback so any non-API route (including a page refresh on a client route)
// lands on the single-page app.
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`博客已启动: http://localhost:${PORT}`);
});
