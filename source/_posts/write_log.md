---
title: 如何写日志
date: 2019-08-04 00:00:00
categories:
  - study
tags:
  - python
  - log
---

在开发时学习书写日志的方法，方便做测试。
例举使用 python 和 java 上的日志记录
—loading…—

## 常用日志框架
log4j、Logging、commons-logging、slf4j、logback

Logging：Java 自带的日志工具类
Log4j：Apache 的一个开源日志框架，log4j 在 2015/08/05 这一天被 Apache 宣布停止维护了，用户需要切换到 Log4j2 上面去
commons-logging：日志的门面接口，它也是 apache 最早提供的日志门面接口，用户可以根据喜好选择不同的日志实现框架，而不必改动日志定义
Slf4j：Simple Logging Facade for Java，即简单日志门面接口
Logback：Slf4j 的原生实现框架，同样也是出自 Log4j 一个人之手，但拥有比 log4j 更多的优点、特性和更做强的性能，现在基本都用来代替 log4j 成为主流

- commons-loggin、slf4j 只是一种日志抽象门面，不是具体的日志框架。
- log4j、logback 是具体的日志实现框架。
- 推荐使用 `slf4j + logback` 还有`slf4j + log4j` `commons-logging + log4j` 这两种日志组合框架。

- Python 的 logging 模块提供了通用的日志系统。logging 模块与 log4j 的机制相同，只是具体的实现细节不同。

## 日志级别

日志级别(Java)
描述

OFF
关闭：最高级别，不输出日志。

FATAL
致命：输出非常严重的可能会导致应用程序终止的错误。

ERROR
错误：输出错误，但应用还能继续运行。

WARN
警告：输出可能潜在的危险状况。

INFO
信息：输出应用运行过程的详细信息。

DEBUG
调试：输出更细致的对调试应用有用的信息。

TRACE
跟踪：输出更细致的程序运行轨迹。

ALL
所有：输出所有级别信息。

Java：ALL < TRACE < DEBUG < INFO < WARN < ERROR < FATAL < OFF
Python：NOTSET < DEBUG < INFO < WARNING < ERROR < CRITICAL

## Log4J 的运用
Log4j 有三个主要的组件：Loggers(记录器)，Appenders(输出源)和 Layouts(布局)，这里可简单理解为日志类别，日志要输出的地方和日志以何种形式输出

## logging 的运用
logging 模块提供 logger、handler、filter、formatter

### logger
记录获取到的数据，通过模块的 getLogger(name)函数获得

```python
logger = logging.getLogger('test')    # 获取名为 test 的 logger
logger.addHandler(handler)           # 为 logger 添加 handler
logger.setLevel(logging.DEBUG)
```

方法名
作用

setLevel(lvl)
设置日志级别

isEnabledFor(lvl)
检查某级别的日志是否启用

getEffectiveLevel()
获取实际的日志级别

debug/warning/info/error(msg, *args, **kwargs)
输出对应级别的日志

log(lvl, msg, *args, **kwargs)
输出指定级别的日志

addFilter(filt)/removeFilter(filt)
添加或删除指定的过滤器

addHandler(hdlr)/removeHandler(hdlr)
添加或删除指定的处理器

### handler
用于指定日志向哪里输出（文件、终端等等）

常用的 Handler 有以下几种：

- StreamHandler， 用于向标准输入输出流等输出日志。
- FileHandler，用于向文件输出日志。
- NullHandler，什么也不输出。
- RotatingFileHandler，向文件输出日志，如果文件到达指定大小，创建新文件并继续输出日志。

相关 handler 类型参考[python 官方文档](https://docs.python.org/zh-cn/3/library/logging.handlers.html#module-logging.handlers)

```python
handler = logging.handlers.RotatingFileHandler(LOG_FILE,axBytes=1024*1024, backupCount = 5) # 实例化 handler
```
### formatter
指定日志记录输出的具体格式，采用的是 %(key)s 的形式
formatter 构造方法需要两个参数：消息的格式字符串和日期字符串

日志格式
含义

%(name)s
生成日志的 Logger 名称

%(levelno)s
数字形式的日志级别，包括 DEBUG, INFO, WARNING, ERROR 和 CRITICAL

%(levelname)s
文本形式的日志级别，包括’DEBUG’、 ‘INFO’、 ‘WARNING’、 ‘ERROR’ 和’CRITICAL’

%(pathname)s
输出该日志的语句所在源文件的完整路径（如果可用）

%(filename)s
文件名

%(module)s
输出该日志的语句所在的模块名

%(funcName)s
调用日志输出函数的函数名

%(lineno)d
调用日志输出函数的语句所在的代码行（如果可用）

%(created)f
日志被创建的时间，UNIX 标准时间格式，表示从 1970-1-1 00:00:00 UTC 计算起的秒数

%(relativeCreated)d
日志被创建时间与日志模块被加载时间的时间差，单位为毫秒

%(asctime)s
日志创建时间。默认格式是 “2003-07-08 16:49:45,896”，逗号后为毫秒数

%(msecs)d
毫秒级别的日志创建时间

%(thread)d
线程 ID（如果可用）

%(threadName)s
线程名称（如果可用）

%(process)d
进程 ID（如果可用）

%(message)s
日志信息

```plain
# 日志样例
2019-08-04 23:21:59,682 - log_test.py:16 - test - first info message
2019-08-04 23:21:59,682 - log_test.py:17 - test - first debug message

# 日志格式
%(asctime)s - %(filename)s:%(lineno)s - %(name)s - %(message)s
```
#### filter
提供更细粒度的日志过滤功能，用于决定哪些日志记录将会被输出

#### config 模块配置日志
logging.basicConfig()
logging

### python 日志示例
```python
import logging
import logging.handlers

LOG_FILE = 'test.log'

# 创建logger
logger = logging.getLogger('test')
logger.setLevel(logging.DEBUG)

# 实例化handler
consoleHandler = logging.StreamHandler()
Filehandler = logging.handlers.RotatingFileHandler(LOG_FILE,axBytes = 1024*1024, backupCount = 5)

# 实例化formatter
fmt = '%(asctime)s - %(filename)s:%(lineno)s - %(name)s - %(message)s'
formatter = logging.Formatter(fmt)

# 为 handler 添加 formatter
consoleHandler.setFormatter(formatter)
Filehandler。setFormatter(formatter)

# 添加到logger中
logger.addHandler(consolehandler)
logger.addHandler(Filehandler)

# 打印日志
logger.info('info message')
logger.debug('debug message')
logger.warning('warn message')
logger.error('error message')
logger.critical('critical meaasge')
logger.debug('%s 自定义信息' % 'define message')
```

---

参考资料：
[https://blog.csdn.net/wud_jiyanhui/article/details/6213443](https://blog.csdn.net/wud_jiyanhui/article/details/6213443)
[https://blog.csdn.net/u011054333/article/details/69215660](https://blog.csdn.net/u011054333/article/details/69215660)
[https://help.aliyun.com/document_detail/28990.html?spm=a2c4g.11186623.6.746.7cfa66d8dwy2XO](https://help.aliyun.com/document_detail/28990.html?spm=a2c4g.11186623.6.746.7cfa66d8dwy2XO)
[https://help.aliyun.com/document_detail/28989.html?spm=a2c4g.11186623.6.745.3ef949faCiQ7PW](https://help.aliyun.com/document_detail/28989.html?spm=a2c4g.11186623.6.745.3ef949faCiQ7PW)