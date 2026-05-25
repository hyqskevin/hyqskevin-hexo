---
title: 二分查找策略
date: 2019-03-21 00:00:00
categories:
  - notes
tags:
  - algorithm
---

需要一个严格单调的序列，就能将 O(n)的复杂度降到 O(logn)的优秀算法
非常适合有序数列的查找
二分的思想也可以用来逼近准确值和降幂求值

## 二分查找思路
设 left，right，mid，查找数 x
查找的数 > mid，left = mid + 1
查找的数 < mid，right = mid - 1
直到查找的数 = mid，程序结束

```cpp
#include
int binSearch(int array[], int left, int right, int x)
{
  int mid;
  while(left
  {
    mid = (left + right) / 2;
    if(array[mid] == x) return mid;
    else if(array[mid] > x)
      right = mid - 1;
    else left = mid + 1;
  }
  return false;  //查找失败则返回false
}

int main()
{
  const int n = 10;  //序列元素个数
  int array[n] = {1,2,3,4,5,6,7,8,9,10};
  int result = binSearch(array,0,n-1,6);
  printf("%d",result);
  return 0;
}
```

- mid = (left + right) / 2 可能会导致 int 类型溢出，可以改成 mid = left + (right - left) / 2

## 当序列中有相同的元素
求解序列中第一个等于 x 的元素和最后一个等于 x 的元素

```cpp
int lower_bound(int array[], int left, int right, int x)
{
  int mid;
  while(left 
  {
    mid = (left + right) / 2;
    if(array[mid] >= x)
      right = mid;
    else left = mid + 1;
  }
  return left;  // left==right 循环停止
}
```
```cpp
int upper_bound(int array[], int left, int right, int x)
{
  int mid;
  while(left 
  {
    mid = (left + right) / 2;
    if(array[mid] > x)
      right = mid;
    else left = mid + 1;
  }
  return left;  // left==right 循环停止
}
```
## 逼近无理数近似值
计算 f(x)中 x 的值

```cpp
const double eps = 1e-5;

double func(double x)
{
  return ...;  // f(x)的公式
}

double solve(double L, double R)
{
  double left = L, right = R, mid;
  while(right - left > eps)
  {
    mid = (left + right) / 2;
    if(func(mid)>0) right = mid;
    else left = mid
  }
  return mid;
}
```
## 快速求幂
二分幂的思想可以用来降低时间复杂度
若 b 为奇数，a^b = a * a^b-1
若 b 为偶数，a^b = a^b/2 * a^b/2
直到 a^0 =1，依次退回计算

### 快速幂递归写法
求解 a^b%m 的递归写法

```cpp
typedef long long LL;
LL binFunc(LL a, LL b, LL m)
{
  if(b == 0) return 1;  // a^0 == 1
  if(b % 2 ==1) return a* binFunc(a, b-1, m) % m;
  else
  {
    LL mul = binFunc(a, b/2, m);
    return mul * mul % m;
  }
}
```

- `b % 2 ==1`可以写成`b&1`,将 b 和 1 进行按位与操作，判断 b 末尾是否为 1

### 快速幂非递归写法
将 b 写成若干 2 次幂之和，将 a^b 表示成若干项乘积

```cpp
typedef long long LL;
LL binFunc(LL a, LL b, LL m)
{
  LL ans = 1;
  while(b>0)
  {
    if(b&1) ans = ans * a % m;  //判断2进制末尾是否为1，是的话*a
    a = a * a % m;
    b >>= 1;
  }
  return ans;
}
```