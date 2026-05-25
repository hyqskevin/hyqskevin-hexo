---
title: swiper滑动插件
date: 2020-05-12 00:00:00
categories:
  - study
tags:
  - Vue
---

Swiper 和 vue-awesome-swiper 插件用于页面内容的触摸滑动，每个展示块为一个 slide，全部 slide 包含在包装器 wrapper 中，外部的总容器 container 又包裹着 wrapper 和箭头按钮控件 navigation 以及分页器控件 pagination。

```html
div class="swiper-container">
	div class="swiper-wrapper">
		div class="swiper-slide">Slide 1div>
		div class="swiper-slide">Slide 2div>
		div class="swiper-slide">Slide 3div>
	div>
	
	div class="swiper-pagination">div>
	
	div class="swiper-button-prev">div>
	
	div class="swiper-button-next">div>
	
	div class="swiper-scrollbar">div>
div>
```

## swiper
### 初始结构
```js
import Swiper from 'swiper'
var mySwiper = new Swiper('.swiper-container', {
	direction: 'vertical', // 垂直切换选项
  loop: true, // 循环模式选项
  ...
	// 如果需要分页器
	pagination: {
		el: '.swiper-pagination',
	},

	// 如果需要前进后退按钮
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},

	// 如果需要滚动条
	scrollbar: {
		el: '.swiper-scrollbar',
	},
})
```
### container 常用选项

- initialSlide：初始化时显示的 slide，默认为第一个 slide
- direction：slide 滑动方向，默认为水平方向
- speed：切换速度，单位 ms
- slidesPerView：设置同时显示的 slides 数量
- slidesPerGroup：定义滑动时几个 slide 为一组
- spaceBetween：在 slide 之间设置距离
- loop：会在原本 slide 前后复制若干个 slide 并在合适的时候切换
- preventClicks：防止滑动时执行链接跳转
- touchRatio：设置触摸距离与 slide 滑动距离的比率
- threshold：设置拖动临界值
- touchAngle：设置触发拖动的角度值。默认 45 度，即使触摸方向不是完全水平也能拖动 slide
- autoplay：设置为 true 启动自动切换，可设置延迟 delay 参数
- effect：设置切换效果，’slide’（普通切换、默认）,”fade”（淡入）”cube”（方块）”coverflow”（3d 流）”flip”（3d 翻转）

### 组件功能

- lazy：设为 true 开启图片延迟加载默认值

```html
div class="swiper-slide">
	img data-src="path/to/picture-1.jpg" class="swiper-lazy" />
	div class="swiper-lazy-preloader">div>
div>
script>
	var mySwiper = new Swiper('.swiper-container', {
		lazy: {
			loadPrevNext: true,
		},
	})
script>
```

- zoom：开启焦距功能：双击 slide 会放大/缩小，并且在手机端可双指触摸缩放

```html
div class="swiper-slide">
	div class="swiper-zoom-container">
		img src="path/to/image" />
	div>
div>
```

- thumbs：专门用于制作带缩略图的 swiper

```js
var thumbsSwiper = new Swiper('#thumbs', {
	spaceBetween: 10,
	slidesPerView: 4,
	watchSlidesVisibility: true, //防止不可点击
})
var gallerySwiper = new Swiper('#gallery', {
	spaceBetween: 10,
	thumbs: {
		swiper: thumbsSwiper,
	},
})
```
### 常用方法

- `mySwiper.slideNext(speed, runCallbacks)` 滑动到下一个滑块
- `mySwiper.slidePrev(speed,runCallbacks)` 滑动到前一个滑块
- `mySwiper.slideTo(index, speed, runCallbacks)` 切换到指定 slide
- `mySwiper.on(event,handler)` 添加回调函数或者事件

## vue-awesome-swiper
vue-awesome-swiper 是 vue 的 swiper 插件，`npm install swiper vue-awesome-swiper --save`安装导入后即可在组件中使用

```js
/*main.js 全局安装*/
import Vue from 'vue'
import VueAwesomeSwiper from 'vue-awesome-swiper'

// import style (>= Swiper 6.x)
import 'swiper/swiper-bundle.css'
// import style (
import 'swiper/css/swiper.css'

Vue.use(VueAwesomeSwiper /* { default options with global component } */)
```
```js
/*.vue 组件内*/
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'

// import style (>= Swiper 6.x)
import 'swiper/swiper-bundle.css'
// import style (
import 'swiper/css/swiper.css'

export default {
	components: {
		Swiper,
		SwiperSlide,
	},
	directives: {
		swiper: directive,
	},
}
```
### 初始结构
```js
"mySwiper" :options="swiperOptions">
    Slide 1/swiper-slide>
    Slide 2swiper-slide>
    Slide 3/swiper-slide>
    Slide 4swiper-slide>
    Slide 5/swiper-slide>
    div>
  /swiper>
template>

export default {
  name: 'carrousel',
  data() {
    return {
      swiperOptions: {
        pagination: {
          el: '.swiper-pagination'
        },
        // Some Swiper option/callback...
      }
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper
    }
  },
  methods: {
    ...
  },
  mounted() {
    ...
  }
}
/script>
```

---

参考资料：
[https://www.swiper.com.cn/](https://www.swiper.com.cn/)
[https://github.com/surmon-china/vue-awesome-swiper](https://github.com/surmon-china/vue-awesome-swiper)