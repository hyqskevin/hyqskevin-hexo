---
title: c++中的智能指针
date: 2019-04-05 00:00:00
categories:
  - code
tags:
  - c++
---

由于 C++ 语言没有自动内存回收机制，程序员每次 new 出来的内存都要手动 delete，用智能指针便可以有效缓解这类问题。

对于编译器来说，智能指针实际上是一个栈对象，并非指针类型，在栈对象生命期即将结束时，智能指针通过析构函数释放有它管理的堆内存。所有智能指针都重载了“operator->”操作符，直接返回对象的引用，用以操作对象。访问智能指针原来的方法则使用“.”操作符。

访问智能指针包含的裸指针则可以用 get() 函数

智能指针包含了 reset() 方法，如果不传递参数（或者传递 NULL），则智能指针会释放当前管理的内存。如果传递一个对象，则智能指针会释放当前对象，来管理新传入的对象。

- 编写测试类来辅助分析

```cpp
class Simple {
 public:
  Simple(int param = 0) {
    number = param;
    std::cout "Simple: " std::endl;
  }
 
  ~Simple() {
    std::cout "~Simple: " std::endl;
  }

  void PrintSomething() {
    std::cout "PrintSomething: " std::endl;
  }

  std::string info_extend;
  int number;
};
```
## std::auto_ptr
包含头文件 `#include<memory>` 便可以使用
`std::auto_ptr` 能够方便的管理单个堆内存对象

用法一：
`std::auto_ptr<MyClass>m_example(new MyClass());`

用法二：
`std::auto_ptr<MyClass>m_example;`
`m_example.reset(new MyClass());`

用法三（指针的赋值操作）：
`std::auto_ptr<MyClass>m_example1(new MyClass());`
`std::auto_ptr<MyClass>m_example2(new MyClass());`
`m_example2=m_example1;`

### 使用示例
```cpp
void TestAutoPtr() {
  std::auto_ptr my_memory(new Simple(1));   // 创建对象
  if (my_memory.get()) {             // 判断智能指针是否为空
    my_memory->PrintSomething();  // 使用 operator-> 调用智能指针对象中的函数
    my_memory.get()->info_extend = "Addition"; // 使用 get() 返回裸指针，然后给内部对象赋值
    my_memory->PrintSomething();               // 再次打印，表明上述赋值成功
    (*my_memory).info_extend += " other";      // 使用 operator 返回智能指针内部对象，然后用“.”调用智能指针对象中的函数
    my_memory->PrintSomething();               // 再次打印，表明上述赋值成功
  }
}                          // my_memory 栈对象即将结束生命期，析构堆对象 Simple(1)
```

执行结果为：
Simple: 1
PrintSomething:
PrintSomething: Addition
PrintSomething: Addition other
~Simple: 1

### 不能使用 = 操作符
```cpp
void TestAutoPtr2() {
  std::auto_ptr my_memory(new Simple(1));
  if (my_memory.get()) {
    std::auto_ptr my_memory2;   // 创建一个新的 my_memory2 对象
    my_memory2 = my_memory;             // 复制旧的 my_memory 给 my_memory2
    my_memory2->PrintSomething();       // 输出信息，复制成功
    my_memory->PrintSomething();        // 崩溃
  }
}
```
`my_memory2 = my_memory`这行代码，my_memory2 完全夺取了 my_memory 的内存管理所有权，导致 my_memory 悬空，最后使用时导致崩溃。

### release() 函数问题
```cpp
void TestAutoPtr3() {
  std::auto_ptr my_memory(new Simple(1));
  if (my_memory.get()) {
    my_memory.release();
  }
}                          //最终执行结果为 Simple：1，没有被析构，导致内存泄露
```
调用 release() 函数释放内存，不会释放对象，仅仅归还所有权，要自己 delete 或使用 reset()函数销毁对象

```cpp
//代码修正
void TestAutoPtr3() {
  std::auto_ptr my_memory(new Simple(1));
  if (my_memory.get()) {
    Simple* temp_memory = my_memory.release();
    delete temp_memory;
    // 或者直接 my_memory.reset();  释放 my_memory 内部管理的内存
  }
}
```

注意事项
使用 std::auto_ptr 时，**绝对不能使用“operator=”操作符**，这会夺取内存管理所有权
std::auto_ptr 的 release() 函数不会释放对象，仅仅归还所有权。
std::auto_ptr 最好不要当成参数传递（读者可以自行写代码确定为什么不能）。
std::auto_ptr 的“operator=”问题，有其管理的对象不能放入 std::vector 等容器中。
C++11 中，std::auto_ptr 已经被弃用

---

自 C++11 起，C++标准提供两大类型的智能指针：shared_ptr 和 unique_ptr

---

## std::shared_ptr
shared_ptr 实现共享式拥有（shared ownership）概念。**多个智能指针可以指向相同对象**，该对象和其相关资源会在“最后一个引用（reference）被销毁”时候释放。为了在结构复杂的情境中执行上述工作，标准库提供了 weak_ptr、bad_weak_ptr 和 enable_shared_from_this 等辅助类。

shared_ptr 本身提供默认内存释放器（default deleter），调用的是 delete，也可以自定义释放器

默认内存释放器并**不能释放数组内存空间**，要我们自己提供内存释放器

成员函数
use_count 返回引用计数的个数
unique 返回是否是独占所有权( use_count 为 1)
swap 交换两个 shared_ptr 对象(即交换所拥有的对象)
reset 放弃内部对象的所有权或拥有对象的变更, 会引起原有对象的引用计数的减少
get 返回内部对象(指针)

示例

```cpp
std::shared_ptrint> sp0(new int(2));
std::shared_ptrint> sp1(new int(11));
std::shared_ptrint> sp2 = sp1;
printf("%d\n", *sp0);               // 2
printf("%d\n", *sp1);               // 11
printf("%d\n", *sp2);               // 11
sp1.swap(sp0);
printf("%d\n", *sp0);               // 11
printf("%d\n", *sp1);               // 2
printf("%d\n", *sp2);               // 11

std::shared_ptrint> sp3(new int(22));
std::shared_ptrint> sp4 = sp3;     // 或 auto sp4 = sp3
printf("%d\n", *sp3);               // 22
printf("%d\n", *sp4);               // 22
sp3.reset();
printf("%d\n", sp3.use_count());    // 0
printf("%d\n", sp4.use_count());    // 1
printf("%d\n", sp3);                // 0
```

注意事项
shared_ptr 会因循环引用造成无法释放资源
与 weak_ptr 一起工作时, weak_ptr 在使用前需要检查合法性
shared_ptr 不支持数组, 如果使用数组, 需要自定义删除器

## std::weak_ptr
weak_ptr 设计的目的是为配合 shared_ptr 而引入的一种智能指针来协助 shared_ptr 工作, 它只可以从一个 shared_ptr 或另一个 weak_ptr 对象构造, 它的构造和析构不会引起引用记数的增加或减少。

weak_ptr 没有重载*和->但可以使用 lock 获得一个可用的 shared_ptr 对象. 注意, weak_ptr 在使用前需要检查合法性。

weak_ptr 支持拷贝或赋值, 但不会影响对应的 shared_ptr 内部对象的计数。

成员函数
expired 用于检测所管理的对象是否已经释放, 如果已经释放, 返回 true; 否则返回 false
lock 用于获取所管理的对象的强引用(shared_ptr). 如果 expired 为 true, 返回一个空的 shared_ptr; 否则返回一个 shared_ptr, 其内部对象指向与 weak_ptr 相同。
use_count 返回与 shared_ptr 共享的对象的引用计数.
reset 将 weak_ptr 置空.

使用 weak_ptr 解决 shared_ptr 因循环不能释放资源的问题
使用 shared_ptr 时, shared_ptr 为强引用, 如果存在循环引用, 将导致内存泄露. 而 weak_ptr 为弱引用, 可以避免此问题

```cpp
class CA
{
public:
    CA(){}
    ~CA(){PRINT_FUN();}
private:
    std::weak_ptr m_spb;
};

class CB
{
public:
    CB(){};
    ~CB(){PRINT_FUN();};
private:
    std::shared_ptr m_spa;
};

std::shared_ptr spa(new CA);  // 通过调用weak_ptr，释放CA内存时不影响CB
std::shared_ptr spb(new CB);
```
## std::unique_ptr
unique_ptr 实现独占式拥有（exclusive ownership）或严格拥有（strict ownership）概念，保证同一时间内只有一个智能指针可以指向该对象。它对于避免资源泄露（resourece leak）——例如“以 new 创建对象后因为发生异常而忘记调用 delete”——特别有用。

unique_ptr 不支持拷贝和赋值，但是可以调用 release 或 reset 将指针的所有权从一个(非 const) unique_ptr 转移到另一个
`std::unique_ptr<A> up1(new A(5));`
`std::unique_ptr<A> up2(up1);` // 错误, unique_ptr 不支持拷贝
`std::unique_ptr<A> up2 = up1;` // 错误, unique_ptr 不支持赋值
`std::unique_ptr<int> up2(up1.release());` // 正确

unique_ptr 不支持拷贝, 但是可以从函数中返回, 甚至返回局部对象

```cpp
std::unique_ptr Clone(const Ty& obj)
{
　std::unique_ptr temp = std::unique_ptr(new Ty(obj));
　return temp;
  // 或直接 return std::unique_ptr(new Ty(obj))
}
```
unique_ptr 支持管理数组

成员函数
get 获得内部对象的指针
release 放弃内部对象的所有权，将内部指针置为空, 返回所内部对象的指针, 此指针需要手动释放
reset 销毁内部对象并接受新的对象的所有权(如果使用缺省参数的话，也就是没有任何对象的所有权, 此时仅将内部对象释放, 并置为空)
swap 交换两个 shared_ptr 对象(即交换所拥有的对象)
std::move(name) 所有权转移(通过移动语义), 所有权转移后，变成“空指针”

防内存泄漏代码改进

```cpp
int main()
{
  int *ptr = new int(0);
  return 0;
}  // 内存泄露
```
```cpp
int main()
{
  int *ptr = new int(0);
  delete ptr;  // 释放内存
  return 0;
}  // ptr成空悬指针
```
```cpp
int main()
{
  int *ptr = new int(0);
  delete ptr;  // 释放内存
  ptr = nullptr;
  return 0;
}
```
```cpp
//使用 unique_ptr
int main()
{
  unique_ptrint> ptr(new int(0));
  return 0;
}
```

---

## boost::scoped_ptr
## boost::shared_ptr
## boost::scoped_array
## boost::shared_array
## boost::weak_ptr
## boost:: intrusive_ptr
参考资料：
[https://blog.csdn.net/xt_xiaotian/article/details/5714477](https://blog.csdn.net/xt_xiaotian/article/details/5714477)
[https://www.cnblogs.com/xiehongfeng100/p/4645555.html](https://www.cnblogs.com/xiehongfeng100/p/4645555.html)
[https://www.cnblogs.com/diysoul/p/5930361.html](https://www.cnblogs.com/diysoul/p/5930361.html)
[https://www.cnblogs.com/diysoul/p/5930372.html](https://www.cnblogs.com/diysoul/p/5930372.html)
[https://www.cnblogs.com/diysoul/p/5930388.html](https://www.cnblogs.com/diysoul/p/5930388.html)