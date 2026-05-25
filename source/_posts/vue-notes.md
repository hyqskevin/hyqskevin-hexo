---
title: Vue功能实现和使用技巧
date: 2020-11-10 00:00:00
categories:
  - study
tags:
  - Vue
---

汇总记录前端开发时，使用 Vue 框架遇到的功能实现和开发技巧。

## Vue 动态组件使用
动态组件功能用于在不同组件之间进行动态切换，可以通过 Vue 的 `<component>` 元素加一个特殊的 is attribute 来实现

```js
// `currentComponent` 改变时显示的组件同时改变
"currentComponent">component>
"(currentComponent === 'A') ? 'B':'A'">Switch/button>

//引入组件A以及组件B
import A from "./a"
import B from "./b"
export default {
  components: {A, B},
  data () {
    return {
      //默认显示组件A，若字符串为B则显示组件B,name为component声明
      currentComponent: 'A'
    }
  }
}
```

- v-show，v-if，:is 之间的区别

`v-show` 会同时加载两个组件，两个组件的生命周期都会触发，会造成不必要的性能浪费，而且切换的时候不会再创造挂载一次，无法重新渲染。
`v-if` 不会造成同时加载两个组件，但 v-if 每次切换都会创造挂载一次，如果没有重新渲染的需要，会造成性能浪费。
`:is` 可以通过 keep-alive 标签缓存，被该标签包裹的组件会被缓存下来，每次点击都不会重新渲染，避免了重渲染导致的性能问题。`include` 和 `exclude` 属性也允许组件有条件地缓存。二者都可以用逗号分隔字符串、正则表达式或一个数组来表示。

```html
keep-alive include="a,b">
	component :is="currentComponent">component>
keep-alive>

keep-alive :include="/a|b/">
	component :is="currentComponent">component>
keep-alive>

keep-alive :include="['a', 'b']">
	component :is="currentComponent">component>
keep-alive>
```
## 动态路由匹配
动态路由用于把某种模式匹配到的所有路由，全都映射到同个组件，可以在 vue-router 的路由路径中使用“动态路径参数”(dynamic segment) 来达到这个效果。一个“路径参数”使用冒号 : 标记。当匹配到一个路由时，参数值会被设置到 `this.$route.params`，可以在每个组件内使用。

```js
const router = new VueRouter({
	routes: [
		// 动态路径参数 以冒号开头
		{ path: '/user/:id', component: User },
	],
})
```
## 页面跳转和导航

-  定义链接实现声明式导航

`<router-link :to="...">` 内部调用 `router.push` 方法实现页面导航

```html
router-link :to="{name: 'detail', params: {name: 1}}"> xxx router-link>
router-link :to="{name: 'detail', query: {id: 1}}"> xxx router-link>
```

- 可以使用 `this.$route.params` 或 `this.$route.params` 获取路由参数。

- router 实例实现编程式导航

在 Vue 实例内部，可以通过 `$router` 访问路由实例，可以调用 `this.$router.push` 方法，向 history 栈添加一个新的记录，点击浏览器后退按钮时也可以回到之前的 URL。
params 相对应的是 name， query 相对应的是 path

```js
// 字符串
router.push('home')
// 对象
router.push({ path: 'home' })
// 命名的路由/user/123
router.push({ name: 'user', params: { uid: '123' } }) // 刷新后参数会被清空
router.push({ path: `/user/${userId}` }) // 刷新后参数不会被清空
// 带查询参数，/home?uid=123
router.push({ path: 'home', query: { uid: '123' } }) // 刷新后不会被清空
```

- `router.replace('')` 跳转页面会替换掉原有的 history 记录
- `router.go(n)` 在 history 记录中前进或后退多少步

## keep-alive 网页性能优化
keep-alive 主要用于保留组件状态或避免重新渲染 DOM 导致性能降低，通常都会在 `app.vue` 的 `<router-view/>` 外面加一层 `<keep-alive>`

```html
keep-alive>
	router-view />
keep-alive>
```
这样做也会导致一些问题，当组件的值更新后组件没有被重新渲染，做到动态显示需要使用额外生命周期函数 `activated`
进入页面会执行 mounted 和 activated，当修改值后再次进入首页不会再执行 mounted 触发新的数据请求，但是 activated 会继续执行。可以在 activated 函数中判断新数据和前一次显示是否相同，如果不同再次触发 ajax 数据请求。

```js
mounted () {
   this.lastData = this.data;
   this.getNewData();
}
activated () {
   if (this.lastData !== this.data) {
      this.lastData = this.data;
      this.getNewData();
   }
}
```
在路由更新后页面由于 keep-alive 的缓存不会执行 mounted 触发刷新，需要设置路由的 key 值，在每次进入页面时比较路由名称，若不相同则刷新页面。

```js
/*App.vue*/

   "key" />
/keep-alive>

export default {
  name: 'App',
  computed: {
    key () {
      return this.$route.name !== undefined
        ? this.$route.name + +new Date()
        : this.$route + +new Date()
    }
  }
}
script>
```
## Vuex 数据防刷新丢失
引入 vuex-persist 插件将状态保存至 cookie 或者 localStorage 中，刷新后数据不丢失。

```js
import VuexPersistence from 'vuex-persist'
const vuexLocal = new VuexPersistence({
	storage: window.localStorage,
})
const store = new Vuex.Store({
  state: { ... },
  mutations: { ... },
  actions: { ... },
  plugins: [vuexLocal.plugin]
})
```
## 自定义指令避免误触和多次点击
使用 Vue.directive 自定义防误触指令

```js
import Vue from 'vue'

const preventReClick = Vue.directive('preventReClick', {
	inserted: function (el, binding) {
		// 增加监听事件
		el.addEventListener('click', () => {
			if (!el.disabled) {
				el.disabled = true
				setTimeout(() => {
					el.disabled = false
				}, binding.value || 3000)
			}
		})
	},
})
export default { preventReClick }
```
## 制作可复用组件
复用组件需要在样式和功能上做到继承和迭代，是在系统整体设计时抽象出的组件，多为布局组件，不涉及详细的功能实现。组件需要做到高内聚低耦合，组件内独立交互，功能受控于组件本身。

```js
// 按钮组件抽象，样式设置为外部继承 cname，和内部自定义 button，留出按钮名称 title 和  插槽作为具体内容的补充空间
class="[button, cname]">
  {{ title }}/div>
  >
/div>

export default {
  name: 'BigBtn',
  // 通过 props 传入外部参数
  props: {
    cname: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: 'title'
    }
  },
  // 设置内部定义的样式
  data () {
    return {
      button: 'button'
    }
  }
}
script>

"stylus">
// 引入样式
@import "~@/styles/button.styl"
.button
  bigBtn() // 默认样式
.blueBtn
  bigBtn($btnColor: $btnBlue) // cname 传入 blueBtn 设置颜色为蓝色
.greenBtn
  bigBtn($btnColor: $btnGreen) // cname 传入 greenBtn 设置颜色为绿色
/style>
```
## 上传文件功能
使用 element-ui 的 upload 功能实现图片展示，上传和读取，on-change 触发文件状态改变时的钩子，调用上传照片 api 将照片数据传递到后台；on-preview 用于显示已上传的图片的缩略图；传递多个文件时文件列表存储在 file-list 中。

```html
el-upload
	action="actionUrl"
	list-type="picture-card"
	ref="upload"
	:file-list="fileList"
	:auto-upload="false"
	:on-change="getFile"
	:on-preview="handlePictureCardPreview"
>
	div slot="tip" class="el-upload__tip">上传一张jpg/png文件div>
	el-icon class="el-icon-plus">el-icon>
el-upload>
```
```js
// 获取文件信息
getFile (file) {
  let uid = this.$store.state.currentUid
  // 调用上传照片的api
  api._updImage(uid, this.aid, res).then(res => {
    ...
  })
}
```
若上传 base64 位图片需要进行转码之后调用 api 上传：

```js
// 图片转base64
getBase64 (file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    let imgResult = ''
    reader.readAsDataURL(file)
    reader.onload = function () {
      imgResult = reader.result
    }
    reader.onerror = function (error) {
      reject(error)
    }
    reader.onloadend = function () {
      resolve(imgResult)
    }
  })
}
```
## Vuex 监听状态变更
Vuex 允许我们在 store 中定义“getter”（可以认为是 store 的计算属性）。就像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。

```js
state: {
  updFlag: false
},
// 添加计算属性，依赖值改变时重新计算
getters: {
  updFlag: state => state.updFlag
},
// 执行状态变更
mutations: {
  updateFlag (state, update) {
    state.updFlag = update
  },
}
```
## 兄弟组件，跨多层组件之间事件传递方法
[官方链接：集中式的事件中间件](https://cn.vuejs.org/v2/guide/migration.html#dispatch-%E5%92%8C-broadcast-%E6%9B%BF%E6%8D%A2)

使用集中的事件处理器，建立一个空的 vue 实例实现了事件分发接口。在初始化 web app 的时候，给 data 添加一个 eventhub 的空 vue 对象。然后在组件中，可以使用 $emit，$on，$off 分别来分发、监听、取消监听事件。

```js
new Vue({
	el: '#app',
	router,
	render: (h) => h(App),
	data: {
		eventHub: new Vue(),
	},
})
```
或者在初始化 Vue 对象之前给原生对象增加 eventHub 属性，这样在组件内部 就可以直接调用`$eventHub`对象。
`Vue.prototype.$eventHub= Vue.prototype.$eventHub || new Vue()`

发送数据：`this.$root.eventHub.$emit('YOUR_EVENT_NAME', yourData)`
接收数据：`this.$root.eventHub.$on('YOUR_EVENT_NAME', yourData)`
销毁数据：`this.$root.eventHub.$off()` // 在组件销毁时需要结束绑定,使用 `$off` 方法

```js
// 发送数据
methods: {
  addTodo: function () {
    eventHub.$emit('add-todo', { text: this.newTodoText })
    this.newTodoText = ''
  },
  deleteTodo: function (id) {
    eventHub.$emit('delete-todo', id)
  }
}
```
```js
// 接收数据
methods: {
 addTodo (newTodo) {
   this.todos.push(newTodo)
 },
 deleteTodo (todoId) {
   this.todos = this.todos.filter(function (todo) {
     return todo.id !== todoId
   })
 }
}
created () {
 eventHub.$on('add-todo', this.addTodo)
 eventHub.$on('delete-todo', this.deleteTodo)
},
// 最好在组件销毁前清除事件监听
beforeDestroy () {
 eventHub.$off('add-todo', this.addTodo)
 eventHub.$off('delete-todo', this.deleteTodo)
}
```
## 回到顶部功能
使用 element-ui 中提供的功能实现：

```js
target=".page-component__scroll .el-scrollbar__wrap"
	visibility-height="200"
	right="30"
	bottom="30"
>
	up
/el-backtop>
```
也可以使用 better-scroll 插件实现，通过监听下拉时 y 轴的移动距离显示上拉按钮，点击后触发返回顶部事件。

```js
// 回到开头
toTop () {
  if (this.toTop) {
    // 延迟20ms后在1s内回到顶部
    setTimeout(() => {
      this.scrollTo(0, 0, 1000)
    }, 20)
  }
}
```
## element-ui 按需引入
通过借助 `babel-plugin-component` 或直接修改 `.babelrc` 文件，我们可以只引入需要的组件，以达到减小项目体积的目的。

引入插件：`npm install babel-plugin-component -D`
修改 babel 配置文件：

```bash
"plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
```
在 src 文件夹中 plugins 文件夹内新建一个 element.js 文件，导入需要的组件

```js
// 导入自己需要的组件
import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
import {
	Select,
	Option,
	OptionGroup,
	Input,
	Tree,
	Dialog,
	Row,
	Col,
} from 'element-ui'
const element = {
	install: function (Vue) {
		Vue.use(Select)
		Vue.use(Option)
		Vue.use(OptionGroup)
		Vue.use(Input)
		Vue.use(Tree)
		Vue.use(Dialog)
		Vue.use(Row)
		Vue.use(Col)
	},
}
export default element
```
最后在 main.js 中引入 element.js 文件 `import './plugins/element.js'`

## 表单设置日期限制
element-ui 支持在创建表单时使用规则校验，可以在校验中自定义校验规则。

在日期选择时需要实现截止日期必须大于等于开始日期，在 vue 组件中定义表单数据和校验规则并在 endDate 中自定义校验规则 `checkEnd`：

```js
data () {
  return: {
    ruleForm: {
      startDate: '',
      endDate: ''
    }
    rules: {
      startDate: [
        { required: true, message: '请选择开始日期', trigger: 'change' }
      ],
      endDate: [
        { required: true, message: '请选择截止日期', trigger: 'change' },
        { validator: checkEnd, trigger: 'change' }
      ]
    }
  },
}
```
在 data 中设置变量 `checkEnd` 来实现校验规则，校验错误时返回提示：

```js
data () {
  let checkEnd = (rule, value, callback) => {
    let startDate = this.ruleForm.startDate
    if (startDate === '') {
      callback(new Error('请先选择开始日期！'))
    }
    let start = new Date(startDate)
    let end = new Date(value)
    if ((start !== '') && (end 
      callback(new Error('结束日期不能小于开始日期！'))
    } else {
      callback()
    }
  }
}
```
## 表单身份证校验
通过自定义表单校验规则进行身份证的校验，新建 idValidate.js 文件实现身份证校验算法。

```js
let checkId = (rule, value, callback) => {
	let errorMsg = idValidate(value)
	if (errorMsg !== '') {
		callback(new Error(errorMsg))
	} else {
		callback()
	}
}
```
```js
/* idValidate.js */
// 身份校验的方法
export default function isIdentityId(identityId) {
	const pattern = /(^\d{15}$)|(^\d{17}(\d|X|x)$)/ // 15或18位长度或格式校验
	// 地区校验
	const aCity = {
		11: '北京',
		12: '天津',
		13: '河北',
		14: '山西',
		15: '内蒙古',
		21: '辽宁',
		22: '吉林',
		23: '黑龙江',
		31: '上海',
		32: '江苏',
		33: '浙江',
		34: '安徽',
		35: '福建',
		36: '江西',
		37: '山东',
		41: '河南',
		42: '湖北',
		43: '湖南',
		44: '广东',
		45: '广西',
		46: '海南',
		50: '重庆',
		51: '四川',
		52: '贵州',
		53: '云南',
		54: '西藏',
		61: '陕西',
		62: '甘肃',
		63: '青海',
		64: '宁夏',
		65: '新疆',
		71: '台湾',
		81: '香港',
		82: '澳门',
		91: '国外',
	}
	// 出生日期验证
	const sBirthday = (
		identityId.substr(6, 4) +
		'-' +
		Number(identityId.substr(10, 2)) +
		'-' +
		Number(identityId.substr(12, 2))
	).replace(/-/g, '/')
	let d = new Date(sBirthday)
	// 身份证号码校验 最后4位  包括最后一位的数字/字母X
	let sum = 0
	let weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
	let codes = '10X98765432'
	let errorMsg = ''
	for (let i = 0; i 1; i++) {
		sum += identityId[i] * weights[i]
	}
	const last = codes[sum % 11] // 计算出来的最后一位身份证号码
	if (identityId === '') {
		errorMsg = '身份证号不能为空'
	} else if (!pattern.exec(identityId)) {
		errorMsg = '身份证长度或格式错误'
	} else if (!aCity[parseInt(identityId.substr(0, 2))]) {
		errorMsg = '身份证地区非法'
	} else if (
		sBirthday !==
		d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate()
	) {
		errorMsg = '出生日期非法'
	} else if (identityId[identityId.length - 1] !== last) {
		errorMsg = '输入的身份证号校验码不正确'
	}
	return errorMsg
}
```
## 持续拉取后台数据
实现后台请求数据时不一次性返回，需要返回一部分就显示一部分。`setInterval()` 方法可按照指定的周期（以毫秒计）来调用函数或计算表达式。

```js
methods: {
  func () {
    ...
  }
}
mounted () {
  // 建议使用箭头函数
  setInterval(() => {
    this.func()
  }, 500)
}
```
## 添加和删除属性（不再使用）
在 vue 中，直接使用赋值语句无法触发视图页面更新；对于已经创建的实例，Vue 不允许动态添加根级别的响应式 property。但是，可以使用 set 和 delete 修改 property 来触发视图更新。

**Vue.set( target, propertyName/index, value )**

参数：
{Object | Array} target
{string | number} propertyName/index
{any} value

还可以使用 vm.$set 实例方法，是全局 Vue.set 方法的别名

**Vue.delete( target, propertyName/index )**

参数：
{Object | Array} target
{string | number} propertyName/index

还可以使用 vm.$delete 实例方法

vue 2.x 之后，Vue.set 和 Vue.delete 在实例上将不再起作用。现在都强制在实例的 data 选项中声明所有顶级响应值，通过改变 data 值实现相应。

## 其它注意事项

监听组件原生事件
`@click.native=`可以在子组件监听根元素的原生事件，不需要通过`$emit`事件

ref 属性
给 DOM 元素或子组件注册引用信息，引用信息将会注册在父组件的 `$refs` 对象上，如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例。
通过`this.$refs.ref`访问 dom 节点或组件实例(data)

`render: h => h(App)`
h 作为 createElement 的别名是 Vue 生态系统中的一个通用惯例。它来自单词 `hyperscript`，这个单词通常用在 virtual-dom 的实现中。hyperscript 本身指生成 HTML 结构的 script 脚本。 — Even You

```js
render: function (createElement) {
  return createElement(App);
}

// h 
render: function (h) {
  return h(App);
}

// ES6
render: h => h(App)
```

webpack 打包后引用路径问题
`config\index.js` 中的 build 模块修改导出路径 assetsPublicPath 为 `./`，使 index.html 和 static 文件夹在同一级目录下面。

```js
module.exports = {
 build: {
 ...
 assetsPublicPath: './',
 }
}
```

es6 语法兼容问题
`build\webpack.base.conf.js` 中的 entry 模块加入 `babel-polyfill`，让程序在打包时同时兼容低版本的浏览器。
vue3 版本中在自建的 vue.config.js 中添加 webpack config，将 entry 定义为 `@babel/polyfill`

```js
module.exports = {
context: path.resolve(__dirname, '../'),
entry: {
 app: ['babel-polyfill', './src/main.js']
},
// entry: {
//   app: './src/main.js',
//   "babel-polyfill": "babel-polyfill"
```
```js
configureWebpack: (config) => {
	if (process.env.NODE_ENV === 'production') {
		return {
			// 解决浏览器兼容ES6
			entry: {
				main: ['@babel/polyfill'],
      }
      ...
		}
	}
}
```

json 转换（重要）
vuex 里将状态保存到缓存中，会用到 json 转换，我们保存的状态都是数组，而 localStorage 只支持字符串
将数组传递到后台时也需要使用 JSON.stringify() 转换为字符串格式，回传时再转换为数组

```js
JSON.stringify(state.dataList) // array -> string
JSON.parse(window.localStorage.getItem('dataList')) // string -> array
```

v-for 参数顺序变更
vue2.x 中，当包含 index 时，之前遍历数组时的参数顺序是 `(index, value)`。现在是 `(value, index)`，来和 JavaScript 的原生数组方法 (例如 forEach 和 map) 保持一致。
当包含 property 名称/key 时，之前遍历对象的参数顺序是 `(name, value)`。现在是 `(value, name)`，来和常见的对象迭代器 (例如 lodash) 保持一致。

箭头函数
箭头函数的 this 在函数创建期间（普通函数在执行时绑定）完成绑定，this 指向该箭头函数被声明时所在的作用域对象。
箭头函数不能作为构造函数，没有 arguments，不能作为生成器函数。

数组去重
Set 是无序的类数组数据类型，有相同的 key 和 value，无重复数值，可以创建 Set 实例进行数组去重
`newArr = [...new Set(arr)]`

---

参考资料：
[https://router.vuejs.org/zh/guide/essentials/navigation.html](https://router.vuejs.org/zh/guide/essentials/navigation.html)
[https://vuex.vuejs.org/zh/](https://vuex.vuejs.org/zh/)
[https://better-scroll.github.io/docs/zh-CN/](https://better-scroll.github.io/docs/zh-CN/)
[https://element.faas.ele.me/#/zh-CN/](https://element.faas.ele.me/#/zh-CN/)
[https://cn.vuejs.org/v2/guide/migration.html](https://cn.vuejs.org/v2/guide/migration.html)
[https://github.com/axios/axios](https://github.com/axios/axios)
[https://juejin.cn/post/6844903613609803783](https://juejin.cn/post/6844903613609803783)