---
title: iview_note 学习笔记(1)
date: 2019-08-16 00:00:00
categories:
  - study
tags:
  - iview
---

iview 前端 UI 学习笔记和组件范例收集，iview 框架适合桌面端的页面设计，拥有比较全面的动态组件。
详细使用参考官网：[https://www.iviewui.com/components/](https://www.iviewui.com/components/)

[iview_note 学习笔记(2)](https://hyqskevin.github.io/2019/08/23/iview-note-2/)
[iview_note 学习笔记(3)](https://hyqskevin.github.io/2020/09/20/iview-note-3/)

### 安装
建立 vue-cli，之后通过 vue 建立项目文件夹

```bash
npm install -g @vue/cli
vue create new-project 或者直接 vue ui
npm install iview@4.0.0 --save 或直接在vue cli界面中安装plugin
```
或者在页面下直接进行导入

```html
script src="//vuejs.org/js/vue.min.js">script>

link rel="stylesheet" href="//unpkg.com/iview/dist/styles/iview.css" />

script src="//unpkg.com/iview/dist/iview.min.js">script>
```
### 引入 iview
```js
import './plugins/iview.js'
import 'iview/dist/styles/iview.css'
```
在文件 `.babelrc` 中配置可实现按需求引用

```js
// .babelrc
{
  "plugins": [["import", {
    "libraryName": "iview",
    "libraryDirectory": "src/components"
  }]]
}
```
然后这样按需引入组件，就可以减小体积了：

```js
import { Button, Table } from 'iview'
Vue.component('Button', Button)
Vue.component('Table', Table)
```
### 使用规则
在非 template/render 模式下（例如使用 CDN 引用时），组件名要分隔，例如 DatePicker 必须要写成 date-picker。

以下组件，在非 template/render 模式下，需要加前缀 i-：

Button: i-button
Col: i-col
Table: i-table
Input: i-input
Form: i-form
Menu: i-menu
Select: i-select
Option: i-option
Progress: i-progress
Time: i-time

以下组件，在所有模式下，必须加前缀 i-，除非使用 `iview-loader`：

Switch: i-switch
Circle: i-circle

- `iview-loader` 用于统一 View UI（iView） 标签书写规范，所有标签都可以使用首字母大写的形式，包括 Vue 限制的两个标签 Switch 和 Circle

### 基础组件
View UI（iView） 使用较为安全的蓝色作为主色调

辅助色：

Info #2db7f5；Success #19be6b；Warning #ff9900；Error #ed4014

中性色：

标题 #17233d；正文 #515a6e；辅助/图标 #808695；失效 #c5c8ce；边框 #dcdee2；分割线 #e8eaec；背景 #f8f8f9

字体：

font-family: “Helvetica Neue”,Helvetica,”PingFang SC”,”Hiragino Sans GB”,”Microsoft YaHei”,”微软雅黑”,Arial,sans-serif;

button 样式：

```js
Default/Button>
    PrimaryButton>
    "dashed">Dashed/Button>
    TextButton>
    "info">Info/Button>
    SuccessButton>
    "warning">Warning/Button>
    ErrorButton>
/template>

    export default {
    }
script>
```

设置内容反色和背景透明可以加入属性 ghost
设置查询 icon 可以在 button 中内嵌图标，可以设置形状 `<Button type="primary" shape="circle" icon="ios-search">`
通过设置 size 为 large 和 small 将按钮设置为大和小尺寸
通过设置属性 long 可将按钮宽度设置为 100%
通过添加 disabled 属性可将按钮设置为不可用状态
通过添加 loading 属性可以让按钮处于加载中状态
通过设置 ButtonGroup 的属性 vertical，可以使按钮组纵向排列
通过设置 to 可以实现点击按钮直接跳转，支持传入 vue-router 对象
将多个 Button 放入 ButtonGroup 内，可实现按钮组合的效果

Icon：

View UI（iView） 的图标使用开源项目 ionicons 3.x 版本

可设置图标的名称，大小，颜色或者自定义图标

图标使用可搜索[官方文档](https://www.iviewui.com/components/icon)

### 导航组件
#### Menu
```html
template>
	menu mode="horizontal" :theme="theme1" active-name="1">
		menuitem name="1"> 内容1 menuitem>
		menuitem name="2"> 内容2 menuitem>
		Submenu name="3">
			template slot="title"> 内容3 template>
			MenuGroup title="子标题">
				menuitem name="3-1">子内容1menuitem>
				menuitem name="3-2">子内容2menuitem>
				menuitem name="3-3">子内容3menuitem>
			MenuGroup>
		Submenu>
	menu>
template>
```
`<Menu>`：
mode 可选值为 horizontal（水平） 和 vertical（垂直）
theme 主题，可选值为 light、dark、primary
active-name 激活菜单的 name 值
open-names 展开的 Submenu 的 name 集合
accordion 是否开启手风琴模式，开启后每次至多展开一个子菜单

`<MenuItem>`：需要写唯一标识 name
可使用 to 进行跳转链接

`<Submenu>`：设置子菜单，需要写唯一标识 name
`<MenuGroup>`：可以对标题进行分组

#### Tabs
```html
template>
	Tabs value="name1">
		TabPane label="标签一" name="name1">标签一的内容TabPane>
		TabPane label="标签二" name="name2">标签二的内容TabPane>
		TabPane label="标签三" name="name3">标签三的内容TabPane>
	Tabs>
template>
```
`<Tabs>`：
type 设置页签的基本样式，可选值为 line 和 card
size 设置尺寸，可选值为 default 和 small，仅在 type=”line” 时有效
Tabs 中的 value 设置当前激活的 TabPane

`<TabPane>`：
name 用于标识当前面板，对应 value，默认为其索引值
可设置属性 icon，可以显示一个图标
可使用 disabled 禁用选项卡
closable 设置是否可以关闭页签

#### Dropdown
```html
template>
	Dropdown style="margin-left: 20px">
		button type="primary">
			下拉菜单
			Icon type="ios-arrow-down">Icon>
		button>
		DropdownMenu slot="list">
			DropdownItem>目录1DropdownItem>
			DropdownItem disabled>目录2DropdownItem>
			DropdownItem divided>目录3DropdownItem>
		DropdownMenu>
	Dropdown>
template>
```
`<Dropdown>`：
trigger 触发方式可选值为 hover（悬停）click（点击）contextMenu（右键）custom（自定义）
设置属性 placement 可以更改下拉菜单出现的方向,可选值为 top top-start top-end bottom bottom-start bottom-end left left-start left-end righ tright-start right-end

`<DropdownItem>`：
disabled 设置禁用该项
divided 显示分割线
selected 标记该项为选中状态

#### Page
```html
Page :total="100" /> Page :total="100" show-sizer />

Page :total="100" show-elevator />

Page :total="100" show-total />

Page :total="40" size="small" />

Page :current="2" :total="50" simple />

Page :total="100" prev-text="Previous" next-text="Next" />
```
#### Breadcrumb
面包屑组件，可以作为字导航菜单使用，小巧精简。

```html
Breadcrumb>
	BreadcrumbItem to="/">
		Icon type="ios-home-outline">Icon> Home
	BreadcrumbItem>
	BreadcrumbItem>ComponentsBreadcrumbItem>
Breadcrumb>
```
#### Steps
```html
template>
	Steps :current="1">
		
		Step title="已完成" content="这里是该步骤的描述信息">Step>
		Step title="进行中" content="这里是该步骤的描述信息">Step>
		Step title="待进行" content="这里是该步骤的描述信息">Step>
		Step title="待进行" content="这里是该步骤的描述信息">Step>
	Steps>
template>
```
设置属性 direction 为 vertical 在垂直方向展示
设置 Steps 的属性 status 为 error 指定当前错误步骤状态
设置属性 size 为 small 启用迷你版
通过设置 Step 的 icon 属性可以自定义图标

#### Anchor
可以作为目录使用

```html
Anchor show-ink>
	AnchorLink href="#basic_usage" title="Basic Usage" />
	AnchorLink href="#static_position" title="Static Position" />
	AnchorLink href="#API" title="API">
		AnchorLink href="#Anchor_props" title="Anchor props" />
		AnchorLink href="#Anchor_events" title="Anchor events" />
		AnchorLink href="#AnchorLink_props" title="AnchorLink props" />
	AnchorLink>
Anchor>
```