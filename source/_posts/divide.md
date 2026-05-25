---
title: 分治和递归基础算法
date: 2019-03-21 00:00:00
categories:
  - notes
tags:
  - algorithm
---

写分治和贪心时，习惯性地会去思索程序的全局，而一旦展开去想，基本上就大脑溢出了
目前还是无法把握**递归式**和**递归**边界，这算法终将是一生之敌。

## Fibonacci
用 Fibonacci 数列简单熟悉一下算法

```cpp
#include

int Fibonacci(int n)
{
  if(n==0 | n==1) return 1;  //递归边界
  else return Fibonacci(n-1) + Fibonacci(n-2);  //递归式
}

int main()
{
  int n;
  scanf("%d",&n);
  printf("%d",Fibonacci(n));
  return 0;
}
```
## 全排列
按照字典顺序从小到大顺序输出 1-n 全排列

思路：数组 P 存放当前排列，hashTable 置为 true 存放已在 P 中的数字
递归式：P 按位处理，数字 x 不在 P 中，将 x 填入 P，P 处理下一位
递归边界：处理完 n 位，输出排列，hashTable[x]=false 还原

```cpp
#include
const int maxn = 1024;
int P[maxn],hashTable[maxn] = {false},n;

//处理第index位
void generateP(int index)
{
  if(index == n+1)  //到达递归边界
  {
    for(int i=0; i
      printf("%d ",P[i]);
  }
  printf("\n");
  return;

  else
  {
    for(int x=1; x
    {
      if(hashTable[x] == false)  //递归式逻辑
      {
        P[index] = x;
        hashTable[x] = true;
        generateP(index+1);
        hashTable[x] = false;
      }
    }
  }
}

int main()
{
  scanf("%d",&n);  //输入有几个数
  generateP(1)；  //从1开始递归
  return 0;
}
```
## n 皇后问题
皇后两两不在同行同列同对角线

思路：到达递归边界时，遍历任意两个皇后查看是否满足条件
递归边界：列 index 到达 n，满足八皇后条件，count+1
递归式：行 x 不在 hashTable 中，此列放置皇后，index 移动到下一列

```cpp
int count = 0;
void generateP(int index)
{
  bool flag = true;
  if(index == n+1)  //到达递归边界，判断是否合法
  {
    for(int i=1; i
      for(int j=i+1; j
        if(abs(P[i]-P[j]) == abs(i-j))
          flag = false;
    if(flag) count++;
    return;
  }

  else
  {
    for(int x=1; x
    {
      if(hashTable[x] == false)  //递归式
      {
        P[index] = x;
        hashTable[x] = true;
        generateP(index+1);
        hashTable[x] = false;
      }
    }
  }
}
```

- 枚举所有情况会比较耗时间，可以在放置皇后的同时遍历之前的，判断是否有冲突

```cpp
int count = 0;
void generateP(int index)
{
  if(inedx == n+1)  //到达递归边界
    count++;
    return;

  else
  {
    for(int x=1; x
    {
      if(hashTable[x] == false)
      {
        bool flag = true;
        for(int pre=1; pre
        {
          if(abs(P[index]-P[pre]) == abs(index-pre))
          {
            flag == false;
            break;
          }
        }
        if(flag)
        {
          P[index] = x;
          hashTable[x] = true;
          generateP(index+1);
          hashTable[x] = false;
        }
      }
    }
  }
}
```