---
title: BetterScroll插件实现页面滚动效果
date: 2020-05-28 00:00:00
categories:
  - study
tags:
  - Vue
---

BetterScoll 用于解决列表的动态滚动，实现移动端列表上拉加载，下拉刷新，水平/垂直滚动，滚动至指定高度等功能。BetterScroll 支持大量参数配置，提供很多灵活的 api 实现指定功能。
  实现 BetterScroll 滚动时父元素的高度或宽度需要进行固定，同时确保父元素和子元素内容正确渲染；在 DOM 结构发生改变时需要重新调用 `scroll.refresh()` 方法重新计算来确保滚动效果正常。

安装：`npm install better-scroll --save`

基本结构：

```html
div class="wrapper">
	ul class="content">
		li>...li>
		...
	ul>
	
div>
script>
	import BScroll from 'better-scroll'
	let scroll = new BScroll('.wrapper', {
		pullUpLoad: true,
		scrollbar: true,
		...
	})
script>
```
## Scroll 配置项
## Scroll 常用方法
## Scroll 事件监听
## Vue 中实现 BetterScroll
  Vue.js 提供了我们一个获取 DOM 对象的接口 `vm.$refs`，可以通过 `this.$refs.wrapper` 访问 DOM 对象。在 mounted 钩子函数里，使用回调函数保证初始化时 wrapper 的 DOM 已经渲染，可以正确计算它以及它内层 content 的高度以确保滚动正常。

```html
template>
	div class="wrapper" ref="wrapper">
		ul class="content">
			li>...li>
			li>...li>
			...
		ul>
	div>
template>
script>
	import BScroll from 'better-scroll'
	export default {
		mounted() {
			this.$nextTick(() => {
				this.scroll = new Bscroll(this.$refs.wrapper, {})
			})
		},
	}
script>
```
## 组件封装
Scroll 组件的 DOM 结构包括顶部和底部的提示信息以及中间部分的列表组件，使用插槽 `<slot>` 进行占位。

```html
div ref="wrapper" class="wrapper">
	ul class="scroll-content">
		
		div class="top-tip">
			span class="refresh-hook">{{pullDownMsg}}span>
		div>
		
		slot>slot>
		
		div class="bottom-tip">
			span class="loading-hook">'-到底了-'span>
		div>
	ul>
div>
```
组件的 js 部分对 Scroll 做 Vue 的封装，在 prop 里重写 Scroll 配置项，将控制权交给调用 Scroll.vue 的父组件；通过 methods 暴露的一些方法对 better-scroll 的方法做一层代理；watch 监听 data 的改变，及时调用 refresh 方法重新计算 better-scroll 确保滚动效果正常。

```js
import BScroll from 'better-scroll'

export default {
	// 常用配置和自定义配置
	props: {
		probeType: { type: Number, default: 1 }, // 何时派发滚动事件
		click: { type: Boolean, default: true }, // 点击时是否派发click事件
		scrollX: { type: Boolean, default: false }, // 横向滚动
		scrollY: { type: Boolean, default: false }, // 纵向滚动
		bounce: { type: Boolean, default: false }, // 边缘弹回动画
    autoBlur: { type: Boolean, default: false }, // 滚动之前激活元素失去焦点
    // 自定义事件
		pullup: { type: Boolean, default: false }, // 上拉动作触发事件
    pulldown: { type: Boolean, default: false }, // 下拉动作出发事件
		listenScroll: { type: Boolean, default: false }, // 监听滚动距离触发滚动事件
		data: { type: Array, default: null }, // 父组件的列表数据
		beforeScroll: { type: Boolean, default: false }, // 列表滚动开始事件
    refreshDelay: { type: Number, default: 20 }, // 数据更新后刷新Scroll延时
    showIcon: { type: Boolean, default: true }, // 下拉后显示返回按钮事件
    toTop: { type: Boolean, default: false } // 返回顶部事件
    ...
	},
	methods: {
		_initScroll() {
			if (!this.$refs.wrapper) {
				return
			}
			// better-scroll的初始化
			this.scroll = new BScroll(this.$refs.wrapper, {
				probeType: this.probeType,
				click: this.click,up
        scrollX: this.scrollX,
        pullup: this.pullup,
        pulldown: this.pulldown
			})

			// 派发滚动事件，下拉一定距离后提示可刷新
			if (this.listenScroll) {
        this.scroll.on('scroll', (pos) => {
          if (pos.y > 120) {
            this.pullDownMsg = '释放后进行刷新'
          }
        })
      }
      // 执行下拉刷新操作
      this.scroll.on('pullingDown', () => {
        this.$emit('pulldown')
        setTimeout(() => {
          this.scroll.finishPullDown()
          this.scroll.refresh()
          this.pullDownMsg = '-下拉刷新-'
        }, 600)
      })

			// 派发列表滚动开始的事件
			if (this.beforeScroll) {
				this.scroll.on('beforeScrollStart', () => {
					this.$emit('beforeScroll')
				})
			}
		},
		disable() {
			// 代理better-scroll的disable方法
			this.scroll && this.scroll.disable()
		},
		enable() {
			// 代理better-scroll的enable方法
			this.scroll && this.scroll.enable()
		},
		refresh() {
			// 代理better-scroll的refresh方法
			this.scroll && this.scroll.refresh()
		},
		scrollTo() {
			// 代理better-scroll的scrollTo方法
			this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
		},
		scrollToElement() {
			// 代理better-scroll的scrollToElement方法
			this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
		},
  },
  mounted() {
		// DOM渲染完毕后初始化better-scroll
		setTimeout(() => {
			this._initScroll()
		}, this.refreshDelay)
	},
	watch: {
		// 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
		data() {
			setTimeout(() => {
				this.refresh()
			}, this.refreshDelay)
		},
	},
}
```

---

参考资料：
[https://github.com/ustbhuangyi/better-scroll](https://github.com/ustbhuangyi/better-scroll)
[https://better-scroll.github.io/docs/zh-CN/](https://better-scroll.github.io/docs/zh-CN/)