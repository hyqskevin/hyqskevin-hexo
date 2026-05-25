---
title: Webpack程序打包学习笔记(3) —— Babel
date: 2020-07-13 00:00:00
categories:
  - study
tags:
  - Babel
---

Babel 是一个 JavaScript 的静态分析编译器，在不需要执行代码的前提下对代码进行分析和处理。
要实现 Babel 从一个语法转换成另外一个语法，需要经过三个主要步骤：解析（Parse），转换（Transform），生成（Generate）。

[Webpack 程序打包学习笔记(1)](https://hyqskevin.github.io/2020/06/28/Webpack_1/)
[Webpack 程序打包学习笔记(2)](https://hyqskevin.github.io/2020/07/05/Webpack_2/)

## Babel 分析步骤
解析：指的是首先将代码经过词法解析和语法解析，最终生成一颗 AST（抽象语法树），在 Babel 中，语法解析器是 Babylon（@babel/parser）
转换：得到 AST 之后，可以对其进行遍历，在此过程中对节点进行添加、更新及移除等操作，Babel 中 AST 遍历工具是@babel/traverse
生成：经过一系列转换之后得到的一颗新树，要将树转换成代码，就是生成的过程，Babel 用到的是@babel/generator

使用@babel/parse 来生成 AST

```js
// index.js
const fs = require('fs')
const babel = require('@babel/core')
const traverse = require('@babel/traverse').default
const gen = require('@babel/generator').default
// 读取 source.js内容
let source = fs.readFileSync('./source.js')

// 使用 babel.parse方法
babel.parse(source, (err, ast) => {
	// ast就是树
	console.log(ast)
})
```
使用@babel/traverse，进行遍历，会得到一个类似 Html 结构的树形结构

```js
...
babel.parse(source, (err, ast) => {
	// console.log(ast)
	let indent = ''
	traverse(ast, {
		// 进入节点
		enter(path) {
			console.log(indent + ' + path.node.type + '>')
			indent += '  '
		},
		// 退出节点
		exit(path) {
			indent = indent.slice(0, -2)
			console.log(indent + ' + '/' + path.node.type + '>')
		},
	})
})
```
使用@babel/generator 进行生成

```js
...
babel.parse(source, (err, ast) => {
	// console.log(ast)
	let indent = ''
	traverse(ast, {
		...
	})
	// 生成新的 ast，然后使用generator生成 code
    console.log(gen(ast).code);
})
```
## Babel 做 ES6 语法转换
### 命令行
Babel 是 JavaScript 的一个编译器，能够将 ES6+ 语法转换为 ES5 语法。
Babel 本身自己带有 CLI（Command-Line Interface，命令行界面） 工具，可以单独安装使用：`npm i -D @babel/core @babel/cli`
安装@babel/preset-env 进行语法转换，执行 CLI 的时候添加 —presets：

```bash
# 安装开发依赖
npm i webpack babel-loader webpack-cli @babel/core @babel/preset-env @babel/plugin-transform-runtime -D
# 执行 CLI 添加--presets
npx babel babel.js --presets=@babel/preset-env
```
### babelrc
除了使用命令行配置 flag 之外，Babel 还支持配置文件，比如这里做的 ES6 语法转换，用到的是 babel-loader，这个 Loader 依赖@babel/core 和@babel/preset-env。
然后在项目的根目录下，创建一个 babel 的配置文件.babelrc，内容如下：

```js
// .babelrc
{
	"presets": ["@babel/preset-env"]
}
```
Babel 会在正在被转义的文件当前目录中查找一个 .babelrc 文件。 如果不存在，它会向外层目录遍历目录树，直到找到一个 .babelrc 文件，或一个 package.json 文件中有 `"babel": {}`
有了 babel-loader，可以使用 webpack 命令的—module-bind 来指定对应的文件需要经过怎样的 Loader 处理：

```js
"scripts": {
    "dev": "webpack --mode development ./src/index.js --module-bind js=babel-loader",
    "build": "webpack --mode production ./src/index.js --module-bind js=babel-loader"
}
```
### env
如果希望在不同的环境中使用不同的 Babel 配置，那么可以在配置文件中添加 env 选项，env 选项的值将从 process.env.BABEL_ENV 获取，如果没有的话，则获取 process.env.NODE_ENV 的值，它也无法获取时会设置为 “development”。

```js
// .babelrc
{
  "env": {
    "production": {
      "presets": ["@babel/preset-env"]
    }
  }
}
```
### plugin
Babel 的插件分为两类：转换插件和语法解析插件。转换插件主要职责是进行语法转换，而解析插件则是扩展语法。

如果不想一个个的添加插件，那么可以使用插件组合 preset（插件预设，插件组合更加好理解一些），最常见的 preset 是@babel/preset-env。
@babel/preset-env 是 Babel 官方推出的插件预设，它可以根据开发者的配置按需加载对应的插件。
- 如果在 ES5 中，有些对象、方法实际在浏览器中可能是不支持的，例如：Promise、Array.prototype.includes，这时候就需要用 @babel/polyfill 来做模拟处理。

```js
// polyfill需要在文件内引入
import '@babel/polyfill'
```
s 3. @babel/polyfill 会直接修改内置的原型，且无法按需引入，可以使用@babel/runtime 的方案。 4. @babel/polyfill 和@babel/runtime 两种方式都比较繁琐，可以使用 @babel/preset-env 的 useBuildIns 选项做 polyfill，useBuiltIns 默认为 false，可以使用的值有 usage 和 entry

```js
// .babelrc
{
  "presets": [
    ["@babel/preset-env", {
			"useBuiltIns": "usage|entry|false",
			"corejs": 3,
			"targets": {
        "browsers": "IE 10"
      }
    }]
  ]
}
```
usage 表示明确使用到的 Polyfill 引用，一般情况下 usage 就能满足日常开发。
polyfill 用到的 core-js 是可以指定版本的，比如使用 core-js@3，则首先安装依赖 `npm i -S core-js@3`，然后在 Babel 配置文件.babelrc 中写上版本。
使用 target 可以指定目标浏览器。

### webpack 中使用 Babel
```js
// webpack.config.js
module.exports = {
	entry: './babel.js',
	mode: 'development',
	devtool: false,
	module: {
		rules: [
			{
				test: /\.js$/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [
								[
									'@babel/preset-env',
									{
										useBuiltIns: 'usage',
									},
								],
							],
						},
					},
				],
			},
		],
	},
}
```
### Browserslist
Browserslist 用于设置目标浏览器的工具，声明一段浏览器的集合，工具可以根据这段集合描述，针对性的输出兼容性代码。
Browserslist 的配置可以放在 package.json 中，也可以单独放在配置文件.browserslistrc 中。所有的工具都会主动查找 browserslist 的配置文件，根据 browserslist 配置找出对应的目标浏览器集合。

```js
{
    "browserslist": ["last 2 version", "> 1%", "maintained node versions", "not ie ]
}
```
```plain
# .browerslistrc
# 每行一个浏览器集合描述
last 2 version
> 1%
maintained node versions
not ie
```

范围
说明

last 2 versions
最新两个版本

> 1%
全球超过 1%人使用的浏览器，类似> 5% in US 则指代美国 5%以上用户

cover 99.5%
覆盖 99.5%主流浏览器

chrome > 50 ie 6-8
指定某个浏览器版本范围 Android/Chrome/Firefox/Baidu/Edge/Electron…

unreleased versions
说有浏览器的 beta 版本

not ie < 11
排除 ie11 以下版本不兼容

since 2013 last 2 years
某时间范围发布的所有浏览器版本

maintained node versions
所有被 node 基金会维护的 node 版本

current node
当前环境的 node 版本

dead
全球使用率低于 0.5%且官方声明不在维护或者事实上已经两年没有再更新的版本

defaults
默认配置，> 0.5% last 2 versions Firefox ESR not dead

可以为不同的环境配置不同的目标浏览器。通过设置 BROWSERSLIST_ENV 或者 NODE_ENV 可以配置不同的环境变量。默认情况下会优先从 production 对应的配置项加载。在配置文件中，可以通过设置对应的环境目标浏览器：

```js
// package.json 写法
{
"browserslist": {
	"production": ["> 1%", "ie 10"],
	"development": ["last 1 chrome version", "last 1 firefox version"]
	}
}
```
```plain
#.browserslistrc：

[production staging]

> 1%
> ie 10

[development]
last 1 chrome version
last 1 firefox version
```