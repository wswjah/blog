---
title: ABC460_F
date: 2026-08-12
tags: [题解]
description: 线段树，欧拉序，倍增
---
## 题面

有一棵树，树上有 $N$ 个顶点。顶点编号为 $1, 2, \ldots, N$ ， $i$ -th 边连接顶点 $U_i$ 和 $V_i $ 。

最初，所有顶点都涂成黑色。

依次处理以下形式的 $Q$ 个查询，并找出每个查询的答案。

- 给定一个整数 $x$ $(1 \leq x \leq N)$ 。 如果顶点 $x$ 为白色，则将其重新涂成黑色；如果顶点 $x$ 为黑色，则将其重新涂成白色。然后，找出两个黑色顶点之间的最大距离。这里，树上两个顶点之间的距离就是它们之间简单路径的边数。

在给定的输入中，按顺序处理查询时总是至少有两个黑色顶点。

## 数据范围与约定

-   $3 \leq N \leq 10^5$
-   $1 \leq U_i, V_i \leq N$
-   给定图形是一棵树。
-   $1 \leq Q \leq 10^5$
-   对于每个查询， $1 \leq x \leq N$.
-   总是至少有两个黑色顶点。
-   保证所有输入均为整数。

## 题目大意

我们有一棵 $ N $ 个节点的树，一开始所有节点都是黑色。有 $ Q $ 次操作，每次操作会把一个节点的颜色翻转：黑变白、白变黑。

每次操作后，都要输出当前所有黑色节点构成的直径（任意两个黑色节点间的最大距离）。

保证任何时候黑色节点不少于 2 个。

这其实是一个 **动态集合直径维护** 问题，集合会频繁增删元素（至多 $ 10^5$次）。我们需要一种高效结构支持单点修改和全局直径查询。

## 核心理论：直径的合并性质
在树上，有一个著名的结论：

> 已知两个点集 $ S_1 $ 和 $ S_2 $ ，设 $ S_1 $ 的直径为 $ (a, b) $ ， $ S_2 $ 的直径为 $ (c, d) $ 。  
> 那么 $ S_1 \cup S_2 $ 的 **直径端点一定在 $ \{a, b, c, d\} $ 这 $ 4 $ 个点当中**。


换句话说，我们只需要维护每个集合的直径**端点**，合并两个集合时，只需在 $ 4 $ 个候选端点中计算两两距离，找出最大的一对。就能以 $ O(1) $ 的时间复杂度完成合并。  
（如果某个集合为空，合并结果就是另一个集合。）

这一性质非常适合 **线段树**：

线段树的每个叶子代表一个节点。如果该节点当前是黑色，它的点集就是 $ \left\{ u \right\} $，直径为 $ (u, u) $；如果是白色，点集为空，记为 $ (−1, −1) $。


线段树的内部节点代表它区间内所有黑色节点的集合，它的直径可以由左右儿子合并得到。

整棵线段树的根节点就维护了当前所有黑色节点的直径。

单点翻转颜色等价于线段树的点更新，每次更新后从下往上 `merge` 即可。这样每次操作只需要 $O(logN) $ 次合并，每次合并需要 $ O(1) $ 次距离查询。


## 问题难点：如何 $ O(1) $ 求树上两点距离？

$ \text{两点距离} =\mathrm{depth}[u] + \mathrm{depth}[v] - 2 \times \mathrm{depth}[\mathrm{lca}(u,v)]$。

我们需要一个**支持 $O(1)$ 查询的 LCA**。  
标准做法是：**欧拉序** + **ST表**。

> 欧拉序是什么？  
> 欧拉序有两种。第一种是：DFS时，第一次到达该结点记录一次，随后每次回退到它时再记录一次，一共 $2n-1$ 个编号。用途为将树上LCA问题转化为ST表RMQ问题，做到 $ O(nlogn)$ 预处理和 $O(1)$ 查询。  
>第二种是：DFS时，每个节点入栈与出栈时分别记录一次，共 $ 2n $ 个编号。用途为将树上路径转化为线性的，实现树上莫队等操作。  
> 我们这里采用第一种。


具体步骤：
- 从根 1 开始做 DFS，记录**欧拉序列** `euler`（每进入一个节点就加入，回溯到父节点时也加入父节点）。
- 同时记录每个节点的深度，在欧拉序列的对应位置存下深度数组 `dep_euler`。
- 对于节点 $u$，记录它在欧拉序列中**第一次出现的位置** `first[u]`。
- 那么 $\mathrm{lca}(u,v)$ 就是 `euler` 数组中区间 `[ first[u], first[v] ]` 里深度最小的那个节点。
- 在 `dep_euler` 上建立 ST表 ，$O(N\log N)$ 预处理，$O(1)$ 查询区间最小值下标，从而得到 LCA。

这样 `dist(u,v)` 就是 $O(1)$。

---

## 代码难点分解


### 1 生成欧拉序列（迭代 DFS）

为了避免 $10^5$ 的递归可能爆栈，可以采用**栈模拟递归**的写法：

```cpp
struct Frame { // 栈帧
    int u, p;
    bool exit;
};
```

- `u` 当前节点，`p` 父节点，`exit` 为 `false` 表示第一次进入，`true` 表示要从该节点回溯。
- 当 `exit == false` 时：
  - 记录 `first[u]`（如果是第一次出现）。
  - 将 `u` 加入 `euler`，对应深度加入 `dep_euler`。
  - 压入一个 `{u, p, true}` 作为退出标记。
  - 遍历所有子节点 `v`，若不是父亲则压入 `{v, u, false}`。
- 当 `exit == true` 时：
  - 说明 $u$ 的所有子树都处理完了，此时回溯到父节点 $p$。**如果 $p \neq 0$**，将 $p$ 加入 `euler` 和 `dep_euler`。

>为什么要回溯时加父节点？  
为了让欧拉序列覆盖完整的 DFS 路径，使得任意两个节点的 LCA 一定会出现在它们第一次出现位置之间的区间中，并且该区间的最小深度就是 LCA 的深度。回溯时记录父节点正好能覆盖路径上的所有转折点。
```cpp
    memset(first, -1, sizeof(first)); // 存储每个节点第一次出现的位置
    stack<Frame> stk;
    stk.push({1, 0, false});
    depth[1] = 0;
    euler.reserve(4 * N);
    dep_euler.reserve(4 * N);

    while (!stk.empty()) {
        Frame f = stk.top();
        stk.pop();
        int u = f.u, p = f.p;
        if (!f.exit) {
            // 进入 u
            if (first[u] == -1)
                first[u] = euler.size();
            euler.push_back(u);
            dep_euler.push_back(depth[u]);
            stk.push({u, p, true}); 
            for (int v : adj[u]) {
                if (v == p) continue;
                depth[v] = depth[u] + 1;
                stk.push({v, u, false});
            }
        } else {
            // 离开 u，记录父节点 p
            if (p != 0) {
                euler.push_back(p);
                dep_euler.push_back(depth[p]);
            }
        }
    }
```
### 2 构建 ST 表

`euler` 数组长度为 $M \approx 2N$，我们在 `dep_euler` 上建表：

```cpp
for (int i = 0; i < M; ++i) st[0][i] = i;   // 存下标，而不是值
for (int j = 1; (1 << j) <= M; ++j) {
    for (int i = 0; i + (1 << j) - 1 < M; ++i) {
        int idx1 = st[j-1][i];
        int idx2 = st[j-1][i + (1 << (j-1))];
        st[j][i] = (dep_euler[idx1] < dep_euler[idx2]) ? idx1 : idx2;
    }
}
```

并且预处理 `log2_table` 便于 $O(1)$ 拿到 $k = \lfloor \log_2 (r-l+1) \rfloor$。
```cpp
log2_table[1] = 0;
for (int i = 2; i <= M; ++i) 
    log2_table[i] = log2_table[i / 2] + 1;
```
### 3 距离函数

```cpp
int dist(int u, int v) {
    if (u == -1 || v == -1) return -1;  // 表示存在空集合
    if (u == v) return 0;
    int l = first[u], r = first[v];
    if (l > r) swap(l, r);
    int k = log2_table[r - l + 1];
    int idx1 = st[k][l];
    int idx2 = st[k][r - (1 << k) + 1];
    int lca = dep_euler[idx1] < dep_euler[idx2] ? euler[idx1] : euler[idx2];
    return depth[u] + depth[v] - 2 * depth[lca];
}
```

### 4 线段树节点与合并

```cpp
struct Node {
    int u, v;
    Node(int u = -1, int v = -1) : u(u), v(v) {}
} tree[4 * MAXN];
```

`-1` 表示空集合。  
合并函数 `merge(a, b)`：
1. 若有一方为空，返回另一方。
2. 否则，枚举 $\{a.u, a.v, b.u, b.v\}$ 所有配对，计算距离，保留最大值对应的那对端点。

### 5 线段树建树与更新

建树时默认所有节点都是黑色，所以叶子直接 `Node(l, l)`，内部节点由儿子合并。

更新时：
```cpp
void update(int node, int l, int r, int pos) {
    if (l == r) {
        if (color[pos]) {
            tree[node] = Node(-1, -1);  // 变白
            color[pos] = false;
        } else {
            tree[node] = Node(pos, pos); // 变黑
            color[pos] = true;
        }
        return;
    }
    // 递归更新左右儿子，然后合并
}
```

每次查询答案：读取 `tree[1].u` 和 `tree[1].v` 并计算 `dist` 即可。

---

## 整体复杂度

- 欧拉序列生成与 RMQ 预处理：$O(N \log N)$
- 线段树建树：$O(N)$
- 每次查询：$O(\log N)$ 次合并，每次合并做 6 次距离询问，每次 $O(1)$，总 $O(Q \log N)$

在 $N,Q \le 10^5$ 下完全可行。

## 参考代码

```cpp
#include <iostream>
#include <algorithm>
#include <string>
#include <vector>
#include <map>
#include <queue>
#include <set>
#include <cmath>
#include <stack>
#include <cstring>
using namespace std;

// AT ABC460 F
// https://atcoder.jp/contests/abc460/tasks/abc460_f

const int MAXN = 100005;
const int MAXM = 200005; 

int N, Q;
vector<int> adj[MAXN];
int depth[MAXN];
int first[MAXN];
vector<int> euler, dep_euler;

// RMQ Sparse Table
int st[20][MAXM];
int log2_table[MAXM];

// 迭代 DFS 用栈帧
struct Frame {
    int u, p;
    bool exit;
};

// 线段树节点：存放直径的两个端点
struct Node {
    int u, v;
    Node() : u(-1), v(-1) {
    }
    Node(int u, int v) : u(u), v(v) {
    }
} tree[4 * MAXN];

bool color[MAXN]; // true 表示黑色

// O(1) 求两点距离
int dist(int u, int v) {
    if (u == -1 || v == -1) return -1;
    if (u == v) return 0;
    int l = first[u], r = first[v];
    if (l > r) swap(l, r);
    int k = log2_table[r - l + 1];
    int idx1 = st[k][l];
    int idx2 = st[k][r - (1 << k) + 1];
    int lca = dep_euler[idx1] < dep_euler[idx2] ? euler[idx1] : euler[idx2];
    return depth[u] + depth[v] - 2 * depth[lca];
}

// 合并两个点集，求新直径端点
Node merge(const Node &a, const Node &b) {
    if (a.u == -1) return b;
    if (b.u == -1) return a;
    int cand[4] = {a.u, a.v, b.u, b.v};
    int best_u = cand[0], best_v = cand[1];
    int best_dist = dist(cand[0], cand[1]);
    for (int i = 0; i < 4; ++i) {
        for (int j = i + 1; j < 4; ++j) {
            int d = dist(cand[i], cand[j]);
            if (d > best_dist) {
                best_dist = d;
                best_u = cand[i];
                best_v = cand[j];
            }
        }
    }
    return Node(best_u, best_v);
}

// 建线段树
void build(int node, int l, int r) {
    if (l == r) {
        tree[node] = Node(l, l);
        return;
    }
    int mid = (l + r) / 2;
    build(node * 2, l, mid);
    build(node * 2 + 1, mid + 1, r);
    tree[node] = merge(tree[node * 2], tree[node * 2 + 1]);
}

// 单点更新（颜色翻转）
void update(int node, int l, int r, int pos) {
    if (l == r) {
        if (color[pos]) {
            tree[node] = Node(-1, -1);
            color[pos] = false;
        } else {
            tree[node] = Node(pos, pos);
            color[pos] = true;
        }
        return;
    }
    int mid = (l + r) / 2;
    if (pos <= mid)
        update(node * 2, l, mid, pos);
    else
        update(node * 2 + 1, mid + 1, r, pos);
    tree[node] = merge(tree[node * 2], tree[node * 2 + 1]);
}

int main() {
    // ---------- 输入 ----------
    scanf("%d", &N);
    for (int i = 1; i < N; ++i) {
        int u, v;
        scanf("%d %d", &u, &v);
        adj[u].push_back(v);
        adj[v].push_back(u);
    }
    scanf("%d", &Q);

    // ---------- 欧拉序列（迭代 DFS）----------
    memset(first, -1, sizeof(first));
    stack<Frame> stk;
    stk.push({1, 0, false});
    depth[1] = 0;
    euler.reserve(2 * N);
    dep_euler.reserve(2 * N);

    while (!stk.empty()) {
        Frame f = stk.top();
        stk.pop();
        int u = f.u, p = f.p;
        if (!f.exit) {
            // 第一次进入 u
            if (first[u] == -1)
                first[u] = euler.size();
            euler.push_back(u);
            dep_euler.push_back(depth[u]);
            stk.push({u, p, true}); // 退出标记
            for (int v : adj[u]) {
                if (v == p) continue;
                depth[v] = depth[u] + 1;
                stk.push({v, u, false});
            }
        } else {
            // 离开 u，记录父节点 p
            if (p != 0) {
                euler.push_back(p);
                dep_euler.push_back(depth[p]);
            }
        }
    }

    // ---------- 构建 Sparse Table ----------
    int M = euler.size();
    for (int i = 0; i < M; ++i) st[0][i] = i;
    for (int j = 1; (1 << j) <= M; ++j) {
        for (int i = 0; i + (1 << j) - 1 < M; ++i) {
            int idx1 = st[j - 1][i];
            int idx2 = st[j - 1][i + (1 << (j - 1))];
            st[j][i] = (dep_euler[idx1] < dep_euler[idx2]) ? idx1 : idx2;
        }
    }
    log2_table[1] = 0;
    for (int i = 2; i <= M; ++i) log2_table[i] = log2_table[i / 2] + 1;

    // ---------- 线段树 ----------
    fill(color + 1, color + N + 1, true);
    build(1, 1, N);

    // ---------- 处理查询 ----------
    while (Q--) {
        int x;
        scanf("%d", &x);
        update(1, 1, N, x);
        printf("%d\n", dist(tree[1].u, tree[1].v));
    }

    return 0;
}
```