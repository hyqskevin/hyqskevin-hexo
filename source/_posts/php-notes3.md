---
title: PHP & MySQL learning notes (4)
date: 2019-03-03 00:00:00
categories:
  - code
tags:
  - php
  - mysql
---

由于 PHP 和 MySQL 版本问题，对 [PHP & MySQL learning notes (1)](https://hyqskevin.github.io/2018/10/28/w3school-php/#3-mySQL) 中曾经写过用的 PHP 操作 MySQL 数据库进行笔记更新
完善 [PHP & MySQL learning notes (3)](https://hyqskevin.github.io/2019/01/21/php-notes2/#MySQL) 中的代码
重新用 MySQLi (面向对象) MySQLi (面向过程) PDO 三种方式演示 PHP 操作 MySQL

可以通过 phpinfo() 查看 mysqli 和 PDO 是否可以使用

## 连接 MySQL
### 创建连接
面向对象

```php
$servername = "localhost";
$username = "username";
$password = "password";

// 创建连接
$conn = new mysqli($servername, $username, $password);

// 检测连接
if ($conn->connect_error) {
    die("连接失败: " . $conn->connect_error);
}
echo "连接成功";
?>
```
面向过程

```php
$servername = "localhost";
$username = "username";
$password = "password";

// 创建连接
$conn = mysqli_connect($servername, $username, $password);

// 检测连接
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
echo "连接成功";
?>
```
PDO

```php
$servername = "localhost";
$username = "username";
$password = "password";

try {
    $conn = new PDO("mysql:host=$servername;", $username, $password);
    echo "连接成功";
}
catch(PDOException $e)
{
    echo $e->getMessage();
}
?>
```
### 关闭链接
```php
$conn->close();  //面向对象
mysqli_close($conn);  //面向过程
$conn = null;  //实例PDO
```
## 创建数据库
面向对象

```php
$servername = "localhost";
$username = "username";
$password = "password";

// 创建连接
$conn = new mysqli($servername, $username, $password);
// 检测连接
if ($conn->connect_error) {
    die("连接失败: " . $conn->connect_error);
}

// 创建数据库
$sql = "CREATE DATABASE myDatabase";
if ($conn->query($sql) === TRUE) {
    echo "数据库创建成功";
} else {
    echo "Error creating database: " . $conn->error;
}

$conn->close();
?>
```
面向过程

```php
$servername = "localhost";
$username = "username";
$password = "password";

// 创建连接
$conn = mysqli_connect($servername, $username, $password);
// 检测连接
if (!$conn) {
    die("连接失败: " . mysqli_connect_error());
}

// 创建数据库
$sql = "CREATE DATABASE myDatabase";
if (mysqli_query($conn, $sql)) {
    echo "数据库创建成功";
} else {
    echo "Error creating database: " . mysqli_error($conn);
}

mysqli_close($conn);
?>
```
PDO

```php
$servername = "localhost";
$username = "username";
$password = "password";

try {
    $conn = new PDO("mysql:host=$servername", $username, $password);

    // 设置 PDO 错误模式为异常
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $sql = "CREATE DATABASE myDatabasePDO";

    // 使用 exec() ，因为没有结果返回
    $conn->exec($sql);

    echo "数据库创建成功
";
}
catch(PDOException $e)
{
    echo $sql . "
" . $e->getMessage();
}

$conn = null;
?>
```
## 创建数据表 CREATE
创建 Mytest 表

```sql
CREATE TABLE Mytest (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(30) NOT NULL,
    lastname VARCHAR(30) NOT NULL,
    email VARCHAR(50),
    reg_date TIMESTAMP
)
```
面向对象

```php
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "myDatabase";

// 创建连接
$conn = new mysqli($servername, $username, $password, $dbname);
// 检测连接
if ($conn->connect_error) {
    die("连接失败: " . $conn->connect_error);
}

// 使用 sql 创建数据表
$sql = "CREATE TABLE Mytest (
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
firstname VARCHAR(30) NOT NULL,
lastname VARCHAR(30) NOT NULL,
email VARCHAR(50),
reg_date TIMESTAMP
)";

if ($conn->query($sql) === TRUE) {
    echo "Table Mytest
   created successfully";
} else {
    echo "创建数据表错误: " . $conn->error;
}

$conn->close();
?>
```
面向过程

```php
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "myDatabase";

// 创建连接
$conn = mysqli_connect($servername, $username, $password, $dbname);
// 检测连接
if (!$conn) {
    die("连接失败: " . mysqli_connect_error());
}

// 使用 sql 创建数据表
$sql = "CREATE TABLE Mytest (
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
firstname VARCHAR(30) NOT NULL,
lastname VARCHAR(30) NOT NULL,
email VARCHAR(50),
reg_date TIMESTAMP
)";

if (mysqli_query($conn, $sql)) {
    echo "数据表 Mytest
   创建成功";
} else {
    echo "创建数据表错误: " . mysqli_error($conn);
}

mysqli_close($conn);
?>
```
PDO

```php
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "myDatabasePDO";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // 设置 PDO 错误模式，用于抛出异常
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 使用 sql 创建数据表
    $sql = "CREATE TABLE MyTest
   (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(30) NOT NULL,
    lastname VARCHAR(30) NOT NULL,
    email VARCHAR(50),
    reg_date TIMESTAMP
    )";

    // 使用 exec() ，没有结果返回
    $conn->exec($sql);
    echo "数据表 MyTest
   创建成功";
}
catch(PDOException $e)
{
    echo $sql . "
" . $e->getMessage();
}

$conn = null;
?>
```
## 插入数据 INSERT
使用 INSERT 进行插入操作

```sql
INSERT INTO table_name (column1, column2, column3,...)
VALUES (value1, value2, value3,...)
```
### 插入单条数据
面向对象

```php
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "myDatabase";

// 创建连接
$conn = new mysqli($servername, $username, $password, $dbname);
// 检测连接
if ($conn->connect_error) {
    die("连接失败: " . $conn->connect_error);
}

$sql = "INSERT INTO MyTest (firstname, lastname, email)
VALUES ('John', 'Doe', 'john@example.com')";

if ($conn->query($sql) === TRUE) {
    echo "新记录插入成功";
} else {
    echo "Error: " . $sql . "
" . $conn->error;
}

$conn->close();
?>
```
面向过程

```php
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "myDatabase";

// 创建连接
$conn = mysqli_connect($servername, $username, $password, $dbname);
// 检测连接
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$sql = "INSERT INTO MyTest (firstname, lastname, email)
VALUES ('John', 'Doe', 'john@example.com')";

if (mysqli_query($conn, $sql)) {
    echo "新记录插入成功";
} else {
    echo "Error: " . $sql . "
" . mysqli_error($conn);
}

mysqli_close($conn);
?>
```
PDO

```php
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "myDatabasePDO";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // 设置 PDO 错误模式，用于抛出异常
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $sql = "INSERT INTO MyTest
   (firstname, lastname, email)
    VALUES ('John', 'Doe', 'john@example.com')";
    // 使用 exec() ，没有结果返回
    $conn->exec($sql);

    /*
    $conn->exec("INSERT INTO MyTest
   (firstname, lastname, email)
    VALUES ('John', 'Doe', 'john@example.com')")
    */
    echo "新记录插入成功";
}
catch(PDOException $e)
{
    echo $sql . "
" . $e->getMessage();
}

$conn = null;
?>
```
### 插入多条数据
mysqli_multi_query() 函数可用来执行多条 SQL 语句

```php
$sql = "INSERT INTO MyTest (firstname, lastname, email)
VALUES ('John', 'Doe', 'john@example.com');";
$sql .= "INSERT INTO MyTest (firstname, lastname, email)
VALUES ('Mary', 'Moe', 'mary@example.com');";
$sql .= "INSERT INTO MyTest (firstname, lastname, email)
VALUES ('Julie', 'Dooley', 'julie@example.com')";

$conn->multi_query($sql) === TRUE // 面向对象
mysqli_multi_query($conn, $sql)  //面向过程
```
PDO 需要使用事务函数执行多条并提交，执行失败后要使用回滚

```php
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "myDatabasePDO";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 开始事务
    $conn->beginTransaction();
    // SQL 语句
    $conn->exec("INSERT INTO MyTest
   (firstname, lastname, email)
    VALUES ('John', 'Doe', 'john@example.com')");
    $conn->exec("INSERT INTO MyTest
   (firstname, lastname, email)
    VALUES ('Mary', 'Moe', 'mary@example.com')");
    $conn->exec("INSERT INTO MyTest
   (firstname, lastname, email)
    VALUES ('Julie', 'Dooley', 'julie@example.com')");

    // 提交事务
    $conn->commit();
    echo "新记录插入成功";
}
catch(PDOException $e)
{
    // 如果执行失败回滚
    $conn->rollback();
    echo $sql . "
" . $e->getMessage();
}

$conn = null;
?>
```
### 使用预处理语句优化
用于执行多个相同的 SQL 语句，也可以防止 MySQL 注入

**主要优势**

- 预处理语句大大减少了分析时间，只做了一次查询（虽然语句多次执行）
- 绑定参数减少了服务器带宽，你只需要发送查询的参数，而不是整个语句
- 预处理语句针对 SQL 注入是非常有用的，因为参数值发送后使用不同的协议，保证了数据的合法性

**流程**

预处理：创建 SQL 语句模板并发送到数据库。预留的值使用参数 `?` 标记，可以将其替换为整型，字符串，双精度浮点型和布尔值
`INSERT INTO MyTest (firstname, lastname, email) VALUES(?, ?, ?)`
绑定 SQL 参数并告知相关的值
`$stmt->bind_param("sss", $firstname, $lastname, $email);`

“sss” 参数列处理参数的数据类型，参数有以下四种类型:
i - integer（整型）
d - double（双精度浮点型）
s - string（字符串）
b - BLOB（binary large object:二进制大对象）
- 通过告诉数据库参数的数据类型，可以降低 SQL 注入的风险

- 数据库解析，编译，对 SQL 语句模板执行查询优化，并存储结果不输出
- 执行：最后，将应用绑定的值传递给参数（`?` 标记），数据库执行语句

使用预处理语句插入多条数据

```php
// 检测数据库链接状态 同上

// 预处理及绑定
$stmt = $conn->prepare("INSERT INTO MyTest (firstname, lastname, email) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $firstname, $lastname, $email);

// 设置参数并执行
$firstname = "John";
$lastname = "Doe";
$email = "john@example.com";
$stmt->execute();

$firstname = "Mary";
$lastname = "Moe";
$email = "mary@example.com";
$stmt->execute();

$firstname = "Julie";
$lastname = "Dooley";
$email = "julie@example.com";
$stmt->execute();

echo "新记录插入成功";

$stmt->close();
$conn->close();
```
PDO

```php
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "myDatabasePDO";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // 设置 PDO 错误模式为异常
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 预处理 SQL 并绑定参数
    $stmt = $conn->prepare("INSERT INTO MyTest
   (firstname, lastname, email)
    VALUES (:firstname, :lastname, :email)");
    $stmt->bindParam(':firstname', $firstname);
    $stmt->bindParam(':lastname', $lastname);
    $stmt->bindParam(':email', $email);

    // 插入行
    $firstname = "John";
    $lastname = "Doe";
    $email = "john@example.com";
    $stmt->execute();

    // 插入其他行
    $firstname = "Mary";
    $lastname = "Moe";
    $email = "mary@example.com";
    $stmt->execute();

    // 插入其他行
    $firstname = "Julie";
    $lastname = "Dooley";
    $email = "julie@example.com";
    $stmt->execute();

    echo "新记录插入成功";
}
catch(PDOException $e)
{
    echo "Error: " . $e->getMessage();
}
$conn = null;
?>
```
## 查询数据 SELECT
### 简单查询
SELECT 语句用于从数据表中读取数据:
`SELECT column_name(s) FROM table_name`

面向对象

- 设置 SQL 语句从 MyTest 数据表中读取 id, firstname 和 lastname 三个字段。
- 使用 SQL 语句从数据库中取出结果集并赋给复制给变量 $result。
- 函数 num_rows() 判断返回的数据。
- 函数 fetch_assoc() 将结合集放入到关联数组并循环输出

```php
// 创建和检测连接

// 建立索引
$sql = "SELECT id, firstname, lastname FROM MyTest";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // 输出数据
    while($row = $result->fetch_assoc()) {
        echo "id: " . $row["id"]. " - Name: " . $row["firstname"]. " " . $row["lastname"]. "
";
    }
} else {
    echo "0 结果";
}
$conn->close();
?>
```
面向过程

```php
// 创建并检测连接

$sql = "SELECT id, firstname, lastname FROM MyTest";
$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {
    // 输出数据
    while($row = mysqli_fetch_assoc($result)) {
        echo "id: " . $row["id"]. " - Name: " . $row["firstname"]. " " . $row["lastname"]. "
";
    }
} else {
    echo "0 结果";
}

mysqli_close($conn);
?>
```
PDO

```php
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "myDatabasePDO";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $stmt = $conn->prepare("SELECT id, firstname, lastname FROM MyTest
  ");
    $stmt->execute();

    // 设置结果集为关联数组
    $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
    foreach(new TableRows(new RecursiveArrayIterator($stmt->fetchAll())) as $k=>$v) {
        echo $v;
    }
}
catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
$conn = null;
echo "";
?>
```

- 使用 WHERE 子句, ORDER BY 子句进行查询时，必须使用 `mysqli::query` 或 `mysqli_query()` ，用于向 MySQL 连接发送查询或命令

## 修改数据 UPDATE
```sql
UPDATE table_name
SET column1=value, column2=value2,...
WHERE some_column=some_value
```
必须使用 `mysqli::query` 或 `mysqli_query()`

```php
$con=mysqli_connect("localhost","username","password","database");
// 检测连接
if (mysqli_connect_errno())
{
    echo "连接失败: " . mysqli_connect_error();
}

mysqli_query($con,"UPDATE Persons SET Age=36
WHERE FirstName='Peter' AND LastName='Griffin'");

mysqli_close($con);
?>
```
## 删除数据 DELETE
```sql
DELETE FROM table_name
WHERE some_column = some_value
```
```php
$con=mysqli_connect("localhost","username","password","database");
// 检测连接
if (mysqli_connect_errno())
{
    echo "连接失败: " . mysqli_connect_error();
}

mysqli_query($con,"DELETE FROM Persons WHERE LastName='Griffin'");

mysqli_close($con);
?>
```

---

## 使用的类和函数汇总
### mysqli PHP 和 Mysql 数据库之间的一个连接
mysqli::init — 初始化 MySQLi 并返回一个资源类型的值，这个值可以作为 mysqli*real_connect() 函数的传入参数
mysqli::$info — 返回最近执行的 SQL 语句的信息
mysqli::stat — 获取当前系统状态信息
mysqli::$connect_error/mysqli_connect_error() — 返回最后连接错误描述
mysqli::$error/mysqli_error() — 返回最后的错误描述
mysqli::\*_construct/mysqli_connect() — 开始一个新的 MySQL 服务连接
mysqli::real_connect — 建立一个 MySQL 服务器连接
mysqli::select_db — 选择用于数据库查询的默认数据库
mysqli::query — 对数据库执行一次查询
mysqli::real_query — 执行一个 mysql 查询
mysqli::send_query — 发送请求并返回结果
mysqli::multi_query — 执行查询
mysqli::real_escape_string — 根据当前连接的字符集，对于 SQL 语句中的特殊字符进行转义
mysqli::prepare — 准备执行一个 SQL 语句
mysqli::stmt_init — 初始化一条语句并返回一个用于 mysqli_stmt_prepare(调用)的对象
mysqli::rollback — 回退当前事务
mysqli::close/mysqli_close() — 关闭先前打开的数据库连接

mysqli::autocommit — 打开或关闭本次数据库连接的自动命令提交事务模式
mysqli::change_user — 改变指定数据库连接的用户
mysqli::character_set_name — 返回当前数据库连接的默认字符编码
mysqli::commit — 提交一个事务
mysqli::$connect_errno — 返回最后连接错误代码
mysqli::errno — 返回最近函数调用的错误代码
mysqli::$error_list — 返回最后命令行执行错误列表
mysqli::$field_count — Returns the number of columns for the most recent query
mysqli::get_charset — Returns a character set object
mysqli::$client_info — 获取 MySQL 客户端信息
mysqli_get_client_version — 作为一个整数返回 MySQL 客户端的版本
mysqli::get_connection_stats — 返回客户端连接的统计数据
mysqli::$host_info — 返回一个表述使用的连接类型的字符串
mysqli::$protocol_version — 返回 MySQL 使用的协议版本号
mysqli::$server_info — 返回MySQL服务器的版本号
mysqli::$server_version — 作为一个整数返回 MySQL 服务器的版本
mysqli::get_warnings — Get result of SHOW WARNINGS
mysqli::$insert_id — 返回最后一条插入语句产生的自增 ID
mysqli::kill — 让服务器杀掉一个 MySQL 线程
mysqli::more_results — 检查批量查询中是否还有查询结果
mysqli::next_result — 为读取 multi_query 执行之后的下一个结果集做准备
mysqli::options — 设置选项
mysqli::ping — ping 一个连接，或者如果连接处于断开状态，重新连接
mysqli::poll — 轮询连接
mysqli::reap_async_query — 获取异步查询的结果
mysqli::refresh — 刷新
mysqli::release_savepoint — 从当前事务的保存点中移除一个命名保存点
mysqli::rpl_query_type — 返回 RPL 查询类型
mysqli::savepoint — 在当前事务中增加一个命名保存点
mysqli::set_charset — 设置默认字符编码
mysqli::set_local_infile_default — 取消用户指定的回调函数
mysqli::set_local_infile_handler — 设置 LOAD DATA LOCAL INFILE 命令的回调函数
mysqli::$sqlstate — 返回上一次 SQL 操作的 SQLSTATE 错误信息
mysqli::store_result — 转移上一次查询返回的结果集
mysqli::$thread_id — 返回当前连接的线程 ID
mysqli::thread_safe — 返回是否是线程安全的

### mysqli_stmt 预编译 SQL 语句
mysqli*stmt :: prepare - 准备一条 SQL 语句以便执行
mysqli_stmt :: bind_param - 将变量作为参数绑定到预准备语句
mysqli_stmt :: \*_ construct - 构造一个新的 mysqli_stmt 对象
mysqli_stmt :: $ num_rows/mysqli_num_rows() - 返回语句结果集中的行数
mysqli_stmt :: $ param_count - 返回给定语句的参数个数
mysqli_stmt :: $ errno - 返回最近语句调用的错误代码
mysqli_stmt :: $ error_list - 返回上一个执行语句的错误列表
mysqli_stmt :: $ error - 返回上一个语句错误的字符串描述
mysqli_stmt :: execute - 执行准备好的 Query
mysqli_stmt :: fetch - 将预准备语句的结果提取到绑定变量中
mysqli_stmt :: close - 关闭准备好的语句

mysqli_stmt :: $ affected_rows - 返回上次执行的语句更改，删除或插入的总行数
mysqli_stmt :: attr_get - 用于获取语句属性的当前值
mysqli_stmt :: attr_set - 用于修改预准备语句的行为
mysqli_stmt :: bind_result - 将变量绑定到结果存储的预准备语句
mysqli_stmt :: data_seek - 寻找语句结果集中的任意行
mysqli_stmt :: fetch - 将预准备语句的结果提取到绑定变量中
mysqli_stmt :: $ field_count - 返回给定语句中的字段数
mysqli_stmt :: free_result - 释放给定语句句柄的存储结果内存
mysqli_stmt :: get_result - 从预准备语句中获取结果集
mysqli_stmt :: get_warnings - 获取 SHOW WARNINGS 的结果
mysqli_stmt :: $ insert_id - 获取先前INSERT操作生成的ID
mysqli_stmt :: more_results - 检查多个查询是否有更多查询结果
mysqli_stmt :: next_result - 从多个查询中读取下一个结果
mysqli_stmt :: reset - 重置预准备语句
mysqli_stmt :: result_metadata - 从预准备语句返回结果集元数据
mysqli_stmt :: send_long_data - 以块为单位发送数据
mysqli_stmt :: $ sqlstate - 从前一个语句操作返回 SQLSTATE 错误
mysqli_stmt :: store_result - 从预准备语句中传输结果集

### mysqli_result 从一个数据库查询中获取的结果集
mysqli_result :: fetch_all - 将所有结果行提取为关联数组，数字数组或两者
mysqli_result :: fetch_array - 将结果行提取为关联行，数字数组或两者
mysqli_result :: fetch_assoc/mysqli_fetch_assoc() - 将结果行作为关联数组获取
mysqli_result :: $ lengths - 返回结果集中当前行的列长度
mysqli_result :: $ num_rows - 获取结果中的行数

mysqli_result :: $ current_field - 获取结果指针的当前字段偏移量
mysqli_result :: data_seek - 将结果指针调整为结果中的任意行
mysqli_result :: fetch_field_direct - 获取单个字段的元数据
mysqli_result :: fetch_field - 返回结果集中的下一个字段
mysqli_result :: fetch_fields - 返回表示结果集中字段的对象数组
mysqli_result :: fetch_object - 将结果集的当前行作为对象返回
mysqli_result :: fetch_row - 将结果行作为枚举数组
mysqli_result :: $ field_count - 获取结果中的字段数
mysqli_result :: field_seek - 将结果指针设置为指定的字段偏移量
mysqli_result :: free - 释放与结果相关的内存

---

相关链接：
[mysql 学习笔记](https://hyqskevin.github.io/2019/02/15/mysql/)
[PHP & MySQL learning notes (3)](https://hyqskevin.github.io/2019/01/21/php-notes2/)
[PHP & MySQL learning notes (1)](https://hyqskevin.github.io/2018/10/28/w3school-php/)