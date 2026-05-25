---
title: iview_note 学习笔记(2) —— 表单
date: 2019-08-23 00:00:00
categories:
  - study
tags:
  - iview
---

iview 表单处理模板

[iview_note 学习笔记(1)](https://hyqskevin.github.io/2019/08/16/iview-note/)
[iview_note 学习笔记(3)](https://hyqskevin.github.io/2020/09/20/iview-note-3/)

### Input
```html
Input v-model="value" placeholder="Enter something..." /> 
Input v-model="value1" size="large" placeholder="large size" /> 
Input v-model="value2" placeholder="Enter something..." clearable /> 
Input v-model="value3" maxlength="100" /> 
Input v-model="value4" icon="ios-clock-outline" /> 

Input prefix="ios-contact" placeholder="Enter name" style="width: auto" />
Input suffix="ios-search" placeholder="Enter text" style="width: auto" />

Input placeholder="Enter name" style="width: auto">
    Icon type="ios-contact" slot="prefix" />
Input>
Input placeholder="Enter text" style="width: auto">
    Icon type="ios-search" slot="suffix" />
Input>

Input search placeholder="Enter something..." />
```
使用 v-model 实现数据的双向绑定
设置 size 为 large 和 small 设置为大和小尺寸
开启属性 clearable 可显示清空按
通过 icon 属性可以在输入框右边加一个图标，点击图标，会触发 on-click 事件

### Radio
```html
Radio v-model="single">RadioRadio>

RadioGroup v-model="phone">
	Radio label="apple"> Icon type="logo-apple">Icon> apple Radio>
	Radio label="android"> Icon type="logo-android">Icon> android Radio>
	Radio label="windows"> Icon type="logo-windows">Icon> windows Radio>
RadioGroup>
```
可设置 disabled 属性来禁用单选框
设置属性 size 为 large 或 small 将按钮样式设置为大和小尺寸
设置属性 type 为 button 来应用按钮的样式
设置 vertical 属性来垂直显示

### Checkbox
```html
Checkbox v-model="single">CheckboxCheckbox>

CheckboxGroup v-model="social">
	Checkbox label="twitter">
		Icon type="logo-twitter">Icon>
		span>Twitterspan>
	Checkbox>
	Checkbox label="facebook">
		Icon type="logo-facebook">Icon>
		span>Facebookspan>
	Checkbox>
	Checkbox label="github">
		Icon type="logo-github">Icon>
		span>Githubspan>
	Checkbox>
CheckboxGroup>
```

相关属性同 Radio

### Switch
```html
i-switch v-model="switch1" @on-change="change">
	span slot="open">开span>
	span slot="close">关span>
i-switch>
```

可以使用 disabled size 属性

可以使用 loading 标识开关操作仍在执行中

### Table
```html
template>
	table :columns="columns1" :data="data1">table>
template>

script>
	export default {
	  data () {
	    return {
	      columns1: [
	        { type: 'selection', width: 60, align: 'center', sortable: true
	        { title: 'Name', key: 'name' },
	        { title: 'Age', key: 'age', filters: [
	                            { label: 'Greater than 25', value: 1 },
	                            { label: 'Less than 25', value: 2 }
	                            ] },
	        { title: 'Address', key: 'address' }
	      ],
	      data1: [
	        { name: 'name1', age: 18, address: ' ', date: '2019' },
	        { name: 'Jim Green', age: 24, address: ' ', date: '2019' },
	        { name: 'Joe Black', age: 30, address: ' ', date: '2019' }
	      ]
	    }
	  }
	}
script>
```
指定样式：

- 通过属性 row-class-name 可以给某一行指定一个样式名称。
- 通过给列 columns 设置字段 className 可以给某一列指定一个样式。
- 通过给数据 data 设置字段 cellClassName 可以给任意一个单元格指定样式。

指定数据设置：

- 给 columns 数据设置一项，指定 type: ‘selection’，即可自动开启多选功能
- 给 columns 数据的项，设置 sortable: true，即可对该列数据进行排序
- 给 columns 数据的项，设置 filters，可进行筛选，filterMethod 传入两个参数 value 和 row

设置属性 height 给表格指定高度；数据 columns 的项设置 fixed 为 left 或 right，可以左右固定需要的列，设置属性 size 为 large 或 small 可以调整表格尺寸为大或小，默认不填或填写 default 为中

设置属性 stripe ，表格会间隔显示不同颜色

设置属性 border ，添加表格的边框线

通过设置属性 loading 可以让表格处于加载中状态，在异步请求数据、分页时建议使用

设置属性 highlight-row，可以选中某一行，调用 clearCurrentRow 方法可以手动清除选中项

#### 自定义列模板
使用 slot-scope 写法，在 columns 的某列声明 slot 后，就可以在 Table 的 slot 中使用 slot-scope
slot-scope 的参数有 3 个：当前行数据 row，当前列数据 column，当前行序号 index

```html
table border :columns="columns2" :data="data2">
	template slot-scope="{ row, index }" slot="action">
		button
			type="primary"
			size="small"
			style="margin-right: 5px"
			@click="show(index)"
		>
			View
		button>
		button type="error" size="small" @click="remove(index)">Deletebutton>
	template>
table>

script>
	export default {
		data() {
			return {
				columns2: [
					{ title: 'Name', key: 'name' },
					{ title: 'Age', key: 'age' },
					{ title: 'Address', key: 'address' },
					{ title: 'Action', slot: 'action', width: 150, align: 'center' },
				],
				data2: [
					{ name: 'name2', age: 'age2', address: 'addr2' },
					{ name: 'name3', age: 'age3', address: 'addr3' },
				],
			}
		},
		methods: {
			show(index) {
				this.$Modal.info({
					title: 'User Info',
					content: `Name：${this.data2[index].name}
Age：${this.data2[index].age}
Address：${this.data2[index].address}`,
				})
			},
			remove(index) {
				this.data6.splice(index, 1)
			},
		},
	}
script>
```

- [表格 API 详解:https://www.iviewui.com/components/table#API](https://www.iviewui.com/components/table#API)

### Select
```html
select v-model="model1" style="width:200px">
	option v-for="item in cityList" :value="item.value" :key="item.value">
		{{ item.label }}
	option>
select>

script>
	export default {
		data() {
			return {
				cityList: [
					{ value: 'New York', label: 'New York' },
					{ value: 'London', label: 'London' },
				],
				model1: '',
			}
		},
	}
script>
```

通过设置 size 属性为 large 和 small 将输入框设置为大和小尺寸

Select 设置属性 disabled 禁用整个选择器: Option 设置属性 disabled 可以禁用当前项，clearable 可以清空已选项，multiple 可以开启多选模式

使用 OptionGroup 可将选项进行分组
`<OptionGroup label="Cities"> <Option ></Option></OptionGroup>`

Option 自定义模板

```html
option value="New York" label="New York">
	span>New Yorkspan>
	span style="float:right;color:#ccc">Americaspan>
option>
```
### Slider
```html
template>
	Slider v-model="value1">Slider>
	Slider v-model="value2" :step="10">Slider>
	
	Slider v-model="value3" range>Slider>
	
	Slider v-model="value3" range disabled>Slider>
	
	Slider v-model="value4" show-input>Slider>
	
template>
```

使用 tip-format 可以自定义提示

```html
template>
	Slider v-model="value5" :tip-format="format">Slider>
template>
script>
	export default {
		data() {
			return { value5: 25 }
		},
		methods: {
			format(val) {
				return 'Progress: ' + val + '%'
			},
		},
	}
script>
```
### Date/Time Picker
1.DatePicker

```html
template>
	DatePicker
		type="date"
		placeholder="Select date"
		style="width: 200px"
	>DatePicker>
	DatePicker
		type="daterange"
		placement="bottom-end"
		placeholder="Select date"
		style="width: 200px"
	>DatePicker>
template>
```
设置属性 type 为 year 或 month 可以使用选择年或月的功能，date 或 daterange 分别显示选择单日和选择范围类型
开启属性 multiple 后，可以多选，设置属性 format 可以改变日期的显示格式
设置属性 confirm，选择日期后，选择器不会主动关闭，需用户确认后才可关闭

2.TimePicker

```html
template>
	TimePicker
		type="time"
		placeholder="Select time"
		style="width: 168px"
	>TimePicker>
	TimePicker
		type="timerange"
		placement="bottom-end"
		placeholder="Select time"
		style="width: 168px"
	>TimePicker>
template>
```
设置类似 DatePicker

### Cascader
```html
template>
	Cascader :data="data" v-model="value1">Cascader>
template>

script>
	export default {
		data() {
			return {
				value1: [],
				data: [
					{
						value: 'data1',
						label: 'name1',
						children: [
							{ value: 'data1-1', label: 'name1-1' },
							{ value: 'data1-2', label: 'name1-2' },
							{ value: 'data1-3', label: 'name1-3' },
						],
					},
					{
						value: 'data2',
						label: 'name2',
						children: [
							{ value: 'data2-1', label: 'name2-1' },
							{ value: 'data2-2', label: 'name2-2' },
						],
					},
				],
			}
		},
	}
script>
```
指定 value 默认值，组件会在初始化时选定数据
设置属性 trigger 为 hover，当鼠标悬停时就会展开子集
设置属性 change-on-select 点任何一级都可以做到选择即改变
使用属性 filterable 可直接搜索选项并选择

### Transfer
### InputNumber
### Rate
### Upload
### ColorPicker
### Form
### AutoComplete