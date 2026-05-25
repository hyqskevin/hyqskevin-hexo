---
title: 各类排序算法实践
date: 2019-03-17 00:00:00
categories:
  - notes
tags:
  - algorithm
---

比较重要的基础算法，简单罗列一下一些排序的实践过程

## 冒泡排序
## 选择排序
从待排序部分 a[i,m]选择最小元素，与待排序部分的第一个元素 a[i]交换，形成新的有序区间 a[1,i+1]
选择排序总体实践复杂度 O(n^2)

```cpp
void selectSout()
{
  for(int i=1; i
  {
    int flag = i;
    for(int j=i; j
    {
      if(a[j] 
    }

    // 交换a[i]和a[flag]
    int temp = a[i];
    a[i] = a[flag];
    a[flag] = temp;
  }
}
```
## 插入排序
```cpp

```
## 归并排序
## 快速排序
## sort 函数运用