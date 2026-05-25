---
title: 使用 layoutit 设计简易留言板功能
date: 2018-11-18 00:00:00
categories:
  - code
tags:
  - bootstrap2.0
  - php
---

-基础练习-
[Layoutit](http://www.layoutit.com/)是基于 bootstrap2.0 的一个可视化布局模板, 可以点击模板里的文字进行修改, 也可以通过点击弹出的编辑框进行富文本修改. 拖动区块能实现排序。
尝试用 Layoutit 进行快速可视化布局，练习 PHP 的_POST 和_GET，后台数据用文件存储，未使用数据库

### 后台步骤

- 创建`msg.md`，将文件中的内容创建成 PHP 的值，读取到`$msgs`：$msgs=unserialize($string);

```php
header('content-type:text/html;charset=utf-8');
date_default_timezone_set('PRC');
$filename="msg.md";
$msgs=[];
//检测文件是否存在
if(file_exists($filename)){
  //读取文件中的内容
  $string=file_get_contents($filename);
  if(strlen($string)>0){
    $msgs=unserialize($string);
  }
}
```

- 检测到用户提交留言

- 读取`$username, $title, $content, $time`
- 组成关联数组: `$data=compact('username','title','content','time');`
- 写入新的数据到`$msgs: array_push($msgs,$data);`
- 产生一个存储的值: `$msgs=serialize($msgs);`
- 报告留言成功或失败

```php
if(isset($_POST['pubMsg'])){
  $username=$_POST['username'];
  $title=strip_tags($_POST['title']);
  $content=strip_tags($_POST['content']);
  $time=time();
  //将其组成关联数组
  $data=compact('username','title','content','time');
  array_push($msgs,$data);
  $msgs=serialize($msgs);
  if(file_put_contents($filename,$msgs)){
    echo "alert('留言成功！');location.href='22-msg.php';";
  }else{
    echo "alert('留言失败！');location.href='22-msg.php';";
  }
}
```

- 将$msgs 中的内容显示在留言板上

- 检测到$msgs 存在且数组有内容
- 将$msgs中的所有数组键名按顺序读取，分别在网页中输出：foreach($msgs as $val)

```php
if(is_array($msgs)&&count($msgs)>0):?>

...

 $i=1;foreach($msgs as $val):?>
  
    
       echo $i++;?>
    
    
       echo $val['username'];?>
    
    
       echo $val['title'];?>
    
    
       echo date("m/d/Y H:i:s",$val['time']);?>
    
    
       echo $val['content'];?>
    
  
 endforeach;?>
 endif;?>
```

- 表格输出

  
    
      
        编号
      
      
        用户
      
      
        标题
      
      
        时间
      
      
        内容
      
    
  
  
      
        
        1
        
        
        KevinW
        
        
        test
        
        
        11/18/2018 15:59:25
        
        
        测试留言
        
      
  

---

### Layoutit 页面设计

</head>

    
        
            
                
                    Kevin_W的留言板-V1.1.0
                
            
            
                
                    Hello, Layoutit!
                
                
                    这是一个可视化布局模板, 你可以点击模板里的文字进行修改, 也可以通过点击弹出的编辑框进行富文本修改. 拖动区块能实现排序.
                

                
                    参看更多 »
                

            
      
        
          请留言
          用户
          

          标题
          

          内容
          

          
        
      
    
    

L2Dwidget.init({"pluginRootPath":"live2dw/","pluginJsPath":"lib/","pluginModelPath":"assets/","tagMode":false,"debug":false,"model":{"jsonPath":"/live2dw/assets/haruto.model.json"},"display":{"position":"left","width":100,"height":200},"mobile":{"show":true},"log":false});

---

[msg.php](https://link)
[msg.md](https://link)