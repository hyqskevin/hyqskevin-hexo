---
title: c++ 面向对象的一些特性
date: 2019-03-25 00:00:00
categories:
  - code
tags:
  - c++
---

-基础笔记-(loading…)
C++面向对象编程知识点复习梳理，包括类、继承、重载、多态、数据抽象、数据封装、接口

## 类和对象
### 类访问修饰符
public
公有成员在程序中类的外部是可访问的。您可以不使用任何成员函数来设置和获取公有变量的值

private
私有成员变量或函数在类的外部是不可访问的，甚至是不可查看的。只有类和友元函数可以访问私有成员
默认情况下，类的所有成员都是私有的
一般会在私有区域定义数据，在公有区域定义相关的函数

protected
保护成员在派生类（即子类）中是可访问的

### 构造函数,拷贝构造函数和析构函数
创建、初始化和删除所创建的对象时调用
构造函数的名称与类的名称是完全相同的，不会返回任何类型，也不会返回 void。构造函数可用于为某些成员变量设置初始值
拷贝构造函数是一种特殊的构造函数，在创建对象时，是使用同一类中之前创建的对象来**初始化新创建的对象**。如果类带有指针变量，并有动态内存分配，则它必须有一个拷贝构造函数
析构函数的名称与类的名称是完全相同的，不会返回任何值，也不能带有任何参数。析构函数有助于在跳出程序（比如关闭文件、释放内存等）前释放资源

```cpp
class Classname{
public:
  Classname();  //构造函数
  Classname(const Classname &obj);  //拷贝构造函数
  ~Classname();  //析构函数

private:
  int *ptr;
}

Classname::Classname(){
  cout"调用构造函数"endl;
  *ptr = new int;  //指针分配内存
}

Classname::Classname(const Classname &obj){
  cout"调用拷贝构造函数"endl;
  *ptr = *obj.ptr;  //指针分配内存
}

CLassname::~Classname(){
  cout"释放内存"endl;
  delete ptr;
}
```
一个类如果有多个字段 X、Y、Z 等需要进行初始化，可以使用如下语法

```cpp
Classname::objname( double a, double b, double c): X(a), Y(b), Z(c)
{
  ....
}
```
#### 浅拷贝和深拷贝
浅拷贝：如果没有拷贝构造函数，编译器自动产生一个“默认拷贝构造函数”，使用“老对象”的数据成员的值对“新对象”的数据成员进行赋值
当对象存在动态成员，那么浅拷贝就会出问题，在销毁对象时，两个对象的析构函数将对同一个内存空间释放两次，出现错误

深拷贝：对象中动态成员重新动态分配空间

```cpp
class Classname{
public:
  Classname(){
    p = new int(100);
    }
  Classname(const Classname& r){
    p = new int(100);  //重新分配动态空间
    *p = *(r.p);  //指针分配内存
    }
  ~Classname(){
    delete p;
    }
};
```
### 友元函数
定义在类外部，用来访问类的 private 和 protected 成员
可以不使用范围解析运算符 `::` 定义该函数

```cpp
friend class Classname;  //友元类
friend void objname();  //友元函数
```
### 内联函数
通过内联函数，编译器试图在调用函数的地方扩展函数体中的代码，即把该函数的代码副本放置在每个调用该函数的地方
类定义中的定义的函数都是内联函数，即使没有使用 inline 说明符

### this 指针
每一个对象都能通过 `this` 指针来访问自己的地址
友元函数没有 `this` 指针，因为友元不是类的成员

### 类指针
一个指向 C++ 类的指针与指向结构的指针类似，访问指向类的指针的成员，需要使用成员访问运算符 `->`，就像访问指向结构的指针一样。与所有的指针一样，您必须在使用指针之前，对指针进行初始化。

```cpp
class Box
{
   public:
     func(){}
     ...
   private:
     ...
};

Box *ptrBox;
ptrBox->func();
```
### 静态成员
变量和函数都可以被声明为静态的

声明类的成员为静态时，这意味着无论创建多少个类的对象，静态成员都只有一个副本。静态成员在类的所有对象中是共享的
不能把静态成员的初始化放置在类的定义中，但是可以在类的外部通过使用范围解析运算符 :: 来重新声明静态变量从而对它进行初始化

把函数成员声明为静态的，就可以把函数与类的任何特定对象独立开来。静态成员函数即使在类对象不存在的情况下也能被调用，静态函数只要使用类名加范围解析运算符 :: 就可以访问。
静态成员函数没有 this 指针，只能访问静态成员（包括静态成员变量和静态成员函数）

```cpp
class Box
{
   public:
      static int objectCount;

      static int getCount()
      {
         return objectCount;
      }
   private:
      ...
};

// 初始化类 Box 的静态成员
int Box::objectCount = 0;
output = Box::getCount()
```
## 存储类
存储类定义 C++ 程序中变量/函数的范围（可见性）和生命周期。这些说明符放置在它们所修饰的类型之前

auto 关键字用于两种情况：声明变量时根据初始化表达式自动推断该变量的类型、声明函数时函数返回值的占位符

register(C++ 11 弃用) 存储类用于定义存储在寄存器中而不是 RAM 中的局部变量。这意味着变量的最大尺寸等于寄存器的大小（通常是一个词），且不能对它应用一元的 ‘&’ 运算符（因为它没有内存位置）

static 存储类指示编译器在程序的生命周期内保持局部变量的存在，而不需要在每次它进入和离开作用域时进行创建和销毁。因此，使用 static 修饰局部变量可以在函数调用之间保持局部变量的值

extern 存储类用于提供一个全局变量的引用，全局变量对所有的程序文件都是可见的。当您使用 ‘extern’ 时，对于无法初始化的变量，会把变量名指向一个之前定义过的存储位置。

当有多个文件且定义了一个可以在其他文件中使用的全局变量或函数时，可以在其他文件中使用 extern 来得到已定义的变量或函数的引用。

mutable 说明符仅适用于类的对象，它允许对象的成员替代常量。也就是说，mutable 成员可以通过 const 成员函数修改。

thread_local 说明符声明的变量仅可在它在其上创建的线程上访问，变量在创建线程时创建，并在销毁线程时销毁。 每个线程都有其自己的变量副本。

thread_local 说明符可以与 static 或 extern 合并。

## 继承
依据另一个类来定义一个类，这使得创建和维护一个应用程序变得更容易。这样做，也达到了重用代码功能和提高执行时间的效果。

当创建一个类时，不需要重新编写新的**数据成员和成员函数**，只需指定新建的类继承了一个已有的类的成员即可。这个已有的类称为**基类**，新建的类称为**派生类**。

派生类可以访问基类中所有的**非私有成员**。因此基类成员如果不想被派生类的成员函数访问，则应在基类中声明为 private。

`class derived-class: (public/protected/private) base-class`

```cpp
// 基类
class Shape
{
   public:
      void setWidth(int w)
      {
         width = w;
      }
      void setHeight(int h)
      {
         height = h;
      }
   protected:
      int width;
      int height;
};

// 派生类
class Rectangle: public Shape
{
   public:
      int getArea()
      {
         return (width * height);
      }
};
```
### 多继承
多继承即一个子类可以有多个父类，它继承了多个父类的特性，C++ 类可以从多个类继承成员

```c
class :1>1>,2>2>,…
{

};
```
```cpp
// 基类 Shape
class Shape
{
   public:
      void setWidth(int w)
      {
         width = w;
      }
      void setHeight(int h)
      {
         height = h;
      }
   protected:
      int width;
      int height;
};

// 基类 PaintCost
class PaintCost
{
   public:
      int getCost(int area)
      {
         return area * 70;
      }
};

// 派生类
class Rectangle: public Shape, public PaintCost
{
   public:
      int getArea()
      {
         return (width * height);
      }
};
```
### 虚继承：解决多继承中出现的问题
从不同途径继承来的同名的数据成员在内存中有不同的拷贝造成数据不一致问题，将共同基类设置为虚基类。

虚继承在创建对象的时候会创建一个虚表，从不同的路径继承过来的同名数据成员在内存中就只有一个拷贝，同一个函数名也只有一个映射。

这样不仅就解决了二义性问题，也节省了内存，避免了数据不一致的问题。

```c
class 派生类: virtual 方式1 基类1，virtual 方式2 基类2，...

{

...//派生类成员声明

};
```
```cpp
class D{......};
class A: virtual public D{......};
class B: virtual public D{......};
class C: public B, public A{.....};
```
### 派生类无法从基类继承
基类的构造函数、析构函数和拷贝构造函数
基类的重载运算符
基类的友元函数

## 重载
C++ 允许在同一作用域中的某个函数和运算符指定多个定义，分别称为函数重载和运算符重载。

编译器通过把使用的参数类型与定义中的参数类型进行比较，决定选用最合适的定义。选择最合适的重载函数或重载运算符的过程，称为重载决策。

### 运算符重载
重定义或重载大部分 C++ 内置的运算符，使用自定义类型的运算符。

重载的运算符是带有特殊名称的函数，函数名是由关键字 operator 和其后要重载的运算符符号构成的。与其他函数一样，重载运算符有一个返回类型和一个参数列表。

`Box operator+(const Box& b); // 重载+运算符`

### 函数重载
同一个类中，声明几个功能类似的同名函数，但是这些同名函数的形式参数（指参数的个数、类型或者顺序）必须不同。您不能仅通过返回类型的不同来重载函数。

```cpp
public:
void print(int i) {
  cout "整数为: " endl;
}

void print(double  f) {
  cout "浮点数为: " endl;
}

void print(char c[]) {
  cout "字符串为: " endl;
}
```
## 多态
4.2“覆盖”是指派生类函数覆盖基类函数，特征是：
（1）不同的范围（分别位于派生类与基类）；
（2）函数名字相同；
（3）参数相同；
（4）基类函数必须有 virtual 关键字。

4.3“隐藏”是指派生类的函数屏蔽了与其同名的基类函数，特征是：

（1）如果派生类的函数与基类的函数同名，但是参数不同，此时，不论有无 virtual 关键字，基类的函数将被隐藏（注意别与重载混淆）。
（2）如果派生类的函数与基类的函数同名，但是参数相同，但是基类函数没有 virtual 关键字。此时，基类的函数被隐藏（注意别与覆盖混淆）。

## 数据抽象
## 数据封装
## 接口

---

参考资料：
[http://c.biancheng.net/cplus/](http://c.biancheng.net/cplus/)
w3school