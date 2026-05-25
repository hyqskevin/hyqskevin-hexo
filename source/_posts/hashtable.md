---
title: 散列表基础算法
date: 2019-03-19 00:00:00
categories:
  - notes
tags:
  - algorithm
---

-散列基础-
散列（hash）是常用的算法思想之一，它使用空间换时间的思想在我第一次碰到时就感觉巧妙如魔法一般。特别是在进行一些大量数字和字符串比较方面，hash 能瞬间将 O(n^2)的复杂度降到 O(n),单次查询的复杂度降到 O(1)，靠的就是数组下标与查询的元素之间建立的唯一转换关系。

## 常用 hash
线性变换函数：H(key) = a*key+b
除留余数：h(key) = key%mod

除留余数法会出现**冲突**的情况，需要解决多个 hash 值相同的情况

- 线性探测法：从当前位置检查相邻地址是否被占用，如果都被占用，循环检查下一个位置
- 平方探测法：从当前位置检查+1，-1，+4，-4，+9，-9……如果检查中+k^2 超过表长（Tablesize），[H(key)+k^2]%Tablesize
- 链地址法：把 hash 相同的 key 连接成单链表

## 整数 hash
### 查询数组 M 中的数在数组 N 中是否出现过
常规思路：遍历所有 N，要遍历 M 次，时间复杂度 O(MN)
hash 思路：bool hashTable[maxn]={false}，先读入 N，N 中出现的数 x，hashTable[x]=true,再查询 M，时间复杂度 O(M+N)

- 示例

```cpp
#include
const int maxn = 1024;
bool hashTable[maxn] = {false};
int main()
{
  int n[10] = {2,6,8,12,23,5,15,5,0,1};
  int m[3] = {8,22,5};
  int x;
  for(int i=0; i10; i++)
      hashTable{n[i]} = true;
  for(int j=0; j3;j++)
    {
      if(hashTable{m[j]]} == true)
        printf("%d,yes\n",m[j]);
      else printf("%d,no\n",m[j]);
    }
  return 0;
}
```
### 查询 M 中的数在 N 中出现的次数
将 hashTable 替换为 int 类型进行计数

- 示例

```cpp
#include
const int maxn = 1024;
int hashTable[maxn] = {0};
int main()
{
  int n[10] = {2,6,8,12,8,5,15,5,0,1};
  int m[3] = {8,12,5};
  int x;
  for(int i=0; i10; i++)
      hashTable{n[i]}++;
  for(int j=0; j3;j++)
    {
        printf("%d\n",hashTable{m[j]});
    }
  return 0;
}
```
## 字符串 hash
需要将字符串和整数唯一对应，可以直接对应或使用 hash 函数对应：A-Z 0~25，a-z 26~51

```cpp
//将字符串S转换为整数
int hashFunc(char S[], int len)
{
  int hashID = 0;
  for(int i=0; i
  {
    if(S[i]>='A' && S[i]'Z')
      hashID = hashID*52 + S[i] - 'A';
    else if(S[i]>='a' && S[i]'z')
      hashID = hashID*52 + S[i]-'a'+ 26;
  }
  return id;
}
int id = hashFunc(P[i],52);
hashTable[id] = P[i];
```
### 查询 N 个字符串中 M 个字符串出现的次数，每个字符串长度固定为 5
```cpp
#include
const int maxn = 100;
char S[maxn][5],temp[5];
int hashTable[26*26*26+10];

//每个字符串拥有唯一id
int hashFunc(char S[], int len)
{
  int id = 0;
  for(int i=0; i
  {
    id = id*26 + (S[i]-'A');
  }
  return id;
}
int main()
{
  int n, m;
  scanf("%d%d", &n, &m);
  for(int i=0; i
  {
    sacnf("%s", S[i]);
    int id  = hashFunc(s[i], 3);
    hashTable[id]++;
  }
  for(int i=0; i
  {
    sacnf("%s",temp);
    int id = hashFunc(temp, 3);
    printf("%d",hashTable[id]);
  }
  return 0;
}
```