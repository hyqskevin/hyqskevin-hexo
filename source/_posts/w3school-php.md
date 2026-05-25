---
title: PHP & MySQL learning notes (1)
date: 2018-10-28 00:00:00
categories:
  - code
tags:
  - php
  - mysql
---

W3school PHP 和 MySQL 的初次学习
包括 PHP 基础语法，表单处理，PHP 连接 MySQL 数据库操作

### 1.PHP 基础
PHP 脚本以 `<?php 开头，以 ?>` 结尾,语句以分号结尾:

```php
// 此处是 PHP 代码;
?>
```
// 这是单行注释 # 这也是单行注释 /* */这是多行注释块

变量

- 变量以 $ 符号开头，其后是变量的名称
- 变量名称必须以字母或下划线开头
- 变量名称不能以数字开头
- 变量名称只能包含字母数字字符和下划线 A-z、0-9 以及 _
- 变量名称对大小写敏感（$y 与 $Y 是两个不同的变量）
- 松散型语言，不必告知 PHP 变量的数据类型

PHP global 关键词

- global 关键词用于访问函数内的全局变量。
- 要做到这一点，请在（函数内部）变量前面使用 global 关键词
- PHP 同时在名为 $GLOBALS[index] 的数组中存储了所有的全局变量。

```php
function myTest() {
  global $x,$y;
  $y=$x+$y;
}

function myTest() {
  $GLOBALS['y']=$GLOBALS['x']+$GLOBALS['y'];
}
```

PHP static 关键词

- 通常，当函数完成/执行后，会删除所有变量。不过，有时我需要不删除某个局部变量。实现这一点需要更进一步的工作。要完成这一点，请在您首次声明变量时使用 static 关键词

echo 和 print 之间的差异：

- echo - 能够输出一个以上的字符串
- print - 只能输出一个字符串，并始终返回 1

PHP var_dump() 会返回变量的数据类型和值

PHP 对象

- 对象是存储数据和有关如何处理数据的信息的数据类型。
- 首先我们必须声明对象的类。对此，我们使用 class 关键词;然后我们在对象类中定义数据类型;然后在该类的实例中使用此数据类型

```php
class Car
{
  var $color;
  function Car($color="green") {
    $this->color = $color;
  }
  function what_color() {
    return $this->color;
  }
}
```

- strlen() 函数返回字符串的长度，以字符计
- strpos() 函数用于检索字符串内指定的字符或文本

如需设置常量，请使用 define() 函数 - 它使用三个参数：

- 首个参数定义常量的名称
- 第二个参数定义常量的值
- 可选的第三个参数规定常量名是否对大小写不敏感。默认是 false。

**PHP 字符串运算符**

运算符
名称
例子
结果

.
串接
$txt1 = “Hello” $txt2 = $txt1 . “ world!”
现在 $txt2 包含 “Hello world!”

.=
串接赋值
$txt1 = “Hello” $txt1 .= “ world!”
现在 $txt1 包含 “Hello world!”

- PHP 递增/递减运算符

运算符
名称
描述

++$x
前递增
$x 加一递增，然后返回 $x

$x++
后递增
返回 $x，然后 $x 加一递增

—$x
前递减
$x 减一递减，然后返回 $x

$x—
后递减
返回 $x，然后 $x 减一递减

在 PHP 中， array() 函数用于创建数组

在 PHP 中，有三种数组类型：

- 索引数组 - 带有数字索引的数组`$cars=array("Volvo","BMW","SAAB");`
- 关联数组 - 带有指定键的数组`$age=array("Peter"=>"35","Ben"=>"37","Joe"=>"43");`
- 多维数组 - 包含一个或多个数组的数组

- count() 函数用于返回数组的长度（元素数）
- 如需遍历并输出索引数组的所有值，您可以先 count 数组长度，再使用 for 循环
- 如需遍历并输出关联数组的所有值，您可以使用 foreach 循环

PHP foreach 循环

- foreach 循环只适用于数组，并用于遍历数组中的每个键/值对。

```php
foreach ($array as $value) {
code to be executed;
}
```

PHP - 数组的排序函数

- sort() - 以升序对数组排序
- rsort() - 以降序对数组排序
- asort() - 根据值，以升序对关联数组进行排序
- ksort() - 根据键，以升序对关联数组进行排序
- arsort() - 根据值，以降序对关联数组进行排序
- krsort() - 根据键，以降序对关联数组进行排序

**超全局变量**：

```plain
$GLOBALS 引用全局作用域中可用的全部变量
$_SERVER 保存关于报头、路径和脚本位置的信息
$_REQUEST 用于收集 HTML 表单提交的数据
$_POST 广泛用于收集提交 method="post" 的 HTML 表单后的表单数据。$_POST 也常用于传递变量
$_GET 用于收集提交 HTML 表单 (method="get") 之后的表单数据,也可以收集 URL 中的发送的数据
$_ENV
$_COOKIE
$_SESSION
```
```html
">
Name: 

$name = $_REQUEST['fname'];
echo $name;
?>
```

### 2.PHP 表单
#### HTML 表单处理
表单界面

```html
html>
body>

form action="welcome.php" method="post">
Name: input type="text" name="name">br>  
E-mail: input type="text" name="email">br>
Gender:  
input type="radio" name="gender" value="female">Female
input type="radio" name="gender" value="male">Male
input type="submit">
form>

body>
html>
```
welcome.PHP

```html
Welcome 

Your email address is:
```

- 可以将 post 换成 get

#### 后端 GET & POST

- `$_GET` 是通过 URL 参数传递到当前脚本的变量数组。
- 通过 GET 方法从表单发送的信息对任何人都是可见的（所有变量名和值都显示在 URL 中）。GET 对所发送信息的数量也有限制。限制在大于 2000 个字符。不过，由于变量显示在 URL 中，把页面添加到书签中也更为方便。
GET 可用于发送非敏感的数据。

`$_POST` 是通过 HTTP POST 传递到当前脚本的变量数组。

- 通过 POST 方法从表单发送的信息对其他人是不可见的（所有名称/值会被嵌入 HTTP 请求的主体中），并且对所发送信息的数量也无限制。
- 一般偏向于 POST 发送表单数据

#### 表单安全验证
`<form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">`

- `$_SERVER["PHP_SELF"]` 是一种超全局变量，它返回当前执行脚本的文件名
- `htmlspecialchars()` 函数把特殊字符转换为 HTML 实体
- `$_SERVER["PHP_SELF"]` 变量能够被黑客利用,使用了 PHP_SELF，用户能够输入下划线然后执行跨站点脚本（XSS）,通过使用 `htmlspecialchars()` 函数能够避免 `$_SERVER["PHP_SELF"]` 被利用

利用 php 函数检查表单

- （通过 PHP trim() 函数）去除用户输入数据中不必要的字符（多余的空格、制表符、换行）
（通过 PHP stripslashes() 函数）删除用户输入数据中的反斜杠（\）

```php
// 定义变量并设置为空值
$name = $email = $gender = $comment = $website = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $name = test_input($_POST["name"]);
  $email = test_input($_POST["email"]);
  $website = test_input($_POST["website"]);
  $comment = test_input($_POST["comment"]);
  $gender = test_input($_POST["gender"]);
}

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}
```

#### 必须输入字段
增加了一些新变量：`$nameErr`、`$emailErr`、`$genderErr` 以及 `$websiteErr`。这些错误变量会保存被请求字段的错误消息。

还需要每个 `$_POST` 变量添加了一个 if else 语句。这条语句检查 `$_POST` 变量是否为空（通过 PHP empty() 函数）。如果为空，则错误消息会存储于不同的错误变量中。如果不为空，则通过 test_input() 函数发送用户输入数据

```php
$nameErr = $emailErr = $genderErr = $websiteErr = "";
$name = $email = $gender = $comment = $website = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  if (empty($_POST["name"])) {
    $nameErr = "Name is required";
  } else {
    $name = test_input($_POST["name"]);
  }

  if (empty($_POST["email"])) {
    $emailErr = "Email is required";
  } else {
    $email = test_input($_POST["email"]);
  }

  if (empty($_POST["website"])) {
    $website = "";
  } else {
    $website = test_input($_POST["website"]);
  }

  if (empty($_POST["comment"])) {
    $comment = "";
  } else {
    $comment = test_input($_POST["comment"]);
  }

  if (empty($_POST["gender"])) {
    $genderErr = "Gender is required";
  } else {
    $gender = test_input($_POST["gender"]);
  }
}
```
#### HTML 显示错误消息
在每个被请求字段后面增加了一点脚本。如果需要，会生成恰当的错误消息

```html
Name: input type="text" name="name">
span class="error">*  echo $nameErr;?>span>  //验证

E-mail:
input type="text" name="email">
span class="error">*  echo $emailErr;?>span>

Website:
input type="text" name="website">
span class="error"> echo $websiteErr;?>span>
br>br>
label>Comment: textarea name="comment" rows="5" cols="40">textarea>

Gender:
input type="radio" name="gender" value="female">Female
input type="radio" name="gender" value="male">Male
span class="error">*  echo $genderErr;?>span>

input type="submit" name="submit" value="Submit">
```
#### 验证输入数据
验证名字：preg_match() 函数检索字符串的模式，如果模式存在则返回 true，否则返回 false

```php
$name = test_input($_POST["name"]);
if (!preg_match("/^[a-zA-Z ]*$/",$name)) {
  $nameErr = "只允许字母和空格！";
}
```
验证 email

```php
$email = test_input($_POST["email"]);
if (!preg_match("/([\w\-]+\@[\w\-]+\.[\w\-]+)/",$email)) {
  $emailErr = "无效的 email 格式！";
}
```
验证 URL

```php
$website = test_input($_POST["website"]);
if (!preg_match("/\b(?:(?:https?|ftp):\/\/|www\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/i",$website)) {
  $websiteErr = "无效的 URL";
}
```
#### HTML 保留表单中的值
在输入字段的 value 属性中增加了一小段 PHP 脚本：name、email 以及 website

在 comment 文本框字段中，把脚本放到了 `<textarea>` 与 `</textarea>` 之间;这些脚本输出 `$name`、`$email`、`$website` 和 `$comment` 变量的值。

要显示选中了哪个单选按钮，操作 checked 属性（而非单选按钮的 value 属性）

```html
Name: input type="text" name="name" value="">
E-mail: input type="text" name="email" value="">
Website: input type="text" name="website" value="">
Comment: textarea name="comment" rows="5" cols="40"> echo $comment;?>textarea>

Gender:
input type="radio" name="gender"

value="female">Female
input type="radio" name="gender"

value="male">Male
```
#### 完整代码
```php
.error {color: #FF0000;}

// 定义变量并设置为空值
$nameErr = $emailErr = $genderErr = $websiteErr = "";
$name = $email = $gender = $comment = $website = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
   if (empty($_POST["name"])) {
     $nameErr = "姓名是必填的";
   } else {
     $name = test_input($_POST["name"]);
     // 检查姓名是否包含字母和空白字符
     if (!preg_match("/^[a-zA-Z ]*$/",$name)) {
       $nameErr = "只允许字母和空格";
     }
   }

   if (empty($_POST["email"])) {
     $emailErr = "电邮是必填的";
   } else {
     $email = test_input($_POST["email"]);
     // 检查电子邮件地址语法是否有效
     if (!preg_match("/([\w\-]+\@[\w\-]+\.[\w\-]+)/",$email)) {
       $emailErr = "无效的 email 格式";
     }
   }

   if (empty($_POST["website"])) {
     $website = "";
   } else {
     $website = test_input($_POST["website"]);
     // 检查 URL 地址语法是否有效（正则表达式也允许 URL 中的斜杠）
     if (!preg_match("/\b(?:(?:https?|ftp):\/\/|www\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/i",$website)) {
       $websiteErr = "无效的 URL";
     }
   }

   if (empty($_POST["comment"])) {
     $comment = "";
   } else {
     $comment = test_input($_POST["comment"]);
   }

   if (empty($_POST["gender"])) {
     $genderErr = "性别是必选的";
   } else {
     $gender = test_input($_POST["gender"]);
   }
}

function test_input($data) {
   $data = trim($data);
   $data = stripslashes($data);
   $data = htmlspecialchars($data);
   return $data;
}
?>

PHP 验证实例
* 必需的字段
"post" action="PHP_SELF"]);?>">
   姓名："text" name="name">
   * 
   

   电邮："text" name="email">
   * 
   

   网址："text" name="website">
   
   

   评论："comment" rows="5" cols="40">
   

   性别：
   "radio" name="gender" value="female">女性
   "radio" name="gender" value="male">男性
   * 
   

   "submit" name="submit" value="提交">

echo "您的输入：";
echo $name;
echo "
";
echo $email;
echo "
";
echo $website;
echo "
";
echo $comment;
echo "
";
echo $gender;
?>
```
### 3.mySQL
#### PHP 连接 MySQL
通过 mysql_connect() 函数完成

- `mysql_connect('servername','username','password');`

参数
描述

servername
可选。规定要连接的服务器。默认是 “localhost:3306”

username
可选。规定登录所使用的用户名。默认值是拥有服务器进程的用户的名称

password
可选。规定登录所用的密码。默认是 “”

```php
$con = mysql_connect("localhost","root","");
if (!$con)
  {
  die('Could not connect: ' . mysql_error()); //连接失败执行die
  }
```
#### 创建数据库
用 mysql_query() 函数

- `mysql_query("CREATE DATABASE database_name",password)`

```php
$con = mysql_connect('localhost','root','');
if (!$con){
  die('Could not connect: ' . mysql_error());
  }

if (mysql_query("CREATE DATABASE my_db",$con)){ //创建数据库
  echo "Database created";
  }
else{
  echo "Error creating database: " . mysql_error();
  }

mysql_close($con);
```
#### 创建表
创建表之前，必须首先选择数据库;通过 `mysql_select_db()` 函数选取数据库
mysql_query() 函数添加 CREATE TABLE 语句

```php
// Create table in database
mysql_select_db("DATABASE NAME", $con);
$sql = "CREATE TABLE Persons
(
FirstName varchar(15),
LastName varchar(15),
Age int
)";
mysql_query($sql,$con);
```

- 表的主键和递增字段：主键字段通常是 ID 号，且通常使用 AUTO_INCREMENT 设置
- AUTO_INCREMENT 会在新记录被添加时逐一增加该字段的值。要确保主键字段不为空，我们必须向该字段添加 NOT NULL 设置
- `personID int NOT NULL AUTO_INCREMENT`

#### 插入数据
`INSERT INTO table_name VALUES (value1, value2,....)`

- SQL 语句对大小写不敏感。INSERT INTO 与 insert into 相同。
- 为了让 PHP 执行该语句，我们必须使用 `mysql_query()` 函数。该函数用于向 MySQL 连接发送查询或命令

```php
mysql_select_db("DATABASE NAME", $con);

mysql_query("INSERT INTO Persons (FirstName, LastName, Age)
VALUES ('Peter', 'Griffin', '35')");
mysql_close($con);
```

- 表单数据插入数据库
- 当用户点击上例中 HTML 表单中的提交按钮时，表单数据被发送到 “insert.php”。”insert.php” 文件连接数据库，并通过 `$_POST` 变量从表单取回值。然后，mysql_query() 函数执行 INSERT INTO 语句，一条新的记录会添加到数据库表中

```php
mysql_select_db("DATABASE NAME", $con);

$sql="INSERT INTO Persons (FirstName, LastName, Age)
VALUES('$_POST[firstname]','$_POST[lastname]','$_POST[age]')"; //HTML表单中的数据
if (!mysql_query($sql,$con))
{
die('Error: ' . mysql_error());
}
echo "1 record added";
mysql_close($con)
```
#### 查询数据
`SELECT column_name(s) FROM table_name`

- 使用 mysql_fetch_array() 函数以数组的形式从记录集返回第一行
- 使用了 PHP 的 $row 变量 ($row[‘FirstName’] 和 $row[‘LastName’])输出每行的值

```php
mysql_select_db("my_db", $con);

$result = mysql_query("SELECT * FROM Persons");
while($row = mysql_fetch_array($result))
  {
  echo $row['FirstName'] . " " . $row['LastName'];
  echo "
";
  }
mysql_close($con);
```
显示成表格样式

```php
mysql_select_db("my_db", $con);
$result = mysql_query("SELECT * FROM Persons");

echo "
  
  Firstname
  Lastname
  ";
  while($row = mysql_fetch_array($result))
    {
    echo "";
    echo "" . $row['FirstName'] . "";
    echo "" . $row['LastName'] . "";
    echo "";
    }
echo "";

mysql_close($con);
```
**如需选取匹配指定条件的数据，请向 SELECT 语句添加 WHERE 子句**

- `SELECT column FROM table WHERE column operator value`

```php
mysql_select_db("my_db", $con);

$result = mysql_query("SELECT * FROM Persons
WHERE FirstName='Peter'");
```
**ORDER BY 关键词用于对记录集中的数据进行排序**

- `SELECT column_name(s) FROM table_name ORDER BY column_name`

ORDER BY 关键词，记录集的排序顺序默认是升序;可用 DESC 关键词来设定降序排序

- `SELECT column_name(s) FROM table_name ORDER BY column_name DESC`

```php
mysql_select_db("my_db", $con);

$result = mysql_query("SELECT * FROM Persons ORDER BY age");
```
#### 修改数据
UPDATE 语句用于在数据库表中修改数据

- `UPDATE table_name SET column_name = new_value WHERE column_name = some_value`

```php
mysql_select_db("my_db", $con);
mysql_query("UPDATE Persons SET Age = '36'
WHERE FirstName = 'Peter' AND LastName = 'Griffin'");
mysql_close($con);
```
#### 删除数据
DELETE FROM 语句用于从数据库表中删除记录

- `DELETE FROM table_name WHERE column_name = some_value`

```php
mysql_select_db("my_db", $con);
mysql_query("DELETE FROM Persons WHERE LastName='Griffin'");
mysql_close($con);
```