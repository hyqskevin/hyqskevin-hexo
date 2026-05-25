---
title: Webpack程序打包学习笔记(2)
date: 2020-07-05 00:00:00
categories:
  - study
tags:
  - Webpack
---

Webpack externals，target，resolve，module，plugin，devtool 的配置。

[Webpack 程序打包学习笔记(1)](https://hyqskevin.github.io/2020/06/28/Webpack_1/)
[Webpack 程序打包学习笔记(2)](https://hyqskevin.github.io/2020/07/05/Webpack_2/)
[Webpack 程序打包学习笔记(3)](https://hyqskevin.github.io/2020/07/13/Webpack_3/)

### externals
externals 配置项用于去除输出的打包文件中依赖的某些第三方 js 模块（例如 jquery，vue 等等），减小打包文件的体积。该功能通常在开发自定义 js 库（library）的时候用到，这些被依赖的模块应该由使用者提供，而不应该包含在 js 库文件中。

使用者依据 js 库的导出方式来提供依赖模块，如果没有设置 output.library, output.libraryTarget 等配置信息，那么以 `<script>` 标签的方式在页面中引入，被去除的依赖模块以全局变量的方式引入。导出方式为 commonjs/amd/umd 则被依赖模块以各自规范引入。

### target
webpack 中可以通过设置 target 来指定应用构建的目标（web/nodejs 服务/electron 应用…）；target 的值有两种类型：string 和 function。

```js
module.exports = {
	target: 'web', // 默认是 web，可以省略
}
```
```js
const webpack = require('webpack')

const options = {
	// function 类型，接收compiler作为参数
	target: (compiler) => {
		compiler.apply(
			new webpack.JsonpTemplatePlugin(options.output),
			new webpack.LoaderTargetPlugin('web')
		)
	},
}
```
string 类型支持下面的七种：

- web：默认，编译为类浏览器环境里可用；
- node：编译为类 Node.js 环境可用（使用 Node.js require 加载 chunk）；
- async-node：编译为类 Node.js 环境可用（使用 fs 和 vm 异步加载分块）；
- electron-main：编译为 Electron 主进程；
- electron-renderer：编译为 Electron 渲染进程；
- node-webkit：编译为 Webkit 可用，并且使用 jsonp 去加载分块。支持 Node.js 内置模块和 nw.gui 导入（实验性质）；
- webworker：编译成一个 WebWorker。

### resolve
resolve 配置是帮助 Webpack 查找依赖模块，也可以替换对应的依赖。

常用的 resolve 配置：

- resolve.extensions：帮助 Webpack 解析扩展名的配置，默认值：[‘.wasm’, ‘.mjs’, ‘.js’, ‘.json’]，所以我们引入 js 和 json 文件，可以不写它们的扩展名，通常我们可以加上 .css、.less 等，但是要确保同一个目录下面没有重名的 css 或者 js 文件。
- resolve.alias：最常用的配置，通过设置 alias 可以缩短目录写法，帮助 webpack 更快查找模块依赖，也能使我们编写代码更加方便。设置了 alias，我们可以在任意文件中，不用理会目录结构，直接使用 require(‘@lib/utils’)或者 require(‘src/lib/utils’)来帮助 Webpack 定位模块。

```js
module.exports = {
	resolve: {
		extensions: ['.js', '.json', '.css'],
		alias: {
			src: path.resolve(__dirname, 'src'),
			'@lib': path.resolve(__dirname, 'src/lib'),
		},
	},
}
```

- 设置 alias 会导致我们检测不到目录中的内容，不能帮我们快速编写代码，可以通过在项目根目录创建 jsconfig.json 来帮助我们定位

```js
//jsconfig.json
{
	"compilerOptions": {
		"baseUrl": "./src",
		"paths": {
			"@lib/": ["src/lib"]
		}
	}
}
```

- alias 还常被用于给生产环境和开发环境配置不同的 lib 库

```js
module.exports = {
	resolve: {
		alias: {
			san:
				process.env.NODE_ENV === 'production'
					? 'san/dist/san.min.js'
					: 'san/dist/san.dev.js',
		},
	},
}
```

- alias 还支持在名称末尾添加$符号来缩小范围只命中以关键字结尾的导入语句，这样可以做精准匹配：

```js
module.exports = {
	// 对 react 进行精确匹配
	resolve: {
		alias: {
			react$: '/path/to/react.min.js',
		},
	},
}
```

- resolve.mainFields：针对不同宿主环境提供几份代码，例如提供 ES5 和 ES6 的两份代码，或者提供浏览器环境和 nodejs 环境两份代码
- resolve.modules：查找模块依赖时，默认是 node_modules
- resolve.symlinks：是否解析符合链接（软连接，symlink）
- resolve.plugins：添加解析插件，数组格式
- resolve.cachePredicate：是否缓存，支持 boolean 和 function，function 传入一个带有 path 和 require 的对象，必须返回 boolean 值

### module
在 webpack 解析模块的同时，不同的模块需要使用不同类型的模块处理器来处理，这部分的设置就在 module 配置中。
module 有两个配置：module.noParse 和 module.rules

module.rules 是在处理模块时，将符合规则条件的模块，提交给对应的处理器来处理，通常用来配置 loader，其类型是一个数组，数组里每一项都描述了如何去处理部分文件。
每一项 rule 大致可以由以下三部分组成：

条件匹配：通过 test、include、exclude 配置命中可以应用规则的模块文件，匹配的对象包括三类：

- resource：请求文件的绝对路径
- resourceQuery： ?之后的条件
- issuer: 被请求资源的绝对路径，即导入时的位置

```js
{
	// 来自src和test文件夹，不包含node_modules和bower_modules子目录，模块的文件路径为.tsx和.jsx结尾的文件
	rules: [
		test: [/\.jsx?$/, /\.tsx?$/],
		include: [
				path.resolve(__dirname, 'src'),
				path.resolve(__dirname, 'test')
		],
		exclude: [
				path.resolve(__dirname, 'node_modules'),
				path.resolve(__dirname, 'bower_modules')
		]
	]
}
```

- 应用规则：对匹配条件通过后的模块，使用 use 配置项来应用 loader，loader 是解析处理器，使用对应的 loader 之前，需要先安装它

```js
// 指定*.less文件都是用less-loader
rules:[
	test: /\.less$/, use:'less-loader'
]
```
给 loader 传参的方式有两种：通过 options 传入和通过 query 的方式传入

```js
// config内写法，通过 options 传入
module: {
	rules: [
		{
			test: /\.html$/,
			use: [
				{
					loader: 'html-loader',
					options: {
						minimize: true,
						removeComments: false,
						collapseWhitespace: false,
					},
				},
			],
		},
	]
}
// config内写法，通过 query 传入
module: {
	rules: [
		{
			test: /\.html$/,
			use: [
				{
					loader:
						'html-loader?minimize=true&removeComments=false&collapseWhitespace=false',
				},
			],
		},
	]
}
```

- 执行顺序：一组 loader 的执行顺序默认是**从后到前（或者从右到左）**执行，通过 enforce 选项可以让其中一个 loader 的执行顺序放到最前（pre）或者是最后（post）。

```js
// query 写法从右到左，使用!隔开
const styles = require('css-loader!less-loader!./src/index.less')
// 数组写法，从后到前
module.exports = {
	module: {
		rules: [
			{
				test: /\.less$/,
				use: [
					{
						loader: 'style-loader',
					},
					{
						loader: 'css-loader',
					},
					{
						loader: 'less-loader',
					},
				],
			},
		],
	},
}
```
如果需要调整 Loader 的执行顺序，可以使用 enforce，enforce 取值是 pre|post，pre 表示把放到最前，post 是放到最后：

```js
use: [
	{
		loader: 'babel-loader',
		options: {
			cacheDirectory: true,
		},
		// enforce:'post' 的含义是把该 loader 的执行顺序放到最后
		// enforce 的值还可以是 pre，代表把 loader 的执行顺序放到最前
		enforce: 'post',
	},
]
```
oneOf 表示对该资源只应用第一个匹配的规则，一般结合 resourceQuery，具体代码来解释：

```js
module.exports = {
	//...
	module: {
		rules: [
			{
				test: /\.css$/,
				oneOf: [
					{
						resourceQuery: /inline/, // foo.css?inline
						use: 'url-loader',
					},
					{
						resourceQuery: /external/, // foo.css?external
						use: 'file-loader',
					},
				],
			},
		],
	},
}
```

module.noParse 配置项可以让 Webpack 忽略对部分没采用模块化的文件的递归解析和处理，这样做的好处是能提高构建性能，接收的类型为正则表达式，或者正则表达式数组或者接收模块路径参数的一个函数。
一定要确定被排除出去的模块代码中不能包含 import、require、define 等内容，以保证 webpack 的打包包含了所有的模块，不然会导致打包出来的 js 因为缺少模块而报错。

```js
module.exports = {
	module: {
		// 使用正则表达式
		noParse: /jquery|lodash/

		// 使用函数，从 Webpack 3.0.0 开始支持
		noParse: (content) => {
			// content 代表一个模块的文件路径
			// 返回 true or false
			return /jquery|lodash/.test(content);
		}
}
}
```
### plugin
plugin 是 Webpack 的重要组成部分，可以直接通过 webpack 对象的属性来直接使用。loader 面向的是解决某个或者某类模块的问题，而 plugin 面向的是项目整体，解决的是 loader 解决不了的问题。

```js
module.exports = {
    //....
    plugins: [
        // 压缩js
        new webpack.optimize.UglifyJsPlugin();
    ]
}

// 除了内置的插件，我们也可以通过 NPM 包的方式来使用插件：
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
    //....
    plugins: [
        // 导出css文件到单独的内容
        new ExtractTextPlugin({
            filename: 'style.css'
        })
    ]
};
```
### devtool
devtool 是来控制怎么显示 sourcemap，通过 sourcemap 我们可以快速还原代码的错误位置