---
title: ABC460_G
date: 2026-08-12
tags: [题解]
description: 轻重链剖分，线段树DP
---
## 题面

有一棵树，树上有 $N$ 个顶点，编号为 $1$ 至 $N$ 。第 $i$ 条边连接顶点 $a_i$ 和 $b_i$ 。每个顶点 $i$ 的权重为 $W_i$ ，颜色为 $C_i \in \lbrace 0,1 \rbrace$ 。  
处理 $Q$ 个查询。查询有以下三种类型。

- `1 v`:将顶点 $v$ 的 $C_v$ 更改为 $1 - C_v$ 。
- `2 v x`：将顶点 $v$ 的 $W_v$ 更改为 $W_v + x$ 。
- `3 v`:设 $c$ 为顶点 $v$ 的颜色。输出从顶点 $v$ 出发，只经过颜色为 $c$ 的顶点（包括顶点 $v$ 本身）所能到达的所有顶点的权重之和。

#### 数据范围与约定

- $1 \leq N \leq 3 \times 10^5$
- $1 \leq Q \leq 2 \times 10^5$
- $1 \leq W_i \leq 10^9$
- $C_i \in \lbrace 0,1 \rbrace$
- $1 \leq a_i \lt b_i \leq N$
- 输入图是一棵树。
- $1 \leq v \leq N$
- $1 \leq x \leq 10^9$
- 所有输入值均为整数。

## 分析

这道题要求维护一棵树上的动态同色连通块信息，支持点颜色翻转、点权增加以及查询同色连通块的权值和。官方题解介绍了基于 **静态 Top Tree（Static top tree）** 的做法[https://atcoder.jp/contests/abc460/editorial/21030](https://atcoder.jp/contests/abc460/editorial/21030)，利用其平衡树结构支持动态换根 DP。这里给出一种思维相近但实现更为常见的 **HLD + 线段树动态 DP** 解法，同样可以达到 $\mathrm{O}(N + Q\log^2 N)$ 的复杂度。

> ### 什么是HLD（轻重链剖分）？  
> #### 要解决什么问题？
> 树上“路径查询 / 路径修改”如果每次都暴力爬，一条链可能 $O(N)$。HLD 的做法是把任意一条树上的路径**拆成 $O(\log N)$ 段“连续的 DFS 序区间”**，每段刚好对应一条重链上的一个前缀或子段。然后你就可以在这 $O(\log N)$ 个区间上跑线段树/树状数组。
> #### 核心定义
> - **重儿子**：对于节点 $u$，子树 $size$ 最大的儿子。
> - **轻儿子**：其他儿子。
> - **重边**：连接重儿子的边。
> - **重链**：连续的重边连成的路径，最上面那个节点叫**链头**。
> - 对每个节点 $u$，我们记录：
>   - `heavy[u]`：重儿子是谁
>   - `head[u]`：$u$ 所在重链的链头
>   - `pos[u]`：$u$ 在 DFS 序中的位置（按“先走重儿子”的顺序）
> #### 关键性质
> **每条路径上的轻边数量是 $O(\log N)$ 级别的**。因为从 $u$ 往上跳，每经过一条轻边，子树大小至少翻倍（轻儿子的 size ≤ 父亲的一半），所以最多跳 $\log N$ 次就到根。
> 这意味着：任意一个点到根的路径，可以切成 $O(\log N)$ 条**重链段**，每段在 DFS 序上连续。跳的过程就是：
> ```text
> while u != 0:
>     h = head[u]
>     处理区间 [pos[h], pos[u]]
>     u = par[h]   // 跳轻边
> ```
> 处理一条链的区间只需要 $O(\log N)$ 次线段树操作，总复杂度 $O(\log^2 N)$。

> ### 什么是动态 DP（线段树维护 DP）？
> #### 普通 DP 的痛点
> 假设你有一个树 DP，转移式是：
> $$dp[u] = f\Big(\{dp[v]\mid v\text{ 是儿子}\}\Big)$$
> 单点修改后（比如改点权、颜色），你想快速知道新的 $dp[根]$ 是多少。如果每次都重跑一遍是 $O(N)$，太慢。
> **动态 DP** 的思想：把 DP 转移写成“可合并的区间操作”，然后用数据结构（线段树）在重链上维护这些操作。修改单点后，只更新它到根路径上的那些 $O(\log N)$ 条重链段上的线段树节点，每次更新 $O(\log^2 N)$。
> #### 常见形式（线性递推）
> 很多 DP 的转移可以写成矩阵乘法（比如斐波那契数列）。对于本题，转移更加简单：
> - $dp\_down[u]$：在 $u$ 的子树内，与 $u$ 同色且连通的节点权值和（必须包含 $u$）。
> - 设：
>   - $F[u] = W[u] + \sum_{\text{轻儿子 }v,\;C[v]=C[u]} dp\_down[v]$  
    （$u$ 自身的权值加上所有 **同色轻儿子** 的连通块贡献）
>   - $h = heavy[u]$
> - 若 $C[u] == C[h]$，则重儿子和 $u$ 连通，贡献可延续：
>  $$dp\_down[u] = F[u] + dp\_down[h]$$
> - 否则重儿子颜色不同，连通性断开：
>  $$dp\_down[u] = F[u]$$
> 这本质上是一个 **从左往右的“前缀累加但遇断点重置”** 操作。重链上从链头到链尾顺序，每个节点携带 $F$ 和颜色，如果相邻颜色相同就加过去，不同就只算自己。
> #### 用线段树维护这种合并
> 线段树叶子存 $(F[v], C[v])$，区间节点合并规则为：
> - 若左区间整体颜色一致，且左区间右端颜色 == 右区间左端颜色，则总的连通和 = 左区间和 + 右区间和
> - 否则结果 = 左区间和（颜色断开了，右区间不参与）
> - 同时记录该区间是否“全同色”、“最左颜色”、“最右颜色”
> 这样，线段树上任何一个节点就代表了它管辖区间**从最左端开始的连通块权值和**。因此：
> - $dp\_down[链头]$ 可以直接用线段树查整条链得到。
> - 任意节点的 $dp\_down[u]$ 只需要查 `[pos[u], 链尾]` 即可。
> ### 3. 结合本题的操作流程
> - **修改点权/颜色**：
>    1. 更新该节点的 $F[v]$（因为 $W$ 变了，或者颜色变了导致选用 light0/light1 切换）。
>    2. 单点更新线段树叶子。
>    3. 调用 `update_path(v)`：从 $v$ 往上跳重链，每跳一条重链，重算链头的 $dp\_down$，若变化则更新父节点的 light 数组和 $F$ 值，然后继续往上。
>- **查询 `3 v`**：
>    1. 先找到 $v$ 所在同色连通块的最高点 $r$（即向上跳直到颜色不同的第一个节点）。这个步骤用线段树维护的“区间全同色”信息，在重链上二分即可。
>    2. 答案就是 $dp\_down[r]$，直接线段树查。

## 解法讲解

#### 1. 问题转化
将树以 $1$ 为根。对于每个节点 $u$，定义：
- $\text{dp\_down}[u]$：在 $u$ 的子树中，与 $u$ 同色且连通的节点权值和（包含 $u$）。
- 查询 `3 v` 的答案：设 $r$ 为 $v$ 向上走遇到的第一个与 $v$ 颜色不同的祖先的**子节点**（即 $v$ 所在同色连通块中深度最小的节点）。由于连通块内颜色相同，该块的总权值和就是 $\text{dp\_down}[r]$。

因此，问题转化为：
1. 快速找到 $v$ 所在连通块的根 $r$。
2. 维护每个节点的 $\text{dp\_down}$，支持点权修改和颜色翻转。

#### 2. 动态 DP 维护 $\text{dp\_down}$
对于节点 $u$，维护：
- $F[u] = W[u] + \sum\limits_{\text{轻儿子 }v,\; C[v]=C[u]} \text{dp\_down}[v]$
- 重儿子 $h = \text{heavy}[u]$：若 $C[u]=C[h]$，则 $\text{dp\_down}[u] = F[u] + \text{dp\_down}[h]$；否则 $\text{dp\_down}[u] = F[u]$。

这可以在 HLD 的重链上用线段树维护。线段树的每个叶子对应一个节点，存储其 $F$ 值及颜色。区间合并时，若左区间全同色且右端颜色与右区间左端颜色相同，则累加右区间的贡献，否则断开。

为了支持颜色翻转，每个节点额外维护 `light0[u]` 和 `light1[u]`，分别表示所有轻儿子中颜色为 $0$ 或 $1$ 的 $\text{dp\_down}$ 总和。这样当 $u$ 的颜色改变时，只需切换选用哪一个即可，无需遍历轻儿子。

#### 3. 更新流程
单点修改（权值或颜色）后，沿重链向上跳，更新线段树叶子，并利用 `pushup` 自动重算重链上的信息。对于链头 $h$，其 $\text{dp\_down}[h]$ 变化会影响父节点（必然是轻儿子）的 `light` 值，故更新父节点的 $F$，继续向上。整个过程只会涉及 $\mathrm{O}(\log N)$ 条重链。

#### 4. 查询连通块根
利用线段树维护的区间“是否全为同一颜色”信息，从 $v$ 向上跳重链：若当前链的 $[\text{head}[v], v]$ 区间全为 $C[v]$，则跳到链头的父节点；否则在当前链上二分找到最高的同色节点，即为连通块根 $r$。

---

### 参考代码（C++）

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

const int MAXN = 300005;

int N, Q;
ll W[MAXN];
int C[MAXN];
vector<int> adj[MAXN];

// ---------- HLD ----------
int par[MAXN], heavy[MAXN], head[MAXN], pos[MAXN], tail[MAXN];
int rev[MAXN];
int cur_pos;

int dfs1(int u, int p) {
    par[u] = p;
    int sz = 1, max_sz = 0;
    heavy[u] = -1;
    for (int v : adj[u]) if (v != p) {
        int s = dfs1(v, u);
        sz += s;
        if (s > max_sz) max_sz = s, heavy[u] = v;
    }
    return sz;
}

void dfs2(int u, int h) {
    head[u] = h;
    pos[u] = ++cur_pos;
    rev[pos[u]] = u;
    if (heavy[u] != -1) {
        dfs2(heavy[u], h);
        for (int v : adj[u]) if (v != par[u] && v != heavy[u])
            dfs2(v, v);
    }
}

// ---------- Segment Tree ----------
struct SegNode {
    ll sum_down;
    bool all_same;
    int left_col, right_col;
    SegNode() : sum_down(0), all_same(false), left_col(-1), right_col(-1) {}
} seg[MAXN * 4];

SegNode merge(const SegNode& a, const SegNode& b) {
    if (a.left_col == -1) return b;
    if (b.left_col == -1) return a;
    SegNode res;
    res.left_col = a.left_col;
    res.right_col = b.right_col;
    res.all_same = a.all_same && b.all_same && a.right_col == b.left_col;
    res.sum_down = a.sum_down + ((a.all_same && a.right_col == b.left_col) ? b.sum_down : 0);
    return res;
}

void build(int node, int l, int r, ll F[]) {
    if (l == r) {
        int u = rev[l];
        seg[node].left_col = seg[node].right_col = C[u];
        seg[node].all_same = true;
        seg[node].sum_down = F[u];
        return;
    }
    int mid = (l + r) / 2;
    build(node*2, l, mid, F);
    build(node*2+1, mid+1, r, F);
    seg[node] = merge(seg[node*2], seg[node*2+1]);
}

void update(int node, int l, int r, int idx, ll f, int c) {
    if (l == r) {
        seg[node].sum_down = f;
        seg[node].left_col = seg[node].right_col = c;
        seg[node].all_same = true;
        return;
    }
    int mid = (l + r) / 2;
    if (idx <= mid) update(node*2, l, mid, idx, f, c);
    else update(node*2+1, mid+1, r, idx, f, c);
    seg[node] = merge(seg[node*2], seg[node*2+1]);
}

SegNode query(int node, int l, int r, int ql, int qr) {
    if (ql <= l && r <= qr) return seg[node];
    int mid = (l + r) / 2;
    if (qr <= mid) return query(node*2, l, mid, ql, qr);
    if (ql > mid)  return query(node*2+1, mid+1, r, ql, qr);
    return merge(query(node*2, l, mid, ql, qr),
                 query(node*2+1, mid+1, r, ql, qr));
}

// dp_down of node u
ll query_down(int u) {
    int h = head[u];
    return query(1, 1, N, pos[u], tail[h]).sum_down;
}

// find root of the same-color component containing u
int find_root(int u) {
    int col = C[u];
    while (true) {
        int h = head[u];
        SegNode res = query(1, 1, N, pos[h], pos[u]);
        if (res.all_same && res.left_col == col) {
            int p = par[h];
            if (p == 0 || C[p] != col) return h;
            u = p;
        } else {
            int l = pos[h], r = pos[u], ans = l;
            while (l <= r) {
                int mid = (l + r) / 2;
                SegNode cur = query(1, 1, N, mid, pos[u]);
                if (cur.all_same && cur.left_col == col) {
                    ans = mid;
                    r = mid - 1;
                } else l = mid + 1;
            }
            return rev[ans];
        }
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin >> N >> Q;
    for (int i = 1; i <= N; ++i) cin >> W[i];
    for (int i = 1; i <= N; ++i) cin >> C[i];
    for (int i = 1; i < N; ++i) {
        int u, v; cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    // HLD
    dfs1(1, 0);
    cur_pos = 0;
    dfs2(1, 1);
    for (int i = 1; i <= N; ++i) tail[head[i]] = max(tail[head[i]], pos[i]);

    vector<ll> light0(N+1, 0), light1(N+1, 0);
    vector<ll> F(N+1, 0), dp_down(N+1, 0);
    vector<ll> last_dp(N+1, 0);
    vector<int> last_c(N+1, 0);

    // initialize DP bottom-up
    for (int i = N; i >= 1; --i) {
        int u = rev[i];
        for (int v : adj[u]) {
            if (v == par[u] || v == heavy[u]) continue;
            (C[v] == 0 ? light0[u] : light1[u]) += dp_down[v];
        }
        F[u] = W[u] + (C[u] == 0 ? light0[u] : light1[u]);
        if (heavy[u] != -1 && C[u] == C[heavy[u]])
            dp_down[u] = F[u] + dp_down[heavy[u]];
        else
            dp_down[u] = F[u];
    }
    for (int i = 1; i <= N; ++i) {
        if (head[i] == i) {
            last_dp[i] = dp_down[i];
            last_c[i] = C[i];
        }
    }

    build(1, 1, N, F.data());

    // propagate updates upwards
    auto update_path = [&](int x) {
        while (true) {
            int h = head[x];
            ll new_dp = query_down(h);
            int p = par[h];
            if (p == 0) break;
            ll old_dp = last_dp[h];
            int old_c = last_c[h];
            int cur_c = C[h];
            if (old_dp != new_dp || old_c != cur_c) {
                (old_c == 0 ? light0[p] : light1[p]) -= old_dp;
                (cur_c == 0 ? light0[p] : light1[p]) += new_dp;
                last_dp[h] = new_dp;
                last_c[h] = cur_c;
                F[p] = W[p] + (C[p] == 0 ? light0[p] : light1[p]);
                update(1, 1, N, pos[p], F[p], C[p]);
                x = p;
            } else break;
        }
    };

    // process queries
    while (Q--) {
        int type; cin >> type;
        if (type == 1) {
            int v; cin >> v;
            int new_c = 1 - C[v];
            C[v] = new_c;
            F[v] = W[v] + (new_c == 0 ? light0[v] : light1[v]);
            update(1, 1, N, pos[v], F[v], C[v]);
            update_path(v);
        } else if (type == 2) {
            int v, x; cin >> v >> x;
            W[v] += x;
            F[v] += x;
            update(1, 1, N, pos[v], F[v], C[v]);
            update_path(v);
        } else {
            int v; cin >> v;
            int root = find_root(v);
            cout << query_down(root) << '\n';
        }
    }
    return 0;
}
```

### 复杂度分析
- 初始化：$\mathrm{O}(N)$。
- 每次修改：沿重链向上跳，涉及 $\mathrm{O}(\log N)$ 条重链，每次线段树操作 $\mathrm{O}(\log N)$，总 $\mathrm{O}(\log^2 N)$。
- 每次查询：寻找连通块根 $\mathrm{O}(\log^2 N)$，查询 $\text{dp\_down}$ $\mathrm{O}(\log N)$。

总体 $\mathrm{O}(N + Q\log^2 N)$，能通过本题。