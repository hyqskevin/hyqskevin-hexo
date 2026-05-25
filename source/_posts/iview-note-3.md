---
title: iview_note 学习笔记(3) —— 布局
date: 2019-09-20 00:00:00
categories:
  - study
tags:
  - iview
---

Loading…

iview 布局提供了比较便捷的网页架构排版，可以省去很多页面样式的调试。

[iview_note 学习笔记(1)](https://hyqskevin.github.io/2019/08/16/iview-note/)
[iview_note 学习笔记(2)](https://hyqskevin.github.io/2020/08/23/iview-note-2/)

### 布局
#### List
```html
template>
	List header="Header" footer="Footer" border>
		ListItem>This is a piece of text.ListItem>
		
		ListItem>
			ListItemMeta
				avatar="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar"
				title="This is title"
				description="This is description."
			/>
			

			
			template slot="action">
				li>
					a href="">Edita>
				li>
				li>
					a href="">Morea>
				li>
			template>

			
			template slot="extra"
				>
				img src=" " style="width: 280px" />
			template>
		ListItem>
	List>
template>
```
设置属性 size (small、large、default) 可以显示三种不同尺寸的列表。
设置 border 是否显示边框
设置 header 或 footer 来自定义列表头部或尾部。

设置属性 item-layout 为 vertical 可实现竖排列表样式

```html
template>
	List item-layout="vertical">
		ListItem v-for="item in data" :key="item.title">
			ListItemMeta
				:avatar="item.avatar"
				:title="item.title"
				:description="item.description"
			/>
			{{ item.content }}
			template slot="action">
				li>Icon type="ios-star-outline" /> 123li>
				li>Icon type="ios-thumbs-up-outline" /> 234li>
				li>Icon type="ios-chatbubbles-outline" /> 345li>
			template>
		ListItem>
	List>
template>
script>
	export default {
		data() {
			return {
				data: [
					{
						title: 'This is title 1',
						description: 'This is description.',
						avatar: '',
						content: 'this is the content.',
					},
					{
						title: 'This is title 2',
						description: 'This is description.',
						avatar: '',
						content: 'this is the content.',
					},
				],
			}
		},
	}
script>
```

#### Card
```html
template>
	Card style="width:350px">
		p slot="title">
			Icon type="ios-film-outline">Icon>
			Classic film
		p>
		a href="#" slot="extra" @click.prevent="changeLimit">
			Icon type="ios-loop-strong">Icon>
			Change
		a>
		ul>
			li v-for="item in randomMovieList">
				a :href="item.url" target="_blank">{{ item.name }}a>
			li>
		ul>
	Card>
template>

script>
	export default {
	 data () {
	     return {
	         movieList: [
	             {
	                 name: 'The Shawshank Redemption',
	                 url: 'https://',
	             },
	             {
	                 name: 'Leon:The Professional',
	                 url: 'https://',
	             },
	             {
	                 name: 'Farewell to My Concubine',
	                 url: 'https://',
	             }
	         ],
	         randomMovieList: []
	     }
	 }
script>
```
设置 title 和 extra 可以定义卡片标题和右上角额外内容

- Row 和 Col 格式实现并排表格

```html
Row style="width:350px">
  Col span="11">
    Card>
      p slot="title">The standard cardp>
      p>Content of cardp>
    Card>
  Col>
  Col span="11" offset="2">
    Card dis-hover>
      p slot="title">Disable card with hover shadowsp>
      p>Content of cardp>
    Card>
  Col>
Row>
```
#### Collapse
```html
template>
	Collapse v-model="value1">
		Panel name="1">
			name1
			p slot="content">message1p>
		Panel>
		Panel name="2">
			name2
			p slot="content">message2p>
		Panel>
	Collapse>
template>
script>
	export default {
		data() {
			return {
				value1: '1',
			}
		},
	}
script>
```
设置属性 accordion 开启手风琴模式，每次只能打开一个面板
设置属性 simple 可以显示为不带边框和背景色的简洁模式

#### Split
左右分割

```html
div class="demo-split">
	Split v-model="split1">
		div slot="left" class="demo-split-pane">Left Panediv>
		div slot="right" class="demo-split-pane">Right Panediv>
	Split>
div>
script>
	export default {
		data() {
			return {
				split1: 0.5, // 控制分割的量
			}
		},
	}
script>
```
top button 可实现上下分割，也可以使用嵌套分割

#### Divider
```html
Divider />
Divider dashed />
Divider>With TextDivider>
```
使用 type=”vertical” 设置为行内的垂直分割线
使用 orientation 设置分割线标题的位置，可选值为 left、right 或 center

#### Cell
`<Cell title=" " />`
可设置 name(标识) title(左侧标题) label(描述信息) extra(右侧额外内容) disabled(禁用) selscted(选中) to(跳转) 属性

#### Layout
Layout：布局容器，其下可嵌套 HeaderSiderContentFooter 或 Layout 本身，可以放在任何父容器中
Header：顶部布局，自带默认样式，其下可嵌套任何元素，只能放在 Layout 中
Sider：侧边栏，自带默认样式及基本功能，其下可嵌套任何元素，只能放在 Layout 中
Content：内容部分，自带默认样式，其下可嵌套任何元素，只能放在 Layout 中
Footer：底部布局，自带默认样式，其下可嵌套任何元素，只能放在 Layout 中

```html
div class="layout">
	Layout>
		Sider hide-trigger>SiderSider>
		header>Headerheader>
		content>Contentcontent>
		footer>Footerfooter>
	Layout>
div>
```
#### Grid

- LoadingBar
- Badge

### 视图
### 图表