'use strict';

(() => {
  const app = document.getElementById('app');
  const SITE_TITLE = '拾光集 · 个人博客';

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  let postsCache = null;
  let activeTag = null;

  /* ---------- 工具 ---------- */

  const esc = (value) =>
    String(value ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[c]));

  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  }

  // 根据标签名稳定地映射到一个淡彩样式。
  function tagClass(tag) {
    let hash = 0;
    for (let i = 0; i < tag.length; i += 1) {
      hash = (hash * 31 + tag.charCodeAt(i)) >>> 0;
    }
    return `tag-${hash % 4}`;
  }

  function tagHtml(tags) {
    if (!tags || !tags.length) return '';
    return tags.map((t) => `<span class="tag ${tagClass(t)}">${esc(t)}</span>`).join('');
  }

  async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  async function loadPosts() {
    if (postsCache) return postsCache;
    postsCache = await fetchJSON('/api/posts');
    return postsCache;
  }

  async function copyText(text) {
    // 安全上下文（HTTPS / localhost）下用 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    // 非安全上下文（如局域网 IP 访问）回退到 execCommand
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '0';
    ta.style.left = '0';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    if (!ok) throw new Error('copy failed');
  }

  function enhanceCodeBlocks(container) {
    container.querySelectorAll('.prose pre').forEach((pre) => {
      if (pre.querySelector('.copy-btn')) return;

      const code = pre.querySelector('code');
      if (!code) return;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'copy-btn';
      btn.textContent = '复制';
      btn.setAttribute('aria-label', '复制代码');

      btn.addEventListener('click', async () => {
        try {
          await copyText(code.textContent);
          btn.textContent = '已复制';
          btn.classList.add('is-copied');
        } catch {
          btn.textContent = '复制失败';
          btn.classList.add('is-error');
        }
        setTimeout(() => {
          btn.textContent = '复制';
          btn.classList.remove('is-copied', 'is-error');
        }, 1600);
      });

      pre.classList.add('has-copy');
      pre.appendChild(btn);
    });
  }

  function renderState(eyebrow, title, desc, extra = '') {
    app.innerHTML = `
      <section class="state-panel">
        <p class="eyebrow">${esc(eyebrow)}</p>
        <h1>${esc(title)}</h1>
        <p>${esc(desc)}</p>
        ${extra}
      </section>`;
  }

  function renderLoading() {
    app.innerHTML = `
      <section class="state-panel" aria-label="加载中">
        <p class="eyebrow">Loading</p>
        <h1>正在整理文章</h1>
        <p>请稍候，纸页很快铺开。</p>
      </section>`;
  }

  /* ---------- 首页 ---------- */

  async function renderHome() {
    if (!postsCache) renderLoading();

    try {
      const posts = await loadPosts();

      if (!posts.length) {
        renderState(
          'Empty',
          '暂无文章',
          '还没有发布任何文章，去 posts/ 目录添加一篇 Markdown 试试吧。'
        );
        return;
      }

      const allTags = [...new Set(posts.flatMap((p) => p.tags))].sort();
      const visible = activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts;

      const filterHtml = allTags.length
        ? `
          <nav class="tag-filter" aria-label="标签筛选">
            <button class="tag-chip ${activeTag === null ? 'is-active' : ''}" data-tag="">
              全部 <span class="count">${posts.length}</span>
            </button>
            ${allTags
              .map(
                (t) => `
                  <button class="tag-chip ${activeTag === t ? 'is-active' : ''}" data-tag="${esc(t)}">
                    ${esc(t)} <span class="count">${posts.filter((p) => p.tags.includes(t)).length}</span>
                  </button>`
              )
              .join('')}
          </nav>`
        : '';

      const listHtml = visible.length
        ? `
          <ol class="post-list">
            ${visible
              .map(
                (p, i) => `
                  <li class="post-item" style="--i:${i}">
                    <a class="post-link" href="#/post/${encodeURIComponent(p.slug)}">
                      <div class="post-top">
                        <h2 class="post-title">${esc(p.title)}</h2>
                        <span class="post-arrow" aria-hidden="true">→</span>
                      </div>
                      <div class="post-meta">
                        ${p.date ? `<time class="post-date" datetime="${esc(p.date)}">${esc(formatDate(p.date))}</time>` : ''}
                        ${p.tags.length ? `<span class="post-tags">${tagHtml(p.tags)}</span>` : ''}
                      </div>
                      ${p.description ? `<p class="post-desc">${esc(p.description)}</p>` : ''}
                    </a>
                  </li>`
              )
              .join('')}
          </ol>`
        : renderState('Empty', '没有匹配的文章', '换个标签试试吧。');

      app.innerHTML = filterHtml + listHtml;

      const filter = app.querySelector('.tag-filter');
      if (filter) {
        filter.addEventListener('click', (e) => {
          const chip = e.target.closest('.tag-chip');
          if (!chip) return;
          activeTag = chip.dataset.tag || null;
          renderHome();
        });
      }
    } catch (err) {
      renderState(
        'Error',
        '加载失败',
        '无法获取文章列表，请确认后端服务已启动。',
        '<button class="tag-chip retry-btn" id="retry-btn">重试</button>'
      );
      const retry = document.getElementById('retry-btn');
      if (retry) retry.addEventListener('click', () => renderHome());
    }
  }

  /* ---------- 文章页 ---------- */

  async function renderArticle(slug) {
    renderLoading();

    try {
      const post = await fetchJSON(`/api/posts/${encodeURIComponent(slug)}`);
      document.title = `${post.title} · 拾光集`;

      app.innerHTML = `
        <article class="article-view">
          <a class="back-link" href="#/"><span class="arrow" aria-hidden="true">←</span> 返回首页</a>
          <header class="article-header">
            <h1 class="article-title">${esc(post.title)}</h1>
            <div class="article-meta">
              ${post.date ? `<time class="post-date" datetime="${esc(post.date)}">${esc(formatDate(post.date))}</time>` : ''}
              ${post.tags.length ? `<span class="post-tags">${tagHtml(post.tags)}</span>` : ''}
            </div>
          </header>
          <div class="prose">${post.html}</div>
        </article>`;

      enhanceCodeBlocks(app);
    } catch (err) {
      renderState(
        '404',
        '文章不存在',
        '没有找到这篇文章，它可能已经被删除或移动了。',
        '<a class="tag-chip retry-btn" href="#/">返回首页</a>'
      );
    }
  }

  /* ---------- 路由 ---------- */

  function parseRoute() {
    const hash = location.hash.replace(/^#/, '');
    const match = hash.match(/^\/post\/(.+)$/);
    if (match) return { name: 'post', slug: decodeURIComponent(match[1]) };
    return { name: 'home' };
  }

  function route() {
    const r = parseRoute();
    if (r.name === 'post') {
      renderArticle(r.slug);
    } else {
      document.title = SITE_TITLE;
      renderHome();
    }
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', route);
  route();
})();
