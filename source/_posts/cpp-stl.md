---
title: cpp_stl
date: 2019-03-20 00:00:00
categories:
  - code
tags:
  - c++
---

C++ STL 接触(loading…)
在学习 C++，数据结构基础上，STL 是基础和进阶的分水岭，要多尝试用 STL 实现常用的算法和数据结构

## Template（模板）
模板（Template）指 C++程序设计设计语言中采用类型作为参数的程序设计，支持通用程序设计。C++ 的标准库提供许多有用的函数大多结合了模板的观念，如 STL 以及 IO Stream。

### 函数模板
可以实现不同类型的函数代码的复用

```cpp
// 模板定义
templatetypename t> swap(t &t1, t &t2){
  t tmpT;
  tmpT = t1;
  t1 = t2;
  t2 = tmpT;
}

//模板实例化
int main(){
  int num1 = 1, num2 = 2;
  float num3 = 1.0, num4 = 2.0;
  swapint>(num1, num2);
  swapfloat>(num3, num4);
  return 0;
}
```
### 类模板
可以实现不同类型的类的复用

```cpp
// 模板定义
templateclass t> class Stack{
  public:
    Stack(){
      maxSize = 100;
      size = 0;
      p = new t[maxSize];
    };
    ~Stack(){
      delete p[];
      p = nullptr;
    };
    void push(t num){
      size++;
      p[size-1] = num;
    };
    t pop(){
      t num = p[size-1];
      size--;
      return num;
    };
    bool isEmpty(){
      return size == 0;
    };

  private:
    t *p;
    int maxSize;
    int size;
}

// 模板实例化
int main(){
  Stackint> intStack;
  Stackfloat> floatStack;
  ...

  intStack.push(1);
  intStack.push(2);
  intStack.push(3);
  ...

  while(!intStack.isEmpty()){
    printf("%d",intStack.pop());
  }
  return 0;
}
```
### 模板参数
模板可以有常规的类型参数，也可以有默认模板参数
`template<class t, int maxSize = 100> class stack{}`

一个类没有模板参数，但是成员函数有模板参数，是可行的

有些特殊的参数可以使用模板专门化
`template<> void swap(std::vector<int>& t1, std::vector<int>& t2){}`

## string 类
使用指针 ++ 和 — 操作符来遍历字符串，无论 ASCII 码字符串还是 Unicode 字符串，使用指针均能够正确无误地返回要寻求的字符位置。使用数组处理字符串中的字符也非常方便。

STL 中只有一个字符串类，即 basic_string。类 basic_string 实现管理以 \0 结尾的字符数组，字符类型由模板参数决定。basic_string 有两个预定义类型：包含 char 的 string 类型和包含 wchar 的 wstring 类型。

string 作为类出现，其集成的操作函数足以完成多数情况下的需要。可以使用 “=” 进行赋值，使用 “==” 进行等值比较，使用 “+” 做串联。

string 类包含了 6 个构造函数。string 类支持 cin 方式和 getline() 方式两种输入方式。

### basic_string
basic_string 是一个类模板，包括 string，wstring，u16stirng 和 u32string
`typedef basic_string <char> string;`
`typedef basic_string <wchar> wstring;` //wstring 类是为了便于使用宽字符集，例如 Unicode 或某些欧洲字符集

### string 函数
string 类提供的各种操作函数大致分为八类：构造器和析构器、大小和容量、元素存取、字 符串比较、字符串修改、字符串接合、I/O 操作以及搜索和查找。

函数名称
功能

构造函数
产生或复制字符串

析构函数
销毁字符串

=，assign
赋以新值

Swap
交换两个字符串的内容

**+ =，append( )，push_back()**
添加字符

insert ()
插入字符

erase()
删除字符

clear ()
移除全部字符

resize ()
改变字符数量

replace()
替换字符

**+**
串联字符串

==，！ =，<，<=，>，>=，**compare()**
比较字符串内容

**size()，length()**
返回字符数量

max_size ()
返回字符的最大可能个数

empty ()
判断字符串是否为空

capacity ()
返回重新分配之前的字符容量

reserve()
保留内存以存储一定数量的字符

**[ ],at()**
获取字符串元素

>>，getline()
从 stream 中读取某值

<<
将值写入 stream

copy()
将内容复制为一个 C - string

**c_str()**
将内容以 C - string 形式返回

data()
将内容以字符数组形式返回

substr()
返回子字符串

**find()**
搜寻某子字符串或字符

**rfind()**
逆向搜寻字符串或字符

**find_first_of()****find_last_of()**
搜寻第一个/最后一个匹配的字符串

begin( )，end()
提供正向迭代器支持

rbegin()，rend()
提供逆向迭代器支持

get_allocator()
返回配置器

### string 构造和析构函数

- 类构造函数

```cpp
string strs //生成空字符串
string s(str) //生成字符串str的复制品
string s(str, stridx) //将字符串str中始于stridx的部分作为构造函数的初值
string s(str, strbegin, strlen) //将字符串str中始于strbegin、长度为strlen的部分作为字符串初值
string s(cstr) //以C_string类型cstr作为字符串s的初值
string s(cstr,char_len)    //以C_string类型cstr的前char_len个字符串作为字符串s的初值
string s(num, c) //生成一个字符串，包含num个c字符
string s(strs, beg, end)    //以区间[beg, end]内的字符作为字符串s的初值
```

析构函数
`~string() //销毁所有内存，释放内存`

## 5 种序列容器
序列容器以线性序列的方式存储元素。它没有对元素进行排序，元素的顺序和存储它们的顺序相同。

- `array<T,N>` (数组容器) ：是一个长度固定的序列，有 N 个 T 类型的对象，不能增加或删除元素。
- `vector<T>` (向量容器) ：是一个长度可变的序列，用来存放 T 类型的对象。必要时，可以自动增加容量，但只能在序列的末尾高效地增加或删除元素。
- `deque<T>` (双向队列容器) ：是一个长度可变的、可以自动增长的序列，在序列的两端都不能高效地增加或删除元素。
- `list<T>` (链表容器) 是一个长度可变的、由 T 类型对象组成的序列，它以双向链表的形式组织元素，在这个序列的任何地方都可以高效地增加或删除元素。访问容器中任意元素的速度要比前三种容器慢，这是因为 `list<T>` 必须从第一个元素或最后一个元素开始访问，需要沿着链表移动，直到到达想要的元素。
- `forward list<T>` (正向链表容器) ：是一个长度可变的、由 T 类型对象组成的序列，它以单链表的形式组织元素，是一类比链表容器快、更节省内存的容器，但是它内部的元素只能从第一个元素开始访问。

### 常用函数成员
函数成员 array vector deque
begin() - 返回幵始迭代器 是 是 是
end() - 返回结束迭代器 是 是 是
rbegin() - 返回反向’开始迭代器 是 是 是
rend() - 返回反向结束迭代器 是 是 是
cbegin() - 返 M const 开始迭代器 是 是 是
cend() - 返回 const 结束迭代器 是 是 是
crbegin() - 返回 const 反向开始迭代器 是 是 是
crend() - 返回 const 反向结束迭代器 是 是 是
assign() - 用新元素替换原有内容 - 是 是
operator=() - 复制同类型容器的元素，或者用初始化列表替换 现有内容 是 是 是
size() - 返回实际元素个数 是 是 是
max_size() - 返回元素个数的设大值 是 是 是
capacity() - 返回当前容量 - 是 -
empty() - 返回 true,如果容器中没有元素的话 是 是 是
resize() - 改变实际元素的个数 - 是 是
shrink _to_fit() - 将内存减少到等于当前元素实际所使用的大小 - 是 是
front() - 返回第一个元素的引用 是 是 是
back() - 返回铖后一个元素的引用 是 是 是
operator - 使用索弓丨访问元素 是 是 是
at() - 使用经过边界检査的索引访问元素 是 是 是
push_back() - 在序列的尾部添加一个元素 - 是 是
insert() - 在指定的位置插入一个或多个元素 - 是 是
emplace() - 在指定的位置直接生成一个元素 - 是 是
emplace_back() - 在序列尾部生成一个元素 - 是 是
pop_back() - 移出序列尾部的元素 - 是 是
erase() - 移出一个元素或一段元素 - 是 是
clear() - 移出所苻的元素，容器大小变为 0 - 是 是
swap() - 交换两个容器的所有元素 是 是 是
data() - 返回包含元素的内部数组的指针 是 是 -

函数成员 list forward list
begin() - 返回开始迭代器 是 是
end() - 返回结束迭代器 是 是
rbegin() - 返回反向开始迭代器 是 -
rend() - 返回反向结束迭代器 是 -
cbegin() - 返回 const 开始结束迭代器 是 是
before_begin() - 返回一个指向第一个元素前一个位置的迭代器 - 是
cbefore_begin() - 返回一个指向第一个元素前一个位置的 const 迭代器 - 是
cend() - 返回 const 结束迭代器 是 是
crbegin() - 返回 const 反向开始迭代器 是 -
crend() - 返回 const 反向结束迭代器 是 -
assign() - 用新元素替换原有内容 是 是
operator=() - 复制同类型容器的元素，或者用初始化列表替换现有内容 是 是
size() - 返回实际元素个数 是 -
max_size() - 返回元素个数的最大值 是 是
resize() - 改变实际元素的个数 是 是
empty() - 返回 true，如果容器中没有元素的话 是 是
from() - 返回第一个元素的引用 是 是
back() - 返回最后一个元素的引用 是 -
push_back() - 在序列的潘部添加一个元素 是 -
push_front() - 在序列的起始位置添加一个元素 是 是
emplace() - 在指矩位置直接生成一个元素 是 -
emplace_after() - 在指定位置的后面直接生成一个元素 - 是
emplace_back() - 在序列尾部生成一个元素 是 -
cmplacc_front() - 在序列的起始位生成一个元索 是 是
insert() - 在指定的位置插入一个或多个元素 是 -
insert_after() - 在指定位置的后面插入一个或多个元素 - 是
pop_back() - 移除序列尾部的元素 是 -
pop_front() - 移除序列头部的元素 是 是
reverse()-反向元素的顺序 是 是
erase() - 移除指定位置的一个元素或一段元素 是 -
erase_after() - 移除指定位 1；后面的一个元素或一段元素 - 是
remove() - 移除所苻和参数匹配的元素 是 是
remove_if() - 移除满足一元函数条件的所有元素 是 是
unique() - 移除所有连续重复的元素 是 是
clear() - 移除所有的元素，容器大小变为 0 是 是
swap() - 交换两个容器的所有元素 是 是
sort() - 对元素进行排序 是 是
merge() - 合并两个有序容器 是 是
splice() - 移动指定位置前面的所有元素到另一个同类型的 list 中 是 -
splice_after() - 移动指定位置后面的所有元素到另一个同类型的 list 中 - 是

### 具体使用
array：`std::array<typename, 100> data {};`

- 通过调用数组对象的成员函数 fill()，可以将所有元素设成给定值 `data.fill(0.0);`
获取元素 `data[num]`

- 为了获取时能够检查越界索引值，可以使用成员函数 at()，当传给 at() 的索引是一个越界值时，这时会抛出 std::out_of_rang 异常 `data.at(num)`

vector：`std::vector<typename> values(num) {1,2,3,...};`

- 通过调用 reserve() 来增加容器的容量 `values.reserve(20)`
- 通过调用成员函数 resize() 可以改变容器大小 `values.resize(size, num)`
使用 push_back()、insert()、emplace() 或 emplace_back() 函数来添加一个元素
`values.push_back()` //使用时会调用构造函数和拷贝构造函数
`values.emplace_back()` // 不需要触发构造函数和拷贝构造函数
` `
- front() 和 back() 分別返回序列中第一个和最后一个元素的引用 `values.front()`
- data() 返回指向数组的指针 `values.data()`

### 迭代器

迭代器
`auto first = std::begin(data);`
`auto last = std::end (data);`

## 3 种容器适配器
容器适配器是一个封装了序列容器的类模板，它在一般序列容器的基础上提供了一些不同的功能。

- `stack<T>`：是一个封装了 `deque<T>` 容器的适配器类模板，默认实现的是一个后入先出（Last-In-First-Out，LIFO）的压入栈。`stack<T>`· 模板定义在头文件 stack 中。
- `queue<T>`：是一个封装了 `deque<T>` 容器的适配器类模板，默认实现的是一个先入先出（First-In-First-Out，LIFO）的队列。可以为它指定一个符合确定条件的基础容器。`queue<T>` 模板定义在头文件 queue 中。
- `priority_queue<T>`：是一个封装了 `vector<T>` 容器的适配器类模板，默认实现的是一个会对元素排序，从而保证最大元素总在队列最前面的队列。`priority_queue<T>` 模板定义在头文件 queue 中。

## 4 种 map 容器
`map<K，T>`容器，保存的是 `pair<const K，T>` 类型的元素。`pair<const K,T>` 封装了一对键对象，键的类型是 K，对象的类型是 T。每个键都是唯一的，所以不允许有重复的键；但可以保存重复的对象，只要它们的键不同。map 容器中的元素都是有序的，元素在容器内的顺序是通过比较键确定的。默认使用 less 对象比较。
multimap 容器和 map 容器类似，也会对元素排序。它的键必须是可比较的，元素的顺序是通过比较键确定的。和 map 不同的是，multimap 允许使用重复的键。因此，一个 multimap 容器可以保存多个具有相同键值的  元素。
unordered_map 中 pair< const K，T>元素的顺序并不是直接由键值确定的，而是由键值的哈希值决定的。哈希值是由一个叫作哈希的过程生成的整数，本章后面会解释这一点。unordered_map不允许有重复的键。
unordered_multimap 也可以通过键值生成的哈希值来确定对象的位置，但它允许有重复的键。

## set 容器
set 容器是关联容器，其中的对象是对象它们自己的键

## 随机数
## 流迭代器
## 数值、时间和复数
## C++常用算法和 algorithm 库

---

参考资料
[C 语言中文网](http://c.biancheng.net/stl/)
C++ Primer Plus 第 6 版中文版
学校教材