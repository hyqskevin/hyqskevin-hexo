---
title: json数据模拟
date: 2019-11-10 00:00:00
categories:
  - repo
tags:
  - JavaScript
---

进行 web 网站开发时，前后端分离导致开发进度不同，前端经常需要等待后端的接口数据完成开发才可以继续调试。且开发环境，测试环境和线上环境分离，本地开发时无法运用测试环境的接口，开发时的接口和最终部署的接口也并不相同，每次测试时来回部署代码要耗费很多时间。
  使用 json-server + mockjs 编写 json 格式的模拟数据接口，在等待后端准备接口期间，前端可以使用假数据进行模拟。

## json-server
json-server 是可以在本地运行，存储 json 数据的服务端。通过`npm install -g json-server`安装。

database.json 文件格式：

```json
{
  "data1": {
    "subdata1": "value1",
    "subdata2": "value2",
    "subdata3": "value3"
  },
  "data2": {"subdata1": , "subdata2": , "subdata3": },
  "data3": {"subdata1": , "subdata2": , "subdata3": }
}
```
在配置完 json 文件后，使用`json-server --watch --port 3001 database.json` 命令，启动服务 database.json。访问`localhost:3001`可以查看 json 数据。

### 实现各类数据请求
```js
GET /
GET|POST /post
GET|POST /post/1
GET /post?param1=¶m2=
GET /post/post?_page=1
GET /posts?_sort=views&_order=asc
GET /posts?_start=20&_end=30
GET /posts?q=xxx // 搜索功能
```
### 自定义
json-server 可以自定义路由，检验条件或输出格式

```js
const jsonServer = require('json-server') // 创建json-server服务
const server = jsonServer.create() // 创建http服务
const router = jsonServer.router('db.js') // 路由匹配的js数据
const middleWares = jsonServer.defaults() // 使用默认中间件

server.use(jsonServer.bodyParser) // 安装json-server自带的body-parser，用于获取非地址栏传递的数据
server.use(middleWares)
server.use(router)

// 监听自定义路由
server.listen({ host: '192.168.137.1', post: 3000 }, () => {
	console.log('JSON Server is running')
})
```
其它功能：

```js
// 自定义js数据地址
const path = require('path')
const router = jsonServer.router(path.join(__dirname, 'db.json'))
```
```js
// 自定义注册操作
// 注意： 自定义路由响应需要在安装json-server的router之前
server.post(
	'/mock/register',
	({ body: { username = '', password = '' } }, res) => {
		// console.log(username,password);
		username !== 'admin' && password
			? res.jsonp({
					err: 0,
					msg: '注册成功',
					data: {
						username,
						password,
					},
			  })
			: res.jsonp({
					err: 1,
					msg: '注册失败',
			  })
	}
)
```
```js
//  增加检验条件 isAuthorized
server.use((req, res, next) => {
	if (isAuthorized(req)) {
		// add your authorization logic here
		next() // continue to JSON Server router
	} else {
		res.sendStatus(401)
	}
})
```
```js
// 自定义返回内容
router.render = (req, res) => {
	let status
	let len = Object.keys(res.locals.data).length // 判断是否获取到mockJS模拟的数据
	if (res.req.originalMethod === 'DELETE') {
		status = len === 0
	} else {
		status = !!len
	}
	setTimeout(() => {
		// 由于本地请求速度较快，不方便loading动效显示利用延时器，模拟真实服务器请求速度
		res.jsonp({
			// 使用res.jsonp()方法将mockJS模拟生成的数据进行自定义包装后输出
			err: status ? 0 : 1,
			msg: '操作' + (status ? '成功' : '失败'),
			data: res.locals.data,
		})
	}, 1000)
}
```
## mockjs
Mock.js 是一款模拟数据生成器，可以根据数据模板生成模拟数据，模拟 Ajax 请求，基于 HTML 模板生成模拟数据。

```js
// 安装
npm install mockjs

// 使用
var Mock = require('mockjs');
var data = Mock.mock({
    ...
})
```
Mock.js 使用数据模板定义生成模拟数据，数据模板中的每个属性由 3 部分构成：属性名、生成规则、属性值：`'name|rule': value`。也可以使用`Mock.Random` 工具类生成各种随机数据。具体语法在[Mock.js 官网](http://mockjs.com/0.1/#)中有详细说明。

```js
const Mock = require("mockjs"); // 引入mockJS
const MR = Mock.Random; // 提mock的随机对象
module.exports = () => {
  let data = Mock.mock({
    "home|5": [
      {
        "id|+1": 1,
        "name": "@cname",
        "imgURL": MR.image('750X200',MR.color(),MR.cword(4,10))
        ...
      },
    ],
    ...
  });
  return data;
}
```
## webpack 配置数据地址

---

[https://blog.csdn.net/qq_41629150/article/details/99645632](https://blog.csdn.net/qq_41629150/article/details/99645632)
[https://github.com/typicode/json-server#getting-started](https://github.com/typicode/json-server#getting-started)

[Mock.js 官网](http://mockjs.com/0.1/#)
[json-server](https://github.com/typicode/json-server#getting-started)