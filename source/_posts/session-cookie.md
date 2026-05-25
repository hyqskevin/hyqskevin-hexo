---
title: session_cookie
date: 2019-02-28 00:00:00
categories:
  - code
tags:
  - session
  - cookie
---

Cookie 和 Session 都是会话技术
Cookie 是运行在客户端，Session 是运行在服务器端
浅谈一下 Session 与 Cookie 之间的区别和联系

## Session
Session 是服务器端使用的一种记录客户端状态的机制，客户端（浏览器）访问服务器的时候，服务器把客户端信息以某种形式记录在服务器上。

### 步骤

- 客户端（浏览器）发送请求
- 服务器端生成 Session 和一个 Session ID 来作为这个 Session 的唯一标识，将 Session ID 发送到客户端
- 客户端第二次发送请求，将前一次响应的 Session ID 一并发送
- 服务器端从请求中提取出 Session ID，和保存的所有 Session ID 进行对比，找到对应的 Session，如果该 Session 已经被销毁，生成新的 Session
- 服务器端如果保存 Session 超出时间限制会销毁 Session

![](https://hyqskevin.github.io/pic/session_cookie/session.png)
### Session 的生命周期
Session 保存在服务器端，为了获得更高的存取速度，服务器一般把 Session 放在内存里。

如果 Session 内容过于复杂，当大量客户访问服务器时可能会导致内存溢出。因此，Session 里的信息应该尽量精简。

Session 生成后，只要用户继续访问，服务器就会更新 Session 的最后访问时间，并维护该 Session。

随着用户访问服务器，Session 会越来越多。为防止内存溢出，服务器会把长时间内没有活跃的 Session 从内存删除。

### Session 的用法（不详细展开）
`void setAttribute(String attribute, Object value)`
设置 Session 属性
`removeAttribute(String attribute)`
移除 Session 属性
`getLastAccessedTime()`
返回 Session 的最后活跃时间
`getMaxInactiveInterval()`
返回 Session 的超时时间
`void invalidate()`
使该 Session 失效

## Cookie
Cookie 技术是客户端的解决方案，由服务器端发给客户端的特殊信息会以文本文件的方式存放在客户端，然后客户端每次向服务器发送请求的时候都会带上这些特殊的信息。

### 步骤

- 用户使用客户端（浏览器）访问，提供个人信息并且提交至服务器
- 服务器在向客户端回传的同时发回个人信息，存放于 HTTP 响应头
- 当客户端（浏览器）接收到来自服务器的响应之后，浏览器会将这些信息存放在 cookie 文件夹下，然后再向服务器发送请求，把相应的 Cookie 再次发回至服务器。信息则存放在 HTTP 请求头
- 服务器端在接收到来自客户端浏览器的请求，通过分析存放于请求头的 Cookie 得到客户端特有的信息，从而动态生成与该客户端相对应的内容

![](https://hyqskevin.github.io/pic/session_cookie/cookie.png)
### Cookie 的有效期
Cookie 的 maxAge 决定着 Cookie 的有效期，单位为秒（Second）Cookie 会在 maxAge 秒之后自动失效

### Cookie 的属性
String name：该 Cookie 的名称
Object value：该 Cookie 的值
int maxAge：该 Cookie 失效的时间，单位秒
boolean secure：该 Cookie 是否仅被使用安全协议传输
String domain：可以访问该 Cookie 的域名
String comment：该 Cookie 的用处说明

## difference & connection
区别

- cookie 数据存放在客户的浏览器上，session 数据放在服务器上
- cookie 不是很安全，别人可以分析存放在本地的 COOKIE 并进行 COOKIE 欺骗，考虑到**安全**应当使用 session；
- session 会在一定时间内保存在服务器上。当访问增多，会比较占用你服务器的性能。考虑到**减轻服务器性能**方面，应当使用 COOKIE；
- 单个 cookie 在客户端的限制是 3K，就是说一个站点在客户端存放的 COOKIE 不能超过 3K；

联系

服务端执行 session 机制时候会生成 session 的 id 值，这个 id 值会发送给客户端，客户端每次请求都会把这个 id 值放到 http 请求的头部发送给服务端，而这个 id 值在客户端会保存下来，保存的容器就是 cookie