---
title: Web API 接口参考
date: 2020-12-16 00:00:00
categories:
  - study
tags:
  - JavaScript
---

## DOM
  文档对象模型 (DOM) 将 web 页面与到脚本或编程语言连接起来。DOM 模型用一个逻辑树来表示一个文档，树的每个分支的终点都是一个节点(node)，每个节点都包含着对象(objects)。DOM 的方法(methods)让你可以用特定方式操作这个树，用这些方法你可以改变文档的结构、样式或者内容。节点可以关联上事件处理器，一旦某一事件被触发了，那些事件处理器就会被执行。

### Document
  Document 接口表示浏览器中载入的 DOM 树，向网页文档本身提供了全局操作功能。

构造器：new Document()
常用属性

- Document.URL：以字符串形式返回文档的地址栏链接
- Document.title：获取或设置当前文档的标题
- Document.body：返回当前文档的 `<body>` 或 `<frameset>` 节点
- Document.documentElement：返回当前文档的直接子节点
- Document.head：返回当前文档的 `<head>` 元素
- Document.images：返回当前文档中所包含的图片的列表
- Document.documentURI：以字符串的类型，返回当前文档的路径
- Document.links：返回一个包含文档中所有超链接的列表
- Document.scripts：返回文档中所有的 `<script>` 元素

常用方法

- Document.createElement()：创建一个新的元素
- Document.createEvent()：创建一个 event 对象
- Document.createTextNode()：创建一个文本节点
- document.getElementById(String id)：返回一个匹配特定 ID 的元素
- Document.getElementsByName()：根据给定的 name 返回一个在 (X)HTML document 的节点列表集合
- Document.getElementsByClassName()：返回一个包含了所有指定类名的子元素的类数组对象
- Document.getElementsByTagName()：返回一个包括所有给定标签名称的元素的 HTML 集合 HTMLCollection
- Document.querySelector()：返回文档中与指定选择器或选择器组匹配的第一个 HTMLElement 对象。 如果找不到匹配项，则返回 null
- Document.querySelectorAll()：返回与指定的选择器组匹配的文档中的元素列表 (使用深度优先的先序遍历文档的节点)。返回的对象是 NodeList
- Document.open()：打开一个要写入的文档
- Document.write()：将一个文本字符串写入一个由 document.open() 打开的文档流
- Document.close()：用于结束由 对文档的 Document.write() 写入操作，这种写入操作一般由 Document.open() 打开
- Document.whiteln()：向文档中写入一串文本，并紧跟着一个换行符

参考地址：[https://developer.mozilla.org/zh-CN/docs/Web/API/Document](https://developer.mozilla.org/zh-CN/docs/Web/API/Document)

### Element
  Element 是一个通用性非常强的基类，所有 Document 对象下的对象都继承自它。这个接口描述了所有相同种类的元素所普遍具有的方法和属性。

使用`document.getElementById`，`document.getElementsByName`，`document.getElementsByClassName`，`document.getElementsByTagName` 获取到 element

常用属性

- Element.attributes：返回一个与该元素相关的所有属性集合
- Element.classList：返回该元素包含的 class 属性
- Element.className：返回该元素的 class
- Element.id：返回该元素的 id
- Element.innerHTML：设置或获取 HTML 语法表示的元素的后代，设置 HTML 时可能会造成安全问题
- Element.tagName：返回当前元素的标签名

常用方法

- Element.getAttribute()：返回元素上一个指定的属性值。如果指定的属性不存在，则返回 null 或 “”
- Element.getAttributeNames()：返回一个 Array，该数组包含指定元素（Element）的所有属性名称，如果该元素不包含任何属性，则返回一个空数组。
- Element.hasAttribute()：返回一个布尔值，指示该元素是否包含有指定的属性（attribute）。
- Element.setAttribute()：设置指定元素上的某个属性值。如果属性已经存在，则更新该值；否则，使用指定的名称和值添加一个新的属性。
- Element.removeAttribute()：从指定的元素中删除一个属性。
- Element.getElementsByClassName()：返回一个即时更新的 HTMLCollection，包含了所有拥有指定 class 的子元素。
- Element.getElementsByTagName()：返回一个动态的包含所有指定标签名的元素的 HTML 集合 HTMLCollection。
- Element.querySelector()：返回与指定的选择器组匹配的元素的后代的第一个元素。
- Element.querySelectorAll(selectors)：selectors 是一组 CSS 选择器，返回一个 non-live 的 NodeList, 它包含所有元素的非活动节点，该元素来自与其匹配指定的 CSS 选择器组的元素。(基础元素本身不包括，即使它匹配。)

### Event
  Event 接口表示在 DOM 中出现的事件，很多 DOM 元素可以被设计接收(或者监听) 这些事件, 并且执行代码去响应（或者处理）它们。通过 EventTarget.addEventListener()方法可以将事件处理函数绑定到不同的 HTML elements 上。这种绑定事件处理函数的方式基本替换了老版本中使用 HTML event handler attributes 来绑定事件处理函数的方式。除此之外，通过正确使用 removeEventListener()方法，这些事件处理函数也能被移除。

构造器：`new Event(typeArg, eventInit)`
typeArg 表示所创建事件的名称，eventInit 为可选项，接受以下字段:
“bubbles”，可选，Boolean 类型，默认值为 false，表示该事件是否冒泡。
“cancelable”，可选，Boolean 类型，默认值为 false， 表示该事件能否被取消。
“composed”，可选，Boolean 类型，默认值为 false，指示事件是否会在影子 DOM 根节点之外触发侦听器。

常用属性

- Event.target：触发事件的对象 (某个 DOM 元素) 的引用
- Event.currentTarget：当事件沿着 DOM 触发时事件的当前目标。
- Event.type：表示该事件对象的事件类型

### EventTarget
EventTarget 是一个 DOM 接口，由可以接收事件、并且可以创建侦听器的对象实现。

构造器：new EventTarget()，创建一个新的 EventTarget 对象实例

常用方法

- EventTarget.addEventListener()：将指定的监听器注册到 EventTarget 上，当该对象触发指定的事件时，指定的回调函数就会被执行。
- EventTarget.dispatchEvent()：向一个指定的事件目标派发一个事件, 并以合适的顺序同步调用目标元素相关的事件处理函数。
- EventTarget.removeEventListener()：删除使用 EventTarget.addEventListener() 方法添加的事件。

### URL
  URL 接口用于解析，构造，规范化和编码 URLs，如果浏览器尚不支持 URL()构造函数，则可以使用 Window 中的 Window.URL 属性。

构造器：new URL()
常用属性：host hostname href pathname port protocol search searchParams username
常用方法

- createObjectURL()：创建一个 DOMString，其中包含一个表示参数中给出的对象的 URL。这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的 URL 对象表示指定的 File 对象或 Blob 对象。
- revokeObjectURL()：销毁之前使用 URL.createObjectURL()方法创建的 URL 实例
- toJSON()：返回一个序列化的 URL
- toString()：字符串化方法返回一个 URL

参考地址：[https://developer.mozilla.org/zh-CN/docs/Web/API/URL](https://developer.mozilla.org/zh-CN/docs/Web/API/URL)

### Window
### Node
## FullScreen
[https://developer.mozilla.org/zh-CN/docs/Web/API/Fullscreen_API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fullscreen_API)

## Storage
[https://developer.mozilla.org/zh-CN/docs/Web/API/Storage_API](https://developer.mozilla.org/zh-CN/docs/Web/API/Storage_API)
[https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Storage_API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Storage_API)

## History
[https://developer.mozilla.org/zh-CN/docs/Web/API/History_API](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API)

## WebSockets
[https://developer.mozilla.org/zh-CN/docs/Web/API/Websockets_API](https://developer.mozilla.org/zh-CN/docs/Web/API/Websockets_API)

## WebGL
[https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API)

---

参考资料：
[https://developer.mozilla.org/zh-CN/docs/Web/API](https://developer.mozilla.org/zh-CN/docs/Web/API)