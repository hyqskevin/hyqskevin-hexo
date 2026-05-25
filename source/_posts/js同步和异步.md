---
title: javascript异步，消息队列和事件循环
date: 2020-05-10 00:00:00
categories:
  - study
tags:
  - JavaScript
---

JavaScript 是单线程的，在 JS 引擎中负责解释和执行 JavaScript 代码的线程只有一个，而异步容易实现非阻塞，所以在 JavaScript 中对于耗时的操作或者时间不确定的操作，使用异步就成了必然的选择。

## 1. 异步过程
异步过程：主线程发起一个异步请求 -> 工作线程接收请求(异步函数返回) -> 主线程继续执行后面的代码，同时工作线程执行异步任务 -> 工作线程完成工作后，通知主线程 -> 主线程收到通知后，执行一定的动作(调用回调函数)。

实现异步过程包括发起函数和回调函数，发起函数用于发起异步过程，回调函数用来处理调用的结果。

```js
// 发起函数
setTimeout(() => {
	// 回调函数内容
}, 2000)
```
## 2. 消息队列和事件循环
异步过程中，工作线程在异步操作完成后需要通知主线程。这个通知机制需要通过消息队列和事件循环完成。

消息队列是一个先进先出的队列，它里面存放着各种消息。JS 引擎线程执行栈中的同步任务，当所有同步任务执行完毕后，栈被清空，然后读取消息队列中的一个待处理任务，并把相关回调函数压入栈中执行新的同步任务。

每次栈被清空后，JS 引擎线程都会在消息队列中读取新的任务，如果没有新的任务，就会等待，直到有新的任务。

![消息队列和事件循环](https://hyqskevin.github.io/pic/yibu.webp)

## 3. 异步编程方法

- 回调函数

将后者的执行改写为前者的回调函数。回调函数的优点是简单、容易理解和部署，缺点是不利于代码的阅读和维护，各个部分之间高度耦合（Coupling），流程会很混乱，而且每个任务只能指定一个回调函数。

```js
function f1(callback) {
	//f1方法
	setTimeout(() => {
		callback(f2) // f2执行改写为f1的回调函数
	}, 1000)
}
function f2() {
	//f2方法
}
```
常用的回调函数有 setTimeout，setInterval 和 nextTick

- `setTimeout` 设定为一段时间后执行异步任务，且在主线程执行完成后才被调用。
- `setInterval` 是一个定时器函数，按照指定周期不断调用函数，在每次主线程完成后执行。常用于获取数据量过大的列表，先获取一部分用于 DOM 挂载和页面展示，之后再不断从后台获取全部数据。
- `process.nextTick()` 是 Node.js 提供的异步执行函数，执行顺序会早于 setTimeout 和 setTimeInterval，在主线程完成后，任务队列调用之前执行，即在当前”执行栈”的尾部 -> 下一次 Event Loop（主线程读取”任务队列”）之前 -> 触发 process 指定的回调函数。

- Promise 对象

ECMAscript 6 原生提供了 Promise 对象，代表了未来将要发生的事件，用来传递异步操作的消息，调用 resolve 或 reject 方法返回。

```js
// 创建Promise
var promise = new Promise((resolve, reject) => {
  // 异步处理
  if () {
    resolve();
  } else {
    reject(); // 异步调用失败
  }
})
```
对于已经实例化过的 promise 对象可以调用 promise.then() 方法，传递 resolve 和 reject 方法作为回调再判断结果，也可以调用 promise.catch()方法捕捉错误的回调函数。

```js
promise
	.then(
		(res) => {
			// success
		},
		(err) => {
			// error
		}
	)
	.catch((err) => {
		// catch error
	})
```
有了 Promise 对象，就可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。此外，Promise 对象提供统一的接口，使得控制异步操作更加容易。

- async/await

async/await 基于 Promise 实现，它不能用于普通的回调函数。使用 await，函数必须用 async 标识，await 后面跟的是一个 Promise 实例。

```js
async function () {
  try{
    const res1 = await f1();
    const res2 = await f2();
    ...
  } catch {
    // 处理报错
  }
}

function f1 () {
  return new Promise ((resolve, reject) => {
    // f1方法
  })
}
function f2 () {
  return new Promise ((resolve, reject) => {
    // f2方法
  })
}
```

---

参考资料：
[https://github.com/ljianshu/Blog/issues/53](https://github.com/ljianshu/Blog/issues/53)
[https://www.runoob.com/w3cnote/javascript-promise-object.html](https://www.runoob.com/w3cnote/javascript-promise-object.html)