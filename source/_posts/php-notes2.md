---
title: PHP & MySQL learning notes (3)
date: 2019-01-21 00:00:00
categories:
  - code
tags:
  - php
  - mysql
---

-基础笔记-
慕课网 PHP 基础语法巩固(2) 课堂笔记，包含会话，文件，数据库操作等细碎的摘要

## 会话控制
### session
HTTP 是无状态协议，HTTP 不知道请求来自哪个客户端，Session 提供在 PHP 脚本中定义全局变量的方法，使全局变量在同一个 Session 中对**所有的 PHP 脚本文件内**都有效,解决 HTTP 断链接的问题
Session 可以减轻服务器压力，缺点在于每次请求会传输大量重复的信息
Session 允许通过将数据存储在 HTTP 服务器中，使得用户在回话过程中保持该数据

```php
session_start();
$_SESSION['id'] = 'info'
```
![](https://hyqskevin.github.io/pic/session_cookie/session.png)
每一次请求有 SessionID 区分不同的信息，SessionID 存储到 cookie 中，Session 数据通过变量`$_SESSION`存储到 Session 文件中

SessionID：

- PHP 回话启用
- 检查 SessionID，如果没有启动新会话 + SessionID
- 一直使用的 SessionID 相同，默认会话在活动，超过一定时间则视为过期
- 默认情况下 SessionID 存在 Cookie 中，也可以存在 URL 中

Session 函数：

```php
bool session_start()  //启动新会话或重用现有会话
string session_id(string $id)  //获取/设置当前会话的id
string session_name(string $name)  //读取/设置会话名称
bool session_destroy(void) //销毁一个会话中的全部数据

session.auto_start(bool)  //指定会话模块在请求开始时自动启动
session.name(string)  //指定会话名用作cookie名字
session.save_handler(string)  //定义用来存储和获取与会话关联的数据处理器的名字
session.save_path(string)  //定义传递给存储处理器的参数
session.gc_maxlifetime(int)  //指定数据存在时长
session.gc_probability(int)  //定义在会话初始化时启动垃圾回收进程的概率
```

- 必须在 session_start()函数之前调用 session_name()函数
- 垃圾回收进程概率计算：gc_probability/gc_divisor

### cookie
cookie 是服务器发送到用户浏览器上并保存在浏览器里的数据，会在浏览器下一次请求时一起发送到服务器上

**session 是存储在服务器的数据**
**cookie 是存储在客户端的数据**

cookie 的用途：
会话状态管理，个性化设置，浏览器行为跟踪

```php
bool setcookie(string $name,string $value,[$expire,$path,$domain])  //名称，值，生命周期，路径，域名范围
```
## 文件操作
### API

- 文件信息相关

```php
filetype($filename);  //获取文件的类型；返回的是文件的类型，可能的值有 fifo，char，dir，block，link，file 和 unknown。如果 stat 调用失败或者文件类型未知的话 filetype() 还会产生一个 E_NOTICE 消息。
filesize($filename);  //获取文件的大小；返回的是字节数。如果出错返回 FALSE 并生成一条 E_WARNING 级的错误。
filectime($filename);  //获取文件的创建时间；返回的是时间戳。在失败时返回 FALSE。 时间以 Unix 时间戳的方式返回。
filemtime($filename);  //获取文件的修改时间；返回的是时间戳。在失败时返回 FALSE。
fileatime($filename);  //获取文件的最后访问时间；返回的是时间戳。在失败时返回 FALSE。

//可以使用date()函数修改日期和时区；
date_default_timezone_set('PRC');
date('Y-m-d H:i:s',filectime($filename));

is_readable($filename);  //检测文件是否可读；返回布尔值
is_writable($filename)/is_writeable($filename);  //检测文件是否可写；返回布尔值
is_executable($filename);  //检测文件是否可执行；返回布尔值
is_file($filename);  //检测是否为文件；返回布尔值
```

- 文件路经相关

```php
pathinfo($filename, $options);  //获取文件路径相关信息；返回一个关联数组，包含有 path 的信息

//options如果指定了，将会返回指定元素；它们包括：PATHINFO_DIRNAME，PATHINFO_BASENAME 和 PATHINFO_EXTENSION 或 PATHINFO_FILENAME。

dirname($path);  //返回文件中的路径部分
basename($filename,$suffix);  //返回路径文件名部分；
file_exists($filename);  //检测文件或者目录是否存在；返回布尔值
```

- 文件操作相关

```php
touch($filename，$time,$atime);   //设定文件的访问和修改时间，如果文件不存在，则会创建文件；返回布尔值

//time: 使用当前系统的时间。
//atime: 访问时间会被设为 atime，

unlink($filename,$context);  //删除文件；返回布尔值；
rename($oldname,$newname，$path);  //重命名或者剪切(给剪切path)一个文件或目录;返回布尔值；
copy($filename);  //拷贝一个文件或者目录；返回布尔值；
```

- 文件内容操作相关

```php
$handle = fopen($filename, r|r+|w|...)  //打开指定文件
fread($handle, $size) //读取文件内容
fwrite($handle, 'info',$size)|fput()  //写入内容,之前有内容会覆盖

ftell($handle)  //读取指针位置
fseek($handle,$size)  //移动指针的位置
fpassthru()  //输出文件指针处的所有剩余数据
rewind($handle) //重置文件指针
ftruncate($handle,$size)  //将文件截断到指定长度

fgetc($handle)  //读取一个字符
fgets($handle)  //读取一行字符
fgetss($handle)  //读取一行并过滤掉 HTML 标记
fgetcsv()  //从文件指针中读入一行并解析 CSV 字段
fputcsv()  //将行格式化为 CSV 并写入文件指针
file_get_contents()  //将整个文件读入一个字符串
file_put_contents()  //将一个字符串写入文件，和依次调用 fopen()，fwrite() 以及 fclose() 功能一样。
file()  //把整个文件读入一个数组中
readfile()  //读取文件并写入到输出缓冲

feof($handle)  //测试文件指针是否到了文件结束的位置
fclose()  //关闭文件

parse_ini_file($filename)  //解析一个配置文件
parse_ini_string($ini)  //解析配置字符串
highlight_string($str)  //字符串的语法高亮
highlight_file()  //语法高亮一个文件
```
‘r’：只读方式打开，将文件指针指向文件头。
‘r+’：读写方式打开，将文件指针指向文件头。
‘w’：写入方式打开，将文件指针指向文件头并将文件大小截为零。如果文件不存在则尝试创建之。
‘w+’：读写方式打开，将文件指针指向文件头并将文件大小截为零。如果文件不存在则尝试创建之。
‘a’：写入方式打开，将文件指针指向文件末尾。如果文件不存在则尝试创建之。
‘a+’：读写方式打开，将文件指针指向文件末尾。如果文件不存在则尝试创建之。
‘x’：创建并以写入方式打开，将文件指针指向文件头。如果文件已存在，则 fopen() 调用失败并返回 FALSE，并生成一条 E_WARNING 级别的错误信息。如果文件不存在则尝试创建之。这和给 底层的 open(2) 系统调用指定 O_EXCL|O_CREAT 标记是等价的。
‘x+’：创建并以读写方式打开，其他的行为和 ‘x’ 一样。

### 函数和类的封装

创建文件

- 可以用 touch()创建，也可以直接 file_get_contents()

```php
function create_file(string $filename){
  //检测文件是否存在，不存在则创建
  if(file_exists($filename)){
    return false;
  }
  //检测目录是否存在，不存在则创建
  if(!file_exists(dirname($filename))){
    //创建目录，可以创建多级
    mkdir(dirname($filename),0777,true);
  }
  // if(touch($filename)){
  //   return true;
  // }
  // return false;
  if(file_put_contents($filename,'')!==false){
    return true;
  }
  return false;
}
```

- 删除文件

```php
function del_file(string $filename){
  //检测删除的文件是否存在,并且是否有权限操作
  if(!file_exists($filename)||!is_writable($filename)){
    return false;
  }
  if(unlink($filename)){
    return true;
  }
  return false;
}
```

- 拷贝文件

```php
function copy_file(string $filename,string $dest){
  //检测$dest是否是目标并且这个目录是否存在，不存在则创建
  if(!is_dir($dest)){
    mkdir($dest,0777,true);  //0777为权限
  }
  $destName=$dest.DIRECTORY_SEPARATOR.basename($filename);
  //检测目标路径下是否存在同名文件
  if(file_exists($destName)){
    return false;
  }
  //拷贝文件
  if(copy($filename,$destName)){
    return true;
  }
  return false;
}
```

- 重命名文件

```php
function rename_file(string $oldName,string $newName){
  //检测原文件并且存在
  if(!is_file($oldName)){
    return false;
  }
  //得到原文件所在的路径
  $path=dirname($oldName);
  $destName=$path.DIRECTORY_SEPARATOR.$newName;
  //路径下有文件名，重命名失败
  if(is_file($destName)){
    return false;
  }
  if(rename($oldName,$newName)){
    return true;
  }
  return false;
}
```

- 剪切文件

```php
function cut_file(string $filename,string $dest){
  //检查文件和路径是否都存在
  if(!is_file($filename)){
    return false;
  }
  if(!is_dir($dest)){
    mkdir($dest,0777,true);
  }
  $destName=$dest.DIRECTORY_SEPARATOR.basename($filename);
  if(is_file($destName)){
    return false;
  }
  if(rename($filename,$destName)){
    return true;
  }
  return false;
}
```

- 返回文件信息

```php
function get_file_info(string $filename){
  //检查文件存在且可读
  if(!is_file($filename)||!is_readable($filename)){
    return false;
  }
  return [
    'atime'=>date("Y-m-d H:i:s",fileatime($filename)),
    'mtime'=>date("Y-m-d H:i:s",filemtime($filename)),
    'ctime'=>date("Y-m-d H:i:s",filectime($filename)),
    'size'=>trans_byte(filesize($filename)),
    'type'=>filetype($filename)
  ];
}
```

- 字节转换

```php
function trans_byte(int $byte,int $precision=2){
  $kb=1024;
  $mb=1024*$kb;
  $gb=1024*$mb;
  $tb=1024*$gb;
  if($byte
    return $byte.'B';
  }elseif($byte
    return round($byte/$kb,$precision).'KB';
  }elseif($byte
    return round($byte/$mb,$precision).'MB';
  }elseif($byte
    return round($byte/$gb,$precision).'GB';
  }else{
    return round($byte/$tb,$precision).'TB';
  }
}
```

- 读取文件内容返回字符串

```php
function read_file(string $filename){
  //检测是否是一个文件并且文件可读
  if(is_file($filename) && is_readable($filename)){
    return file_get_contents($filename);
  }
  return false;
}
```

- 读取文件内容返回数组

```php
function read_file_array(string $filename,bool $skip_empty_lines=false){
  //检测是否是一个文件并且文件可读
  if(is_file($filename)&&is_readable($filename)){
    if($skip_empty_lines){
      //如果有空行就过滤掉
      return file($filename,FILE_IGNORE_NEW_LINES|FILE_SKIP_EMPTY_LINES);
    }else{
      return file($filename);
    }
  }
  return false;
}
```

**文件中写入内容**

- 写入的内容是数组或者对象需要做**序列化处理**

```php
function write_file(string $filename,$data){
  $dirname=dirname($filename);
  //检测目标路径是否存在
  if(!file_exists($dirname)){
    mkdir($dirname,0777,true);
  }
  //判断内容是否是数组或者对象
  if(is_array($data)||is_object($data)){
    //序列化数据
    $data=serialize($data);
  }
  //向文件中写入内容
  if(file_put_contents($filename,$data)!==false){
    return true;
  }else{
    return false;
  }
}
```

- **非空文件中写入内容**

```php
function write_file1(string $filename,$data,bool $clearFlag=false){
  $dirname=dirname($filename);
  //检测目标路径是否存在
  if(!file_exists($dirname)){
    mkdir($dirname,0777,true);
  }
  //检测文件是否存在并且可读
  if(is_file($filename)&&is_readable($filename)){
    //读取文件内容，之后和新写入的内容拼装到一起
    if(filesize($filename)>0){
      $srcData=file_get_contents($filename);
    }
  }

  //判断内容是否是数组或者对象
  if(is_array($data)||is_object($data)){
    //序列化数据
    $data=serialize($data);
  }
  //拼装到一起
  $data=$srcData.$data;
  //向文件中写入内容
  if(file_put_contents($filename,$data)!==false){
    return true;
  }else{
    return false;
  }
}
```

- 截断文件到指定大小

```php
function truncate_file(string $filename,int $length){
  //检测是否是文件且可写
  if(is_file($filename)&&is_writable($filename)){
    $handle=fopen($filename,'r+');
    $length=$length0?0:$length;
    ftruncate($handle,$length);
    fclose($handle);
    return true;
  }
  return false;
}
```

**下载文件**

- 在 html 里添加下载链接
- 建立`down_file()`函数
- 建立 php 文件进行下载

```html
a href="download.php?filename=download.zip">file_name.zipa>
```
```php
//$allowDownExt 允许下载的文件类型
function down_file(string $filename,array $allowDownExt=array('jpeg','jpg','png','gif','txt','html','php','rar','zip')){
  //检测下载文件是否存在，并且可读
  if(!is_file($filename)||!is_readable($filename)){
    return false;
  }
  //检测文件类型是否允许下载
  $ext=strtolower(pathinfo($filename,PATHINFO_EXTENSION));
  if(!in_array($ext,$allowDownExt)){
    return false;
  }
  //通过header()发送头信息
  //告诉浏览器输出的是字节流
  header('Content-Type:application/octet-stream');

  //告诉浏览器返回的文件大小是按照字节进行计算的
  header('Accept-Ranges: bytes');

  //告诉浏览器返回的文件大小
  header('Accept-Length: '.filesize($filename));

  //告诉浏览器文件作为附件处理，告诉浏览器最终下载完的文件名称
  header('Content-Disposition: attachment;filename=king_'.basename($filename));

  //读取文件中的内容
  //readfile($filename);
  //exit;

  //规定每次读取文件的字节数为1024字节，直接输出数据
  $read_buffer=1024;
  $sum_buffer=0;
  $handle=fopen($filename,'rb');
  while(!feof($handle) && $sum_buffer
    echo fread($handle,$read_buffer);
    $sum_buffer+=$read_buffer;
  }
  fclose($handle);
  exit;
}
```
```php
$filename=$_GET['filename'];
down_file($filename);
```

- 单文件上传

```php
function upload_file(array $fileInfo,string $uploadPath='./uploads',bool $imageFlag=true,array $allowExt=array('jpeg','jpg','png','gif'),int $maxSize=2097152){

  define('UPLOAD_ERRS',[
    'upload_max_filesize'=>'超过了PHP配置文件中upload_max_filesize选项的值',
    'form_max_size'=>'超过了表单MAX_FILE_SIZE选项的值',
    'upload_file_partial'=>'文件部分被上传',
    'no_upload_file_select'=>'没有选择上传文件',
    'upload_system_error'=>'系统错误',
    'no_allow_ext'=>'非法文件类型',
    'exceed_max_size'=>'超出允许上传的最大值',
    'not_true_image'=>'文件不是真实图片',
    'not_http_post'=>'文件不是通过HTTP POST方式上传上来的',
    'move_error'=>'文件移动失败'
  ]);

  //检测是否上传是否有错误
  if($fileInfo['error']===UPLOAD_ERR_OK){
    //检测上传文件类型
    $ext=strtolower(pathinfo($fileInfo['name'],PATHINFO_EXTENSION));
    if(!in_array($ext,$allowExt)){
      echo  UPLOAD_ERRS['no_allow_ext'];
      return false;
    }
    //检测上传文件大小是否符合规范
    if($fileInfo['size']>$maxSize){
      echo UPLOAD_ERRS['exceed_max_size'];
      return false;
    }
    //检测是否是真实图片
    if($imageFlag){
      if(@!getimagesize($fileInfo['tmp_name'])){
        echo UPLOAD_ERRS['not_true_image'];
        return false;
      }
    }
    //检测文件是否通过HTTP POST方式上传上来的
    if(!is_uploaded_file($fileInfo['tmp_name'])){
      return UPLOAD_ERRS['not_http_post'];
    }
    //检测目标目录是否存在，不存在则创建
    if(!is_dir($uploadPath)){
      mkdir($uploadPath,0777,true);
    }
    //生成唯一文件名，防止重名产生覆盖
    $uniName=md5(uniqid(microtime(true),true)).'.'.$ext;
    $dest=$uploadPath.DIRECTORY_SEPARATOR.$uniName;

    //移动文件
    if(@!move_uploaded_file($fileInfo['tmp_name'],$dest)){
      echo UPLOAD_ERRS['move_error'];
      return false;
    }
    echo '文件上传成功';
    return $dest;
  }else{
    switch($fileInfo['error']){
      case 1:
      // $mes='超过了PHP配置文件中upload_max_filesize选项的值';
      $mes=UPLOAD_ERRS['upload_max_filesize'];
      break;
      case 2:
      $mes=UPLOAD_ERRS['form_max_size'];
      break;
      case 3:
      $mes=UPLAOD_ERRS['upload_file_partial'];
      break;
      case 4:
      $mes=UPLOAD_ERRS['no_upload_file_select'];
      break;
      case 6:
      case 7:
      case 8:
      $mes=UPLAOD_ERRS['upload_system_error'];
      break;
    }
    echo $mes;
    return false;
  }
}
```

压缩单个文件

- `ZipArchive()`一个用 Zip 压缩的文件存档类
- 压缩包要打开后将文件添加到压缩包中

```php
function zip_file(string $filename){
  if(!is_file($filename)){
    return false;
  }
  $zip=new ZipArchive();
  $zipName=basename($filename).'.zip';
  //打开指定压缩包，不存在则创建，存在则覆盖
  if($zip->open($zipName,ZipArchive::CREATE|ZipArchive::OVERWRITE)){
    //将文件添加到压缩包中并删除文件
    if($zip->addFile($filename)){
      @unlink($filename);
    }
    $zip->close();
    return true;
  }else{
    return false;
  }
}
```

- 多文件压缩

```php
function zip_files(string $zipName,...$files){
  //检测压缩包名称是否正确
  $zipExt=strtolower(pathinfo($zipName,PATHINFO_EXTENSION));
  if('zip'!==$zipExt){
    return false;
  }
  $zip=new ZipArchive();
  if($zip->open($zipName,ZipArchive::CREATE|ZipArchive::OVERWRITE)){
    foreach($files as $file){
      if(is_file($file)){
        $zip->addFile($file);
      }
    }
    $zip->close();
    return true;
  }else{
    return false;
  }
}
```

- 解压缩

```php
function unzip_file(string $zipName,string $dest){
  //检测要解压压缩包是否存在
  if(!is_file($zipName)){
    return false;
  }
  //检测目标路径是否存在
  if(!is_dir($dest)){
    mkdir($dest,0777,true);
  }
  $zip=new ZipArchive();
  if($zip->open($zipName)){
    $zip->extractTo($dest);
    $zip->close();
    return true;
  }else{
    return false;
  }
}
```
[函数和类的封装源码: code/lib/file.func.php](https://hyqskevin.github.io//code/lib/file.func.php)

## MySQL
[具体参考 PHP & MySQL learning notes (1)->3.mySQL](https://hyqskevin.github.io/2018/10/28/w3school-php/#3-mySQL)

### PHP 操作 MySQL

- MySQL：非永久链接，性能低，PHP5.5 之后废弃
- MySQLi：永久链接，减轻了服务器压力
- PDO：实现 MySQLi 常用功能，支持大部分数据库

连接数据库：`mysql -uroot -p password`
选择数据库：`use db`
设置字符集：`set names utf8`

```php
mysql_select_db("DATABASE NAME", $con)

mysql_connect($server,$username,$password)  //链接数据库
mysql_select_db($database_name)  //选择数据库名
mysql_set_charset($charset)  //设置字符集

mysql_query($query)  //执行INSERT，UPDATE，DELETE，DROP之类的操作，返回bool

mysql_query($query)  //执行SELECT操作，成功返回resource，失败返回FALSE
```
代码示例

```php
header('content-type:text/html;charset=utf-8');
//1、连接数据库
$link = @mysql_connect('localhost','root','') or die('数据库连接失败！');
//2、选择数据库
mysql_select_db('test') or die('选择的数据库不存在！');
//3、设置字符集
mysql_set_charset('utf8');

//添加数据
$result = mysql_query("INSERT INTO users VALUES(NULL ,'李四',20)");
//var_dump($result);

//修改数据
$result = mysql_query("UPDATE users SET money=25 where id=3");
//var_dump($result);

//删除单条数据
$result = mysql_query("DELETE FROM users where id=3");
//var_dump($result);

//删除数据表
$result = mysql_query("DROP TABLE test");
//var_dump($result);

//查询
$result = mysql_query("SELECT * FROM users");
//$line = mysql_fetch_row($result);
//$line = mysql_fetch_assoc($result);
while($line = mysql_fetch_array($result,MYSQL_ASSOC)){
    $data[] = $line;
}
var_dump($data);

//array (size=3)
//  'id' => string '1' (length=1)
//  'name' => string '慕课' (length=6)
//  'money' => string '100' (length=3)

//关闭数据库连接
mysql_close($link);
```
### MySQLi 操作
```php
$connect = mysqli_connect('host','username','password'.'database');  //面向过程方式链接数据库
$result = mysqli_query($connect,$sql);  //执行SQL语句
mysqli_fetch_all($result)  //获取结果集
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

@ //PHP提供的错误信息屏蔽的专用符号

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

exit()|die();  //输出一个消息并且退出当前脚本
```

---

相关链接：
[mysql 笔记](https://hyqskevin.github.io/2019/02/15/mysql/)
[PHP & MySQL learning notes (2)](https://hyqskevin.github.io/2019/01/21/php-notes/)
[PHP & MySQL learning notes (1)](https://hyqskevin.github.io/2018/10/28/w3school-php/)