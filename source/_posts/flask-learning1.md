---
title: Flask Web 学习笔记1 -- 环境
date: 2019-03-31 00:00:00
categories:
  - code
tags:
  - flask
---

-学习笔记-
flask 前期准备，在目录下建立 flask 虚拟环境，开启调试模式和书写配置文档

flask = werkzeug(web 服务)+sqlalchemy(数据库)+jinja2(框架模板)

## flask 运行环境
`pip install pipenv`
使用 `pipenv` 隔离虚拟环境，防止不同项目环境冲突

命令行切换到目标目录下
`pipenv shell` 进入虚拟环境
`pipenv install flask` 安装 flask
`pipenv graph` 打印所有依赖
`exit` 退出虚拟环境

[pipenv doc](github.com/pypa/pipenv)

python 必须重启服务器才生效

- 默认模板

```python
# 从flask这个包中导入Flask这个类
# Flask这个类是项目的核心，以后很多操作都是基于这个类的对象
# 注册url、注册蓝图等都是基于这个类的对象
__author__ = 'kevin'
from flask import Flask

# 创建一个Flask对象，传递__name__参数进去
# __name__参数的作用：
# 1. 可以规定模版和静态文件的查找路径
# 2. 以后一些Flask插件，比如Flask-migrate、Flask-SQLAlchemy如果报错了，那么Flask可以通过这个参数找到具体的错误位置
app = Flask(__name__)

# @app.route：是一个装饰器
# @app.route('/')就是将url中的/映射到hello_world这个视图函数上面
# 以后你访问我这个网站的/目录的时候，会执行hello_world这个函数，然后将这个函数的返回值返回给浏览器。
@app.route('/')
def hello_world():
    return 'Hello,World.'

# 如果这个文件是作为一个主文件运行，那么就执行app.run()方法，遍历运行
# 只在开发时使用
if __name__ == '__main__':
    app.run(host='127.0.0.1',port=5000)
```
### debug 模式
开启了 DEBUG 模式，那么在代码中如果抛出了异常，在浏览器的页面中可以看到具体的错误信息，以及具体的错误代码位置。方便开发者调试。

如果开启了 DEBUG 模式，那么以后在`Python`代码中修改了任何代码，只要按`ctrl+s`，`flask`就会自动的重新记载整个网站。不需要手动点击重新运行。

- 在`app.run()`中传递一个参数`debug=True`就可以开启`DEBUG`模式

```python
if __name__ == '__main__':
    app.run(debug=True)
```

- 给`app.deubg=True`也可以开启`debug`模式。

```python
app = Flask(__name__)
app.debug = True
```

- 通过配置参数的形式设置 DEBUG 模式：`app.config.update(DEBUG=True)`。

```python
# 设置配置参数的形式
# DEBUG必须要大写，不能小写
app = Flask(__name__)
app.config.update(DEBUG=True)
```

- 通过配置文件的形式设置 DEBUG 模式：`app.config.from_object(config)`

导入`import config`
使用`app.config.from_object(config)`
新建`config.py`文件，写入`DEBUG=true`

### config 文件

- 导入`import config`，使用`app.config.from_object(config)`,新建`config.py`文件，写入`DEBUG=true`
`app.config.from_pyfile('config.py,silence=True)`,新建`config.py`文件，写入`DEBUG=true`
可以传递`silent=True`，那么这个静态文件没有找到的时候，不会抛出异常