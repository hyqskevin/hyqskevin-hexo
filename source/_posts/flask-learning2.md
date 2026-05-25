---
title: Flask Web 学习笔记2 -- URL与视图函数映射
date: 2019-04-11 00:00:00
categories:
  - code
tags:
  - flask
---

-学习笔记-
通过 URL 传递参数，接收参数，利用试图函数实现参数到 URL 转换，自定义 URL 转换

URL 是 Uniform Resource Locator 的简写，统一资源定位符。
一个 URL 由以下几部分组成：

scheme://host:port/path/?query-string=xxx#anchor

- scheme：代表的是访问的协议，一般为 http 或者 https 以及 ftp 等。
- host：主机名，域名，比如www.baidu.com。
- port：端口号。当你访问一个网站的时候，浏览器默认使用 80 端口。
- path：查找路径。比如：www.jianshu.com/trending/now，后面的trending/now就是path。
- query-string：查询字符串，比如：www.baidu.com/s?wd=python，后面的wd=python就是查询字符串。
- anchor：锚点，后台一般不用管，前端用来做页面定位的。

### 传递参数
传递参数的语法是：`/<参数名>/`。然后在视图函数中，也要定义同名的参数。

```python
@app.route('/')
@app.route('/list/')
@app.route('/p/')
@app.route('/u//')
@app.route('///')
```
参数的数据类型

- 如果没有指定具体的数据类型，那么默认就是使用`string`数据类型。
- `int`数据类型只能传递`int`类型。
- `float`数据类型只能传递`float`类型。
- `path`数据类型和`string`有点类似，都是可以接收任意的字符串，但是`path`可以接收路径，也就是说可以包含斜杠。
- `uuid`数据类型只能接收符合`uuid`的字符串。`uuid`是一个全宇宙都唯一的字符串，一般可以用来作为表的主键。
- `any`数据类型可以在一个`url`中指定多个路径。

```python
@app.route('///')
def detail(url_path,id):
    if url_path == 'blog':
        return '博客详情：%s' % id
    else:
        return '博客详情：%s' % id
```
### 接收用户传递的参数

- 第一种：使用`path`的形式（将参数嵌入到路径中），就是上面讲的。
- 第二种：使用查询字符串的方式，就是通过`?key=value`的形式传递的。

```python
@app.route('/d/')
def d():
    wd = request.args.get('wd')
    return '参数是：%s' % wd
```
### URL 转换器
`url_for`将**视图函数**名字后面的参数传递给`url`。
如果传递的参数之前在`url`中已经定义了，那么这个参数就会被当成`path`的形式给`url`。如果这个参数之前没有在`url`中定义，那么将变成查询字符串的形式放到`url`中。

```python
from flask import Flask,url_for,request
...

@app.route('/list//')
def my_list(page):
    return 'my list'

print(url_for('my_list',page=1,count=2))
# page作为path，count作为查询字符串
# 构建出来的url：/my_list/1/?count=2
```

- url_for 优势

- 将来如果修改了`URL`，但没有修改该 URL 对应的函数名，就不用到处去替换 URL 了

```python
@app.route('/post/list//')
def my_list(page):
    return 'my list'
url = url_for('my_list'，page=1,count=2)
# 原来的url：/my_list/1/?count=2
# 新构建出来的url：/post/my_list/1/?count=2
```

- url_for 会自动的处理那些特殊的字符，不需要手动去处理。

```python
@app.route('/login/')
def login():
    return 'login'

url = url_for('login',next='/')
# 会自动的将`/`编码，不需要手动去处理。
# url=/login/?next=%2F
```
### 自定义 URL 转换器
URL 参数的数据类型通过`routing.py`中的`Unicode/Float/Any/Path/Number Converter`等类指定，使用了默认转换器

可以自定义类型 URL 转换器和运算符 URL 转换器

- 自定义方法

- 实现一个类，继承自`BaseConverter`。
- 在自定义的类中，重写`regex`，也就是这个变量的正则表达式。
- 将自定义的类，映射到`app.url_map.converters`上。

```python
from flask import Flask,url_for
from werkzeug.routing import BaseConverter

# 自定义手机号码的变量URL转换
class TelephoneConveter(BaseConverter):
  regex = r'1[85734]\d'
app.url_map.converters['tel'] = TelephoneConverter

# 使用自定义的数据类型
@app.route('/telephone//')
def my_tel(my_tel):
  return '您的手机号码是：%s' % my_tel

###########################

# 自定义+号运算符解析
class OpratorConverter(BaseConverter):
def to_python(self, value):  # 这个方法的返回值，将会传递到view函数中作为参数
    return value.split('+')

def to_url(self, value):  # 在调用url_for函数的时候生成符合要求的URL形式
    return "+".join(value)
    # return "hello"
app.url_map.converters['oprator+'] = OpratorConverter

# 使用自定义+
@app.route('/posts//')
def posts(boards):
    print(boards)
    return "您提交的板块是：%s" % boards
```
### URL 重定向
重定向在页面上体现的操作就是浏览器会从一个页面自动跳转到另外一个页面。比如用户访问了一个需要权限的页面，但是该用户当前并没有登录，因此我们应该给他重定向到登录页面。

- 永久性重定向：`http`的状态码是`301`，多用于旧网址被废弃了要转到一个新的网址确保用户的访问。
- 暂时性重定向：`http`的状态码是`302`，表示页面的暂时性跳转。比如访问一个需要权限的网址，如果当前用户没有登录，应该重定向到登录页面，这种情况下，应该用暂时性重定向。

`flask`中有一个函数叫做`redirect`，可以重定向到指定的页面。

```python
from flask import Flask,request,redirect,url_for

app = Flask(__name__)

@app.route('/login/')
def login():
    return '这是登录页面'

@app.route('/profile/')
def profile():
    if request.args.get('name'):
        return '个人中心页面'
    else:
        # redirect 重定向
        return redirect(url_for('login'))
```
### 视图函数的响应

- 可以返回字符串：flask 会创建 werkzeug、wrappers、Response 对象，状态码 200，MIME 类型`test/html`，然后返回 Response 对象

```python
from flask import Response
...
@app.route('/list/')
def list():
    Response('Hello World!')
# Response('Hello World!',status=200,mimetype='text/html')
```
还可以通过 make_response 进行创建

```python
form flask import make_response
@app.route('/list/')
def list():
  return make_response('list page.')
```

可以返回元组：元组的形式是(Response,Status,header)
不一定三个都要写，写两个也是可以的，status 返回 200，header 为列表或字典。返回的元组，其实在底层也是包装成了一个`Response`对象。
`return 'list',200,{'NAME':'kevin'}`

```python
@app.errorheader(404)
def not_found():
  return 'not found',404
```

- 直接返回合法的响应对象

```python
resp = Response('list')
resp.set_cookie('country','china')
return resp
```

- 以上条件不满足，则进行自定义响应

继承自`Response`类。
实现方法`force_type(cls,response,environ=None)`。
指定`app.response_class`为你自定义的`Response`对象。
如果视图函数返回的数据，不是字符串，也不是元组，也不是 Response 对象，那么就会将返回值传给`force_type`，然后再将`force_type`的返回值返回给前端。

```python
class myResponse(Response):
    def force_type(cls, response, environ=None):
        return Response('return error.')

app.response_class = myResponse
```
```python
# 使用jsonify将返回的格式转换成json格式
from flask import jsonify
...
class myResponse(Response):
  def force_type(cls, response, environ=None):
    if isinstance(response,dict):
        # jsonify除了将字典转换成json对象，还将改对象包装成了一个Response对象
        response = jsonify(response)
    # 调用父类
    return super(myResponse, cls).force_type(response, environ)

app.response_class = myResponse
```