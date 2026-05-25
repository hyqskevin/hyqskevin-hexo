---
title: PHP & MySQL learning notes (2)
date: 2018-11-05 00:00:00
categories:
  - code
tags:
  - php
---

-基础笔记-
慕课网 PHP 基础语法巩固(2) 课堂笔记，包含基本语法，变量和数据和函数等细碎的摘要

PHP 使用环境和 IDE

- **LAMP(build)**: Linux+Apache+MySQL+PHP
- LNMP: Linux+Nginx+MySQL+PHP
- LNMPA: Linux+Nginx+MySQL+PHP+Apache
- **WAMP(build)**: Window+Apache+MySQL+PHP
- 集成环境: **xampp**, wampserver, phpstudy
- IDE: **vscode**,Atom, Sublime Text3, PHPStorm, ZendStudio

## 基础语法

标准风格：`<?php 代码段; ?>`
如果文档中只有 PHP 代码，结束标记要省略掉
如果文档中不只有 PHP 代码，一定要保证 PHP 的开始和结束标记成对出现，可以出现任意位置，任意多次都可以

短风格：`<? 代码段; ?>`
需要配置 PHP 配置文件 php.ini 中 short_open_tag=On,重启 Apache 服务器即可

ASP 风格：`<% 代码段; %>`
需要配置 PHP 配置文件 php.ini 中 asp_tags=On,重启 Apache 服务器即可

## 常量 & 变量
### 定义常量

- define($name, $value)
const NAME=值
</br>
常量名称不加$
常量名称最好大写，以字母或者下划线开始
常量默认区分大小写
常量作用域是全局
常量一经定义，在脚本执行期间是不能改变的
常量的值可以是标量类型，也可以是数组
</br>

```php
- constant($name)  //根据常量的名称获取常量的值
- defined($name)  //检测常量名称是否存在，如果存在返回true，否则返回false
- get_defined_constants()  //返回的是包含系统常量和自定义常量的数组
```
### 魔术常量
`__LINE__` //得到当前的行号
`__FILE__` //得到当前文件的完整绝对路径和文件名
`__DIR__` //得到文件的完整绝对路径
`__FUNCTION__` //得到当前函数的名称
`__CLASS__` //得到当前类的类名
`__METHOD__` //得到当前类的方法名称
`__TRAIT__` //得到当前的 TRAIT 名称
`__NAMESPACE__` //得到当前明明空间的名称

### 定义变量

- 通过美元$变量名称来表示变量
- PHP 是弱类型语言，可以声明变量在使用，也可以不声明，可以一次声明一个，也可以一次声明多个

### 变量命名法

驼峰标记法
小骆驼: firstName,lastName,zendControllerFront
大骆驼: irstName,LastName,ZendControllerFront

下划线法
first_name,last_name,zend_controller_front

### 预定义变量
`$GLOBALS` //超全局变量，包含以下所有的预定义变量
`$_SERVERS` //服务器和执行环境信息变量
`$_ENV` //环境变量
`$_COOKIE` //HTTP Cookies
`$_SESSION` //HTTP Session 变量
`$_FILES` //文件上传信息变量
`$_GET['名称']` //主要接收以?形式传递的数据，像表单以 get 形式发送数据，包括像超链接典型的?形式传递参数
`$_POST['名称']` //主要接收表单以 post 形式发送的数据
`$_REQUEST` //$_GET+$_POST+$_COOKIE

## 数据类型 & 转换
### 临时转换
整型: (int)$变量名称|(integer)$变量名称
浮点型: (float|double|real)$变量名称
字符型: (string)$变量名称
布尔型: (bool|boolean)$变量名称
空: (unset)$变量名称
数组: (array)$变量名称
对象: (object)$变量名称

**通过系统函数实现**
intval($var)  //返回变量转换成整型之后的值
floatval($var)|doubleval($var)  //返回变量转换成浮点型的值
strval($var) //返回变量转换成字符串的值
boolval($var) //返回变量转换成布尔类型的值

### 永久转换
settype($var,$type) //设置变量的类型
gettype($var) //返回变量的类型

## 函数
### 函数变量
局部变量

- 局部动态变量: 变量只在函数内部执行，执行完毕则被销毁
- 局部静态变量: 在函数内部设置 static 时，执行完毕变量不被销毁

全局变量: 使用 global，在函数内部定义全局变量，当函数执行时先调用函数外面已经定义好的变量再执行，如函数内部有重复定义相同变量不同值，执行出的是函数内部修改过的值

### 参数传递

- 值传递: 在函数内部修改变量的值的情况下，在函数调用时调用函数外部的变量，值不变
引用传递: 在函数内部修改变量的值的情况下，在函数调用时，函数的参数前面加一个&符号，值发生改变

**在对象中，不加&符号，对象的值也会发生改变**
**堆内存: 存放占用内存比较大的，如对象 new xxx()**
**栈内存: 存放基本类型 $obj**

可变参数列表
func_num_args：实参个数；
func_get_arg：返回某一个实参，必须事实参数组的索引；
func_get_args：返回实参数组;
可以返回整型，字符串型，数组等数据类型

### 复杂函数类型
可变函数：通过变量改变函数的名字并调用，让函数的调用更具有多样性

匿名函数：
使用变量 = function(){}; ，调用时也是用变量加小括号来进行调用，**变量后面要加上分号结尾**
声明一个函数不给函数起名字，用来以后做回调函数时用

**嵌套函数访问外部局部变量：变量名 1 = function() use ($变量名 2){};**

### 系统库函数
```php
int strlen(string $str)  //返回字符串长度
string strtolower(string $str)  //转换成小写
string strtoupper(string $str)  //转换成大写
string ucfirst(string $str)  //句首字母转换成大写
string ucwords(string $str)  //每个单词首字母转换成大写
mixed str_replace(mixed $search, mixed replace, mixed $subject, [int &$count])  //实现字符替换，区分大小写
mixed str_ireplace(mixed $search, mixed replace, mixed $subject, [int &$count]) //实现字符替换，不区分大小写
float floor(float $svalue)  //舍去
float ceil(float $svalue)  //进位
int mt_rand(int $min, int $max)  //随机数，比rand()更好
```
## 数组
### 创建数组

- 通过 array()形式

array()空数组
array(值,…)下标连续的索引数组，下标从 0 开始
array(键名=>键值,…)指定下标的索引数组、关联数组、混合数组
通过[]的形式定义数组，代替 array()

- 通过[ ]动态创建

```bash
$数组名称[]=值  //下标连续的索引数组
$数组名称[键名]=值  //指定下标的索引数组和关联数组
```

- 通过 range()和 compact()快速创建

range() //快速创建下标连续的索引数组
compact() //快速创建关联数组,只能写已经存在的变量名称，不能加$

- 通过 define(), const 定义常量数组

### 数组转换
临时转换: (array)$var
永久转换: settype($var,$type)

### 数组运算符
`+` 合并数组，如果键名相同，使用前面数组的键值
`==` 只比较键名和键值是否相同，如果相同返回 true，否则返回 false
`===` 既要比较键名和键值是否相同，还要比较类型和顺序

### 数组遍历
#### 通过 foreach 遍历数组
```php
foreach($数组名称 as $val){循环体;}  //只要键值
foreach($数组名称 as $key=>$val){循环体;}  //既要键名又要键值
foreach($数组名称 as $key=>&$val){循环体;}  //引用传递
```
[深入理解 PHP 原理之 foreach](http://www.laruence.com/2008/11/20/630.html)

**可以通过:和 endforeach 代替{ }**

**PHP7 中 foreach 的改变**

- foreach 遍历对数组内部指针不再起作用
- 按照值进行遍历的时候，foreach 操作的值是数组的副本
- 按照引用进行遍历的时候，有更好的迭代特性，在遍历体内修改数组对遍历有影响

#### 通过指针函数遍历
key($array)  //得到当前指针所在位置的键名
current($array) //得到当前指针所在位置的键值
next($array)  //将数组指针向下移动一位，返回当前指针所在位置的键值，否则返回false
prev($array) //将数组指针向上移动一位，返回当前指针所在位置的键值，否则返回 false
end($array)  //将数组指针移动到末尾，返回当前指针所在位置的键值，否则返回false
reset($array) //将数组指针移动到开始，返回当前指针所在位置的键值，否则返回 false

#### 通过 each()和 list()函数遍历数组
each()
list()

### 数组库 API
#### 创建数组操作
```php
range($min,$max[,$step=1]):快速创建下标连续的索引数组
compact($varname,$varname...):快速创建关联数组
array_fill($start_index,$num,$value):用给定的值填充数组
array_fill_keys($keys,$value):使用指定的键和值填充数组
array_combine($keys,$values):创建一个数组，用一个数组的值作为其键名，另外一个值作为其键值
```
#### 键值相关操作
```php
count($var[,$mode=COUNT_NORMAL])/sizeof():计算数组中的单元数目或对象中的属性个数
array_keys($array):取得数组的键名作为下标连续的索引数组返回
array_values($array):取得数组的键值作为下标连续的索引数组返回
array_flip($array):交换数组中的键名和键值
in_array($search,$array[,$strict]):检测数组中是否存在某个值
array_search($search,$array[,$strict]):在数组中搜索给定的值，如果成功则返回相应的键名
array_key_exists($search,$array):检查给定的键名或索引是否存在于数组中
array_reverse($array[,$preserve_keys=false]):数组倒置
shuffle($array):打乱数组的元素
array_rand($array[,$num_req=1]):随机取出数组的键名
array_unique($array[,$sort_flag=SORT_STRING]):移除数组中重复的值
array_sum($array):统计数组中元素值的总和
array_product($array):计算数组中所有值的乘积
array_count_values($array):统计数组中值出现的次数
extract($array[,$extract_type=EXTR_OVERWRITE[,$prefix=null]]):从数组中将变量导入到当前的符号表
array_pad($array,$size,$value):用值将数组填补到指定长度
```
#### 数组指针函数
```php
key($array):得到当前指针所在位置元素的键名
current($array)|pos($array):得到当前指针所在位置元素的键值
next($array):将数组指针向下移动一位，并且返回当前指针所在位置元素的键值
prev($array):将数组指针向上移动一位，并且返回当前指针所在位置元素的键值
end($array):将数组指针移动倒数组的末尾，并且返回当前指针所在位置元素的键值
reset($array):将数组指针移动到数组的开始，并且返回当前指针所在位置元素的键值
each($array):返回数组中当前的键值对，并将数组指针向下移动一位
list($var,...):将数组中元素的值赋给对应的变量
array_unshift($array,$value...):在数组开头插入一个元素或者多个元素
array_shift($array):弹出数组的第一个元素
array_push($array,$value...):在数组末尾压入一个元素或者多个元素
array_pop($array):弹出数组的最后一个元素
```
#### 数组的排序函数
```php
sort($array[,$sort_flag=SORT_REGULAR]):对数组的键值按照升序排列，不保留键名
rsort($array[,$sort_flag=SORT_REGULAR]):对数组键值按照降序排列，不保留键名
asort($array[,$sort_flag=SORT_REGULAR]):对数组键值按照升序排列，保留键值对关系
arsort($array[,$sort_flag=SORT_REGULAR]):对数组键值按照降序排列，保留键值对关系
ksort($array[,$sort_flag=SORT_REGULAR]):对数组的键名按照升序排列
krsort($array[,$sort_flag=SORT_REGULAR]):对数组的键名按照降序排列
natsort($array):用自然排序法排序
natcasesort($array):用自然排序算法对数组进行不区分大小写字母的排序
array_multisort($arr[,$arg=SORT_STRING...]):对多个数组或多维数组进行排序
```
#### 数组的交集与差集
```php
array_diff($array1,$array2[...]):计算数组的差集
array_diff_assoc($array1,$array2[,...]):带索引检查计算数组的差集
array_intersect($array1,$array2[...]):计算数组的交集
array_intersect_assoc($array1,$array2[...]):带索引检查计算数组的交集
```
#### 数组的拆分与合并
```php
array_slice($array,$offset[$length=null[,$preserve_keys=false]]):截取数组
array_splice($array,$offset[,$length=0,$replacement]]):将数组中一部分去掉并用其它值替代
array_merge($arr1[,$arr2...]):合并数组
array_chunk($array,$size[,$preserve_keys=false]):将一个数组分割成多个
array_column($array,$column_key[,$index_key]):返回数组中指定的一列
```
## 错误及常用命令

- Parse error（解析错误）: syntax error(语法错误), unexpected ‘<’, expecting end of file
- Notice(通知): Undefined variable（未定义的变量）: sdkljflskdjflksdjflksdjfklj
- Catchable fatal(致命) error: Object of class stdClass could not be converted to string
Warning(警告): settype(): Invalid(非法) type
</br>

```php
header('content-type:text/html;charset=utf-8');
date_defalut_timezone_set('PRC');

echo($var,....)  //输出一个或者多个字符串
var_dump($var)  //打印变量的详细信息,可以一次打印一个或者多个变量的详细信息
print_r($var)  //打印数组的信息
unset($var,...)  //销毁变量，可以一次销毁一个或者多个，销毁之后变量的值为null
time()  //返回当前的 Unix 时间戳

is_[int|float|double|bool...]($var)  //判断变量的类型
isset()  //检测变量是否存在
function_exists()  //判断函数谁否存在
file_exists()  //判断文件是否存在
$var = file_get_contents($filename)  //得到文件中的内容，返回的是字符串

serialize()  //产生一个可存储的值的表示
unserialize()  //从已存储的表示中创建 PHP 的值
setcookie(string $name, string $value, int $expire = 0, string $path = "", string $domain = "")  //设置coockie：$name名称 $value值 $expire生命周期 $path可用路径 $domain可用域名范围
$var = strip_tags()  //从字符串中去除 HTML 和 PHP 标记
```