---
title: SZTU_ACM新生夏令营第五次训练赛题解
date: 2026-08-13
tags: [题解，夏令营]
description: SZTU_ACM新生夏令营第五次训练赛题解
---

## 第一题：Five Antennas（ABC123 A）

### 题面

在 AtCoder 市，有 5 根天线排成一条直线。它们从西到东分别被称为天线 A、B、C、D、E，坐标分别为 a、b、c、d、e。

如果两根天线之间的距离不超过 k，则它们可以直接通信；如果距离大于 k，则无法直接通信。

请判断是否存在一对无法直接通信的天线。

**【样例输入1】**
```
1
2 
4 
8 
9 
15
```
**【样例输出1】**
```
Yay!
```

**【样例输入2】**
```
15 
18 
26 
35 
36 
18
```
**【样例输出2】**
```
:(
```

### 数据范围与约定

- a, b, c, d, e, k 都是 0 到 123 之间的整数
- $a < b < c < d < e$

### 思路

5 根天线两两之间共有 10 对组合。最直接的做法是枚举所有 10 对天线，计算它们的距离，检查是否有任何一对的距离大于 k。

由于坐标从左到右严格递增（a < b < c < d < e），任意两根天线的距离就是右边的坐标减去左边的坐标。

**更简单的做法**：最远的距离一定出现在最左边和最右边的天线之间，即 e - a。如果 e - a 大于 k，则存在无法通信的天线对；否则所有天线对都能通信。

### 参考代码（C++）

```cpp
#include <iostream>
using namespace std;

int a, b, c, d, e, k;

int main() {
    cin >> a >> b >> c >> d >> e >> k;

    if (e - a > k) {
        cout << ":(" << endl;
    } else {
        cout << "Yay!" << endl;
    }
    
    return 0;
}
```


## 第二题：321-like Checker（ABC321 A）

### 题面

当一个正整数 x 满足以下条件时，称它为 "**321型数字**"：

- 从最高位到最低位，每一位数字**严格递减**。

例如，`321`、`96410`、`1` 都是 **321型数字**，而 `123`、`86411` 不是。

给定一个正整数 N，请判断 N 是否是 **321型数字**。如果是，输出 `Yes`，否则输出 `No`。

**【样例输入1】**
```
321
```
**【样例输出1】**
```
Yes
```

**【样例输入2】**
```
123
```
**【样例输出2】**
```
No
```

### 数据范围与约定

- N 是正整数
- 时限 2 秒，内存 1024 MB

### 思路

将 N 的每一位数字提取出来，从高位到低位依次检查是否严格递减。

具体做法：
1. 将 N 转换为字符串，或者不断取模获取各位数字。
2. 从第 1 位到第 n-1 位，检查第 i 位是否 **大于** 第 i+1 位。
3. 如果所有相邻位都满足"前一位 > 后一位"，输出 `Yes`；否则输出 `No`。

注意：个位数（如 `5`）没有相邻位可比较，直接算作 **321型数字**。

### 参考代码（C++）

```cpp
#include <iostream>
using namespace std;

string s;

int main() {
    cin >> s;
    
    for (int i = 0; i < s.size() - 1; i++) {
        if (s[i] <= s[i + 1]) {
            cout << "No" << endl;
            return 0;
        }
    }
    
    cout << "Yes" << endl;
    return 0;
}
```


## 第三题：Five Dishes（ABC123 B）

### 题面

AtCoder 餐厅提供以下五道菜：
- ABC Don（盖饭）：需要 A 分钟上菜
- ARC Curry（咖喱）：需要 B 分钟上菜
- AGC Pasta（意面）：需要 C 分钟上菜
- APC Ramen（拉面）：需要 D 分钟上菜
- ATC Hanbagu（汉堡肉饼）：需要 E 分钟上菜

餐厅的规则如下：
- 只能在时间为 **10 的倍数**（0, 10, 20, ...）时下单。
- 一次只能点一道菜。
- 当前菜品未送达前不能点下一道菜，但可以在菜品送达的**精确时刻**点下一道菜。

某人于时间 0 到达餐厅，他要把五道菜都点一遍。他可以任意安排点菜的顺序。求最后一道菜送达的**最早可能时间**。

**【样例输入1】**
```
29 
20 
7 
35 
120
```
**【样例输出1】**
```
215
```

**【样例输入2】**
```
101 
86 
119 
108 
57
```
**【样例输出2】**
```
481
```

### 数据范围与约定

- A, B, C, D, E 都是 1 到 123 之间的整数

### 思路

关键点在于：一道菜需要 x 分钟制作，但**只能在 10 的倍数时刻下单**。因此，如果上一道菜在时刻 t 送达，下一道菜的最早下单时刻是 **$\lceil \frac{t}{10} \rceil \times 10 $**（即向上取整到最近的 10 的倍数）。送达时刻 = 下单时刻 + 制作时间。

五道菜的上菜顺序可以任意排列，共 $ 5! = 120 $ 种。由于数据范围很小，直接枚举所有排列即可。

枚举每种排列，模拟五道菜的下单和送达过程，记录最后一道菜的送达时间，取最小值。

### 参考代码（C++）

```cpp
#include <bits/stdc++.h>
using namespace std;

vector<int> t(5),order = {0, 1, 2, 3, 4};
int ans = INT_MAX;

int main() {
    for (int i = 0; i < 5; i++) cin >> t[i];
    
    do {
        int cur = 0; // 当前时间
        for (int i = 0; i < 5; i++) {
            int idx = order[i];
            // 只能在 10 的倍数时刻下单
            int order_time = (cur + 9) / 10 * 10; // 向上取整到 10 的倍数
            cur = order_time + t[idx];
        }
        ans = min(ans, cur);
    } while (next_permutation(order.begin(), order.end()));
    
    cout << ans << endl;
    return 0;
}
```
### 注意

- `next_permutation` 函数用于生成下一个全排列。

### 解法二

当然了，如果你不知道next_permutation函数，还有另一种思路：

已知：每道菜需要的时间是 **$\lceil \frac{t}{10} \rceil \times 10 $**，相当于时间在个位数进行四舍五入（109变成110，101也变成110）。从贪心的角度，每道菜浪费的时间是 $\lceil \frac{t}{10} \rceil \times 10 - t = 10 - t \% 10 $ 。我们希望总的浪费的时间最小，那就可以按个位数从小到大排序。注意：十的倍数不应排在第一个，因为它相当于浪费了十分钟 ( $ 0 \equiv 10 \pmod{10} $ )。如果放在最后会损失一点时间。

那怎么按个位数从小到大排序呢？欸~写个结构体封装一下。

参考代码如下：

```cpp
#include <iostream>
#include <algorithm>
#include <string>
#include <vector>
#include <map>
#include <queue>
using namespace std;

// AT ABC123 B?LANG=EN
// https://atcoder.jp/contests/abc123/tasks/abc123_b?lang=en
struct dish {
    int time;
    bool operator<(const dish &d) const {
        if (time % 10 == 0) return false;
        return time % 10 < d.time % 10;
    }
} a[5];
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);
    for (auto &i : a) {
        cin >> i.time;
    }
    sort(a, a + 5);
    int ans = a[0].time;
    for (int i = 1; i < 5; i++) {
        ans += (a[i].time + 9) / 10 * 10;
    }
    cout << ans << endl;
    return 0;
}
```

## 第四题：At Most 3 (Judge ver.)（ABC251 B）

### 题面

有 N 个砝码，分别称为砝码 1、砝码 2、...、砝码 N。砝码 i 的质量为 Aᵢ。

如果一个正整数 n 满足以下条件，则称 n 为"好整数"：
- 可以选择 **至多 3 个不同的砝码**，使得它们的总质量恰好等于 n。

问：有多少个小于等于 W 的正整数是好整数？

**【样例输入1】**
```
2 10
1 3
```
**【样例输出1】**
```
3
```
（好整数有：1、3、4。其中 4 = 1 + 3）

**【样例输入2】**
```
2 1
2 3
```
**【样例输出2】**
```
0
```
（任何选择的总质量都大于 1）

### 数据范围与约定

- $ 1 \leq N \leq 300 $
- $ 1 \leq W \leq  10^6 $
- $ 1 \leq  A_i  \leq 10^6 $
- 所有输入均为整数

### 思路

N 最大为 300，直接枚举所有"选 1 个、选 2 个、选 3 个"的组合，时间复杂度为 $O(N^3) = 2700 万$，在 2 秒内可以接受。

具体步骤：
1. 使用一个 `set` 来记录哪些整数是"好整数"。
2. 枚举所有选择方案：
   - 选 1 个：$for \space \space i，和 = A[i]$
   - 选 2 个：$for \space \space i < j，和 = A[i] + A[j]$
   - 选 3 个：$for \space \space i < j < k，和 = A[i] + A[j] + A[k]$
3. 如果 $ 和 \leq W $，标记为"好整数"。
4. 统计被标记的数量。

**注意**：同一个和可能由多种选择方案得到，需要用 `set` 去重。另外，选 0 个砝码不算，因为要求正整数 n。

### 参考代码（C++）

```cpp
#include <bits/stdc++.h>
using namespace std;

int N, W;
vector<int> A(N);
set<int> good;

int main() {
    cin >> N >> W;
    for (int i = 0; i < N; i++) cin >> A[i];

    // 选 1 个
    for (int i = 0; i < N; i++) {
        if (A[i] <= W) good.insert(A[i]);
    }
    // 选 2 个
    for (int i = 0; i < N; i++) {
        for (int j = i + 1; j < N; j++) {
            int sum = A[i] + A[j];
            if (sum <= W) good.insert(sum);
        }
    }
    // 选 3 个
    for (int i = 0; i < N; i++) {
        for (int j = i + 1; j < N; j++) {
            for (int k = j + 1; k < N; k++) {
                int sum = A[i] + A[j] + A[k];
                if (sum <= W) good.insert(sum);
            }
        }
    }
    
    cout << good.size() << endl;
    return 0;
}
```

## 第五题： Sushi (ABC460_C)

### 题面
有 N 片寿司饭（醋饭）和 M 片寿司料（配料），准备用它们制作寿司。

第 i 片寿司饭的重量为 $A_i$，第 j 片寿司料的重量为 $B_j$。

你需要将寿司饭和寿司料搭配起来制作寿司。

制作一块寿司时，需要使用一片寿司饭和一片寿司料。并且，寿司料的重量不能超过寿司饭重量的两倍。此外，同一片寿司饭或同一片寿司料不能用于制作多块寿司。

请你求出最多能制作多少块寿司。

### 数据范围与约定

-   $1 \leq N, M \leq 2 \times 10^5$
-   $1 \leq A_i, B_j \leq 10^9$
-   所有输入都是整数。

### 思路

排序然后双指针

### 参考代码
```cpp
#include <iostream>
#include <algorithm>
#include <string>
#include <vector>
#include <map>
#include <queue>
using namespace std;

// AT ABC460 C
// https://atcoder.jp/contests/abc460/tasks/abc460_c
int n, m, a[200005], b[200005], ans;
int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);
    cin >> n >> m;
    for (int i = 0; i < n; i++) cin >> a[i];
    for (int i = 0; i < m; i++) cin >> b[i];
    sort(a, a + n);
    sort(b, b + m);
    int i = 0, j = 0;
    while (i < n && j < m) {
        if (b[j] <= a[i] * 2) {
            ans++;
            i++;
            j++;
        } else {
            i++;
        }
    }
    cout << ans;
    return 0;
}
```

## 第六题：Dice Sum（ABC248 C）

### 题面

有多少个长度为 N 的整数序列 A = (A₁, A₂, ..., A_N)，满足以下所有条件：

- $1 ≤ A_i ≤ M（1 ≤ i ≤ N）$
- $\sum_{i=1}^N A_i ≤ K$

由于答案可能非常大，请输出答案对 998244353 取模后的结果。

**【样例输入1】**
```
2 3 4
```
**【样例输出1】**
```
6
```

满足条件的六个序列为：(1,1)、(1,2)、(1,3)、(2,1)、(2,2)、(3,1)。

**【样例输入2】**
```
31 41 592
```
**【样例输出2】**
```
798416518
```

### 数据范围与约定

- $1 ≤ N, M ≤ 50$
- $N ≤ K ≤ N \times M$
- 所有输入均为整数

### 思路

如果直接枚举所有可能的序列，共有 $ M^N $ 种方案，当 $ N = M = 50 $ 时数量级大到无法承受，显然不可行。

注意到一个关键性质：**当我们从前往后构造序列时，只需要知道当前已经选出的元素之和，不需要关心每个元素具体是多少**。之前的细节信息不会影响后续的决策。

因此可以用**动态规划（DP）** 解决。

**状态定义**

设 `dp[i][j]` 表示：已经确定了序列的前 $i$ 个数，且这 $i$ 个数的总和为 $j$ 的方案数。

**初始状态**

一个数都没选时，前 0 个数的总和为 0，方案数为 1：`dp[0][0] = 1`。

**状态转移**

考虑当前已经确定了前 $i$ 个数，总和为 $j$。接下来要选第 $i+1$ 个数，它可以取 $1$ 到 $M$ 中的任意一个整数 $k$。

如果 `j + k ≤ K`，那么就可以从状态 `dp[i][j]` 转移到 `dp[i+1][j+k]`，方案数累加。

即：

`dp[i+1][j+k] += dp[i][j]`，其中 $1 ≤ k ≤ M$，且 $j + k ≤ K$。

**最终答案**

所有长度为 $N$、总和不超过 $K$ 的方案数之和：

`答案 = dp[N][1] + dp[N][2] + ... + dp[N][K]`

**时间复杂度**

三重循环：

$i$ 从 $0$ 到 $N-1$ , $j$ 从 $0$ 到 $K$，$k$ 从 $1$ 到 $M$，复杂度为 $O(N \times M \times K)$。由于 $N, M, K ≤ 50 \times 50 = 2500$，最坏情况约 $50 \times 50 \times 2500 = 6250000 $ 次运算，完全可接受。

### 参考代码（C++）

```cpp
#include <bits/stdc++.h>
using namespace std;

const int MOD = 998244353;
int N, M, K;
vector<vector<int>> dp(N + 1, vector<int>(K + 1, 0));
int main() {
    
    cin >> N >> M >> K;

    // dp[i][j]：前 i 个数总和为 j 的方案数
    dp[0][0] = 1;

    for (int i = 0; i < N; i++) {
        for (int j = 0; j <= K; j++) {
            if (dp[i][j] == 0) continue;
            for (int k = 1; k <= M; k++) {
                if (j + k > K) break; // 因为 k 递增，后面的 k 更大，直接跳出
                dp[i + 1][j + k] += dp[i][j];
                if (dp[i + 1][j + k] >= MOD) {
                    dp[i + 1][j + k] -= MOD;
                }
            }
        }
    }

    int ans = 0;
    for (int j = 1; j <= K; j++) {
        ans += dp[N][j];
        if (ans >= MOD) ans -= MOD;
    }

    cout << ans << endl;
    return 0;
}
```

**【代码说明】**
- 使用 `vector` 二维数组存储 DP 状态，大小为 (N+1) × (K+1)。
- 内层循环中，由于 k 从 1 递增，一旦 `j + k > K` 就可以直接 `break`，因为后面的 k 更大。
- 每次累加后立即取模，避免整数溢出。
- 最终答案统计 `dp[N][1]` 到 `dp[N][K]` 的总和。

## 第七题 Repeatedly Repainting (ABC460_D)

###  题面

有一个网格，网格中有 $H$ 行和 $W$ 列。位于从上往下第 $i$ 行和从左往上第 $j$ 列的单元格称为单元格 $(i, j)$ 。

每个单元格都被染成白色或黑色。网格由 $H$ 个字符串 $S_1, S_2, \ldots, S_H$ 描述，每个字符串的长度为 $W$ 。如果 $S _i$ 的第 $j$ 个字符是 `.` ，那么 $(i, j)$ 单元格是白色的；如果 $S_i$ 的第 $j$ 个字符是 `#` ，那么 $(i, j)$ 单元格是黑色的。

您执行以下操作 $10^{100}$ 次。

- 同时对所有单元格应用以下规则。
    - 当且仅当至少有一个黑色单元格与其相邻时，操作前为白色的单元格才会变为黑色。这里， $(x, y)$ 和 $(x', y')$ 这两个单元格相邻，前提是其中一个单元格位于另一个单元格的 $8$ （即 $\max(|x-x'|, |y-y'|) = 1$ ）邻域内。
    - 操作前为黑色的单元格会变为白色。

求操作后每个单元格的颜色。

### 数据范围与约定

- $1 \leq H \times W \leq 10^6$
- $H$ 和 $W$ 均为正整数。
- $S_i$ 是长度为 $W$ 的字符串，由 `.` 和 `#` 组成。

### 思路

注意到，操作次数是 $10^{100}$ 次，显然不能直接模拟。所以，经过有限次操作后，网格中的颜色分布必定会趋于稳定，即不再发生变化。

那什么时候达到稳态呢？

举一个最简单的例子：$5 \times 5$的网格中央只有一个黑色，其余全是白色。第一轮变化过后，它周围一圈会变成黑色，而它自己变成白色。第二轮过后，以它为中心，半径为0（即它自己）和2的一圈会变成黑色。

```text
.....      .....      #####     
.....      .###.      #...#   
..#..  =>  .#.#.  =>  #.#.#            
.....      .###.      #...#   
.....      .....      #####    
``` 

这很像一个扩散的过程，一个黑色点产生一个波，向外一圈圈的扩散。我们猜测一个结论：即达到稳态后，对于一个点 $(x, y)$ ，它的颜色取决与于它到最近的黑色点的切比雪夫距离。距离为偶数的点为黑色，距离为奇数的点为白色。

如果多个黑色点呢？我们假设有两个黑色源点,$S_1 \space (3,4)$ 和 $S_2 \space (4,3) $ ，它们同时向外扩散，设有一个白色点A，到$S_1$ 的切比雪夫距离为 $d_1$ ，到 $S_2$ 的切比雪夫距离为 $d_2$ ，那么：

1. 如果 $d_1$,$d_2$ 奇偶性相同，可以认为两个波同时到达，那么两个源点对它的影响也相同：
    - 如果 $d_1$ 和 $d_2$ 都是偶数，那么 $A$ 是黑色。如下图点$(2,2)$ 
    - 如果 $d_1$ 和 $d_2$ 都是奇数，那么 $A$ 是白色。如下图点$(3,3)$
2. 如果 $d_1$,$d_2$ 奇偶性不同，那么两个源点对它的影响不同。我们不妨设$d_1 + 1 = d_2$，即源点 $S_1$发出的波，先到达该点；在下一个时刻，源点 $S_2$发出的波才到达该点。
    - 如果 $d_1$ 是奇数， $d_2$ 是偶数。那么在时刻$d_1$，$A$ 是黑色，在时刻$d_2$，$S_2$发出的波想让它变成黑色，但是由于规则二，$A$ 是白色。由于最终时刻$10^{100}$是偶数，所以点 $A$ 最终是白色。如下图$(2,4)$
    - 如果 $d_1$ 是偶数， $d_2$ 是奇数。那么在时刻$d_1$，$A$ 是白色，在时刻$d_2$，$A$ 是黑色。由于最终时刻$10^{100}$是偶数，所以点 $A$ 最终是黑色。如下图$(3，6)$

```text
......      ......      .#####     
......      ..###.      ##...#   
...#..  =>  .##.#.  =>  #..#.#            
..#...      .#.##.      #.#..#   
......      .###..      #...#.    
```

综上，对于一个点 $(x, y)$ ，它的颜色取决与于它到最近的黑色点的切比雪夫距离。距离为偶数的点为黑色，距离为奇数的点为白色。

#### 注意：

上述条件建立在所有黑色点都能扩散出去的基础上。如果一个点扩散不出去，比如下例，第三排的黑色点无法扩散出去，那么该点最后就是白色。

如：
```text
...     ###    ... 
###  => ... => ###       
###     ...    ... 
```

所以，我们需要先判断黑色点是否可以扩散出去，然后进行多源BFS，求出每个白色点，到它最近的黑色点的距离。

### 参考代码
```cpp
#include <iostream>
#include <algorithm>
#include <string>
#include <vector>
#include <map>
#include <queue>
using namespace std;

// AT ABC460 D
// https://atcoder.jp/contests/abc460/tasks/abc460_d
int h, w, cnt;
const int dx[] = {-1, -1, -1, 0, 0, 1, 1, 1};
const int dy[] = {-1, 0, 1, -1, 1, -1, 0, 1};
int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);

    cin >> h >> w;
    vector<vector<char>> a(h + 1, vector<char>(w + 1)), c(h + 1, vector<char>(w + 1));
    vector<vector<int>> b(h + 1, vector<int>(w + 1, -1));
    queue<pair<int, int>> q;

    for (int i = 1; i <= h; i++) {
        for (int j = 1; j <= w; j++) {
            cin >> a[i][j];
            if (a[i][j] == '#') {
                cnt++;
            }
        }
    }

    if (cnt == 0 || cnt == h * w) {
        for (int i = 1; i <= h; i++) {
            for (int j = 1; j <= w; j++) cout << '.';
            cout << '\n';
        }
        return 0;
    }
    cnt = 0;
    // 判断黑色点是否可以扩散出去
    for (int i = 1; i <= h; i++) {
        for (int j = 1; j <= w; j++) {
            bool flag = false;
            if (a[i][j] == '#') {
                for (int k = 0; k < 8; k++) {
                    int nx = i + dx[k], ny = j + dy[k];
                    if (nx < 1 || nx > h || ny < 1 || ny > w) continue;
                    if (a[nx][ny] == '.') {
                        flag = true;
                        break;
                    }
                }
            } else
                continue;
            if (!flag)
                c[i][j] = '.';
            else
                c[i][j] = '#';
        }
    }
    a = c;
    for (int i = 1; i <= h; i++) {
        for (int j = 1; j <= w; j++) {
            if (c[i][j] == '#') {
                b[i][j] = 0;
                q.emplace(i, j);
                cnt++;
            }
        }
    }
    while (!q.empty()) {
        auto [x, y] = q.front();
        q.pop();
        for (int i = 0; i < 8; i++) {
            int nx = x + dx[i], ny = y + dy[i];
            if (nx < 1 || nx > h || ny < 1 || ny > w) continue;
            if (b[nx][ny] != -1) continue;
            b[nx][ny] = b[x][y] + 1;
            q.emplace(nx, ny);
        }
    }

    for (int i = 1; i <= h; i++) {
        for (int j = 1; j <= w; j++)
            cout << (b[i][j] % 2 == 0 ? '#' : '.');
        cout << '\n';
    }
}

```

#### 补充证明

如果你觉得我上面给出的证明太抽象，可以参考以下更形式化的证明：

设初始黑色格子集合为 $S_0$。定义每个格子 $(i,j)$ 到 $S_0$ 的**切比雪夫距离**为：


$d(i,j) = \min_{(x,y)\in S_0} \max(|i-x|,\ |j-y|)$

经过 $10^{100}$ 次操作后（$10^{100}$ 是偶数且远大于网格直径），最初颜色为白色的格子，最终颜色为：

- **黑色**，当且仅当 $d(i,j)$ 为**偶数**；
- **白色**，当且仅当 $d(i,j)$ 为**奇数**。

最初颜色为黑色的格子，最终颜色为：

- **黑色**，当且仅当 其八邻域内存在至少一个白色格子；
- **白色**，当且仅当 其八邻域内不存在白色格子。

---

### 证明

**引理**：设第 $t$ 次操作后的黑色集合为 $S_t$，则对于所有 $t \ge 0$，有


$S_t = \{\, (i,j) \mid d(i,j) \equiv t \pmod 2 \ \text{且} \ d(i,j) \le t \,\}.$

**证明（数学归纳法）**：

- **$t=0$**：$S_0$ 就是所有距离为 $0$ 的格子（即初始黑格），且 $0\equiv 0\pmod 2$，$d\le 0$ 成立，显然。

- **$t=2$**时，如果$ \exists x_0 \in S_0 $，且$x_0$的八邻域内全是黑色，那么在$t=1$时，$x_0$及其八邻域全部都是白色，因此 $x_0 \notin S_2$ 。如果 $x_0$ 的八邻域内至少有一个白色格子，那么在 $t=1$ 时，$x_0$ 会变成黑色，因此 $x_0$ 在 $S_2$ 中。因此 $S_2$ 满足引理。

- **假设 $t \geq 2 $ 时命题成立**，考虑第 $t+1$ 次操作。操作规则可重述为：
  - 当前黑色格子全部变为白色；
  - 当前白色格子若与至少一个黑色格子相邻（8邻域），则变为黑色。

  因此，
  
  $S_{t+1} = \{\, x \notin S_t \mid \exists\, y\in S_t \text{ 使得 } x\text{ 与 }y\text{ 相邻} \,\}.$
  

  由归纳假设，$S_t$ 中的点满足 $d \equiv t \pmod 2$ 且 $d \le t$。由于相邻格子的切比雪夫距离最多相差 $1$，因此：
  - 若 $x\notin S_t$ 且与某个 $y\in S_t$ 相邻，则必有 $d(x) \le d(y)+1 \le t+1$。
  - 同时，$d(x)$ 的奇偶性必须与 $t+1$ 相同（因为从 $t$ 步到 $t+1$ 步，奇偶性发生翻转）。

  反过来，对于任意满足 $d(x) \equiv t+1 \pmod 2$ 且 $d(x) \le t+1$ 的格子 $x$，必然存在一条长度恰好为 $d(x)$ 的最短路径从某个初始黑格到达它。沿着这条路径，距离逐格递减，可以找到距离为 $d(x)-1$ 的邻居 $y$，而 $d(x)-1$ 的奇偶性恰为 $t$（因为 $d(x)\equiv t+1$），且 $d(x)-1 \le t$，故 $y\in S_t$。于是 $x$ 与 $y$ 相邻且 $x\notin S_t$，所以 $x\in S_{t+1}$。

  综上，$S_{t+1}$ 恰好是满足 $d\equiv t+1\pmod 2$ 且 $d\le t+1$ 的格子集合，引理得证。

---

**最终应用**：

操作次数 $T=10^{100}$ 是偶数，且因为网格大小有限，所有格子的 $d$ 值都有上界（最大不超过 $\max(H,W)-1$）。由于 $T$ 远远大于这个上界，所以对于每个格子都有 $d(i,j) \le T$ 成立。于是由引理：


$S_T = \{\, (i,j) \mid d(i,j) \equiv T \pmod 2 \,\} = \{\, (i,j) \mid d(i,j) \text{ 为偶数} \,\}.$

因此，结论成立。

---

## 第八题: x + y ≡ x + y (ABC460_E)

这题是个防ak题来着。当时做这套abc的时候，不少人反馈E比D简单......

### 题面

对于正整数 $a$ 和 $b$ ，定义 $\mathrm{concat}(a, b)$ 为一个接一个写入 $a$ 和 $b$ 的整数。更正式地说， $\mathrm{concat}(a, b)$ 的定义如下。

- 设 $A$ 和 $B$ 分别是十进制写法 $a$ 和 $b$ 形成的字符串。设 $C$ 是按此顺序连接 $A$ 和 $B$ 所形成的字符串。将 $C$ 解释为十进制整数的值为 $\mathrm{concat}(a, b)$ 。

例如，如果 $a = 123$ 和 $b = 45$ ，那么就是 $\mathrm{concat}(a, b) = 12345$ 。

给你正整数 $N$ 和 $M$。求 $x,y \le N$ 的正整数对 $(x, y)$ 中 $\mathrm{concat}(x, y) \equiv x + y \pmod{M}$ 的个数，最终结果对 $ 998244353 $ 取模。

给你 $T$ 个测试案例，求解每个案例。

### 数据范围与约定

-   $1 \leq T \leq 10^4$
-   $1 \leq N \leq 10^{18}$
-   $2 \leq M \leq 10^9$
-   所有输入都是整数。

### 分析

首先，我们需要理解 $\mathrm{concat}(x, y)$ 的含义。对于两个正整数 $a$ 和 $b$ ， $\mathrm{concat}(a, b)$ 是将 $a$ 和 $b$ 拼接成一个整数。例如， $\mathrm{concat}(123, 45) = 12345$ 。

我们不难发现：

设 $y$ 有 $d$ 位，那么有 $\mathrm{concat}(x, y) = x \times 10^{d} + y$。

要求 $\mathrm{concat}(x, y) \equiv x + y \pmod{M}$

即 $x \times 10^{d} + y \equiv x + y \pmod{M}$

两边消去 $y$ 有：

$x \times (10^{d} - 1) \equiv 0 \pmod{M}$

这说明：对于位数相同的所有 $ y $，满足条件的 $x$ 的集合是完全一样的，都只取决于 $10^{d} - 1 $和 $M$。

不妨设 $A = 10^{d} - 1$ , $ g = \gcd(A, M) $ , $ M' = M \div g $ 。

方程 $x \times A \equiv 0 \pmod{M}$ 就等价于 $ x $ 是 $ M' $ 的倍数 (约去公因数后$ A/g $ 与 $ M' $互质)。

即 $ x  = k \times M' , k \subseteq{R} \text{  且  } 1 \le x \le N$ ，满足条件的 $ x $ 的个数就是 $ \lfloor N / M' \rfloor $。

所以我们枚举每一个可能的位数 $d$ ， $\text{贡献} =  (R - L + 1) \times \lfloor N / M' \rfloor $ ,其中 $ L = 10^{d-1} $ , $ R = \min(N, 10^d - 1) $ , $ l - R + 1$ 即为有多少个可能的 $d$ 位数。

### 参考代码
```cpp
#include <iostream>
#include <algorithm>
#include <string>
#include <vector>
#include <map>
#include <queue>
using namespace std;
using ll = unsigned long long; // 防溢出
// AT ABC460 E
// https://atcoder.jp/contests/abc460/tasks/abc460_e

const ll MOD = 998244353;

ll gcd(ll a, ll b) {
    return b == 0 ? a : gcd(b, a % b);
}
int t;
ll n, m, ans, l, r, sum;
ll A, g, m1, cnt;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    cin >> t;
    while (t--) {
        cin >> n >> m;

        ans = 0;
        l = 1;
        ll pow10 = 10 % m;

        for (int d = 1; d <= 19; d++) {
            if (l > n) break;

            r = min(n, l * 10 - 1);
            sum = r - l + 1; // d位数的个数

            A = (pow10 - 1 + m) % m; // + m 防止负数
            g = gcd(A, m);
            m1 = m / g;
            cnt = n / m1;

            ans = (ans + (sum % MOD) * (cnt % MOD)) % MOD; // d位数的贡献

            l *= 10;
            pow10 = (pow10 * 10) % m;
        }

        cout << ans << '\n';
    }
    return 0;
}
```