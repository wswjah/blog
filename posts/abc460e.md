---
title: ABC460_E题解
date: 2026-08-12
tags: [题解]
description: 神秘数论
---
## 题面

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
## 题解

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
