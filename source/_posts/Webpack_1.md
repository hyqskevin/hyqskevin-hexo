---
title: Webpack程序打包学习笔记(1)
date: 2020-06-28 00:00:00
categories:
  - study
tags:
  - Webpack
---

像 Grunt、Gulp 这类构建工具，打包的思路是：遍历源文件 → 匹配规则 → 打包，这个过程中做不到按需加载，即对于打包起来的资源，到底页面用不用，打包过程中是不关心的。

webpack 跟其他构建工具本质上不同之处在于：webpack 是从入口文件开始，经过模块依赖加载、分析和打包三个流程完成项目的构建。在加载、分析和打包的三个过程中，可以针对性的做一些解决方案，还可以轻松的解决传统构建工具解决的问题：

模块化打包，一切皆模块，JS 是模块，CSS 等也是模块；
语法糖转换：比如 ES6 转 ES5、TypeScript；
预处理器编译：比如 Less、Sass 等；
项目优化：比如压缩、CDN；
解决方案封装：通过强大的 Loader 和插件机制，可以完成解决方案的封装，比如 PWA；
流程对接：比如测试流程、语法检测等。

## webpack-cli
Webpack-cli 是 Webpack 的 CLI （Command-line interface）工具，如果在项目中，可以使用下面的方式安装：

npm install webpack-cli —save-dev
如果想全局使用 webpack 的命令，可以使用 npm install -g webpack-cli 安装。
Webpack 的打包环境有 production 和 development 两种，分别对应生产环境和开发环境，生产环境默认配置包括压缩等常用的配置。
Webpack 默认的入口文件是 src/index.js；
Webpack 的默认输出目录是 dist/main.js。

- Tips：这里建议在项目中安装 webpack-cli 并且使用 —save-dev 的配置将 webpack-cli 放到开发依赖中。

```js
"scripts": {
  "dev": "webpack --mode development",
  "build": "webpack --mode production"
}
```
我们如果要修改 Webpack 的默认输出目录，需要用到 Webpack 命令的—output，我们将上面的 npm scripts 做下修改：

```js
"scripts": {
  "dev": "webpack --mode development --output ./output/main.js",
  "build": "webpack --mode production --output ./output/main.js"
}
```
webpack-cli 技巧：

- 当项目逐渐变大或者使用生产环境打包的时候，Webpack 的编译时间会变长，可以通过参数让编译的输出内容带有进度和颜色： webpack —progress —colors；
- Webpack 的配置比较复杂，很容出现错误，如果出问题，会打印一些简单的错误信息，我们还可以通过参数 —display-error-details 来打印错误详情：webpack —display-error-details；
- 如果不想每次修改模块后都重新编译，那么可以启动监听模式，开启监听模式后，没有变化的模块会在编译后缓存到内存中，而不会每次都被重新编译，所以监听模式的整体速度是很快的：webpack —watch；
- webpack-cli 支持两个快捷选项：-d 和 -p ，分别代表一些常用的开发环境和生产环境的打包。
常用 webpack 配置选项：
–config：指定一个 Webpack 配置文件的路径；
–mode：指定打包环境的 mode，取值为 development 和 production，分别对应着开发环境和生产环境；
–json：输 mode 出 Webpack 打包的结果，可以使用 webpack —json > stats.json 方式将打包结果输出到指定的文件；
–progress：显示 Webpack 打包进度；
–watch, -w：watch 模式打包，监控文件变化之后重新开始打包；
–color, —colors/–no-color, —no-colors：控制台输出的内容是否开启颜色；
–hot：开启 Hot Module Replacement 模式，后面会详细介绍；
–profile：会详细的输出每个环节的用时（时间），方便排查打包速度瓶颈。

## 配置 webpack.config.js
可以通过修改 Webpack 的配置文件（webpack.config.js）来对 Webpack 进行配置，Webpack 的配置文件遵循 Node.js 的 CommonJS 模块规范
Webpack 配置文件语法和类型多样，不仅支持 js 配置，还支持 ts（TypeScript）、CoffeeScript 甚至 JSX 语法的配置；除了使用对象类型，Webpack 还支持函数、Promise 和多配置数组。

```js
// 基本配置
const path = require('path')

module.exports = {
	mode: 'development',
	entry: './index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'index.bundle.js',
	},
}
```
如果只使用一个配置文件来区分生产环境（production）和开发环境（development），则可以使用函数类型的 Webpack 配置，函数类型的配置必须返回一个配置对象

Webpack 配置函数接受两个参数 env 和 argv：分别对应着环境对象和 Webpack-CLI 的命令行选项

```js
module.exports = (env, argv) => {
	return {
		mode: env.production ? 'production' : 'development',
		devtool: env.production ? 'source-maps' : 'eval',
		plugins: [
			new TerserPlugin({
				terserOptions: {
					compress: argv['optimize-minimize'], // 只有传入 -p 或 --optimize-minimize
				},
			}),
		],
	}
}
```
如果需要异步加载一些 Webpack 配置需要做的变量，那么可以使用 Promise 的方式来做 Webpack 的配置

```js
module.exports = () => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve({
				entry: './app.js',
				/* ... */
			})
		}, 5000)
	})
}
```
在一些特定的场景可能需要一次打包多次，而多次打包中有一些通用的配置，这时候可以使用配置数组的方式，将两次以上的 Webpack 配置以数组的形式导出

```js
module.exports = [
	{
		mode: 'production',
		// 配置1
	},
	{
		// 配置2
	},
]
```
Webpack 配置 常见名词

参数
说明

entry
项目入口，包括字符串、对象、数组

module
开发中每一个文件都可以看做 module，模块不局限于 js，也包含 css、图片等

chunk
代码块，一个 chunk 可以由多个模块组成

loader
模块转化器，模块的处理器，对模块进行转换处理

plugin
扩展插件，插件可以处理 chunk，也可以对最后的打包结果进行处理，可以完成 loader 完不成的任务

bundle
最终打包完成的文件，一般就是和 chunk 一一对应的关系，bundle 就是对 chunk 进行便意压缩打包等处理后的产出

mode
指定开发环境打包

context
项目打包的相对路径，指定之后设置的 entry 和 output 的相对路径都是相对于 context；在实际开发中一般不需要配置

默认情况下，Webpack 会查找执行目录下面的 webpack.config.js 作为配置，如果需要指定某个配置文件，可以使用命令：`webpack --config webpack.config.js`
Webpack4.0 开始引入了 mode 配置，通过配置 mode=development 或者 mode=production 来制定是开发环境打包，还是生产环境打包
除了在配置文件中设置 mode：

```js
module.exports = {
	mode: 'development',
}
```
还可以在命令行中设置 mode：`npm webpack --config webpack.config.entry.js --mode development`

### entry
entry 包括了单文件入口和多文件入口两种方式。单文件入口可以快速创建一个只有单一文件入口的情况，多文件入口是使用对象语法来通过支持多个 entry，具有较高的灵活性，可用于多页应用、页面模块分离优化。

```js
// 单文件
module.exports = {
	entry: 'index.js',
}

// 或者使用对象方式
module.exports = {
	entry: {
		main: 'index.js',
	},
}

module.exports = {
	mode: 'development',
	entry: ['./src/app.js', './src/home.js'],
	output: {
		filename: 'array.js',
	},
}
```

- 如果直接是 string 的形式，那么 webpack 就会直接把该 string 指定的模块（文件）作为入口模块
- 如果是数组 [string] 的形式，那么 webpack 会自动生成另外一个入口模块，并将数组中每个元素指定的模块（文件）加载进来，并将最后一个模块的 module.exports 作为入口模块的 module.exports 导出。

```js
// 多文件
module.exports = {
	entry: {
		home: 'home.js',
		search: 'search.js',
		list: 'list.js',
	},
}
```
### output
output 的每一个 bundle 对应了 entry 的文件编译打包后的结果，output 的常用属性有：

path
此选项制定了输出的 bundle 存放的路径，比如 dist、output 等，不指定 output 时输出到 dist
filename
这个是 bundle 的名称，不指定 output 时输出为 dist/main.js
publicPath
指定了一个在浏览器中被引用的 URL 地址，当文件路径不同于他们的本地磁盘路径（由 output.path 指定）时，output.publicPath 被用来作为 src 或者 link 指向该文件。这种做法在需要将静态文件放在不同的域名或者 CDN 上面的时候是很有用的。
library
如果打包生成一个供别人使用的库，那么可以使用 output.library 来指定库的名称，库的名称支持占位符和普通字符串：`library: 'myLib'`
libraryTarget
使用 output.libraryTarget 指定库打包出来的规范，取值范围为：var、assign、this、window、global、commonjs、commonjs2、commonjs-module、amd、umd、umd2、jsonp

一个 webpack 的配置，可以包含多个 entry，但是只能有一个 output，对于不同的 entry 可以通过 output.filename 占位符语法来区分。

```js
module.exports = {
	entry: {
		home: 'home.js',
		search: 'search.js',
		list: 'list.js',
	},
	output: {
		filename: '[name].js', // [name]为占位符，对应entry的key（home. search, list）
		path: __dirname + '/dist',
		publicPath: '/assets/', // CDN：publicPath: 'http://cdn.example.com/assets/'
	},
}
```
Webpack 目前支持的占位符：

占位符
含义

[hash]
模块标识符的 hash

[chunkhash]
chunk 内容的 hash

[name]
模块名称

[id]
模块标识符

[query]
模块的 query，例如，文件名 ? 后面的字符串

[function]
一个 return 出一个 string 作为 filename 的函数

[name]：对应的是 entry 的 key（home、search、list…）
[hash]：是整个项目的 hash 值，其根据每次编译内容计算得到，每次编译之后都会生成新的 hash，即修改任何文件都会导致所有文件的 hash 发生改变；在一个项目中虽然入口不同，但是 hash 是相同的；hash 无法实现前端静态资源在浏览器上长缓存，这时候应该使用 chunkhash
[chunkhash]：根据不同的入口文件（entry）进行依赖文件解析，构建对应的 chunk，生成相应的 hash；只要组成 entry 的模块文件没有变化，则对应的 hash 也是不变的，所以一般项目优化时，会将公共库代码拆分到一起，因为公共库代码变动较少的，使用 chunkhash 可以发挥最长缓存的作用
[hash] 和 [chunkhash] 的长度可以使用 [hash:16]（默认为 20）来指定。或者，通过指定 output.hashDigestLength 在全局配置长度
占位符是可以组合使用的，例如[name]-[hash:8]

---

[Webpack 程序打包学习笔记(2)](https://hyqskevin.github.io/2020/07/05/Webpack_2/)
[Webpack 程序打包学习笔记(3)](https://hyqskevin.github.io/2020/07/13/Webpack_3/)