---
title: tips about building blog
date: 2018-10-20 00:00:00
categories:
  - study
tags:
  - hexo
---

安装 hexo 的笔记,不间断进行更新
更新目录：

- 安装和部署必要模组
- 页面模板
- 写文章
- 本地查看和 Github 部署
- 分类和标签须知
- 标签插件
- 建立资源文件夹
- 更换 Maupassant 主题
- 增加右下角动图
- 添加 pdf 插件
- 安装字数统计插件
- 安装 mathjax 公式支持

## install nodejs npm git hexo 安装和部署必要模组
### install on Linux
```bash
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential
sudo apt-get install -y npm
sudo apt-get install git
```

- related modules

```bash
npm install  //install necessary components
npm install hexo-deployer-git --save  // deploy to git
npm install hexo-generator-feed --save  // build RSS
npm install hexo-generator-sitemap --save // build sitemap
```
#### deploy hexo

- open terminal & `cd` to the right direction

```bash
mkdir blog
npm install hexo -g
hexo -v  //check info
hexo init  //initialize folder
hexo g  //Start processing
```
#### add ssh key
```bash
ssh-keygen -t rsa -C "your email address"
cat /home/xxx/.ssh/id_rsa.pub  //check your key
```

- **load key to Github (default on Github & default you can use Github)**

```bash
ssh -T git@github.com
```
#### set id & email
```bash
git config --global user.name "your id"
git config --global user.email "your email"
```
### install on Windows

- download **[nodejs](https://nodejs.org/en/download/)** and install
- download **[git](https://git-scm.com/downloads)** and install
- Win+R open cmd to the right direction

```bash
mkdir blog
npm install hexo -g
hexo -v  //check info
npm install  //install necessary components
hexo init  //initialize folder
hexo g  //Start processing
```

- **add related module & ssh key & set id+email (the same as linux)**

---

## template 模板

- 各页面相对应的模板名称

  模板
  用途
  回退

`index`
首页

`post`
文章
`index`

`page`
分页
`index`

`archive`
归档
`index`

`category`
分类归档
`archive`

`tag`
标签归档
`archive`

---

## write pages 写文章
### init page
```bash
hexo new post "post_name"
```
### edit
```bash
title:
date:
categories:
tags:
description:
#
##
###
```

tags 目前的标签

- | Kaggle | Linux device | hexo | php | mysql | others |

categories 目前的分类

- Adobe: about any update & crack of CC software
- notes: personal thoughts & ideas
- others: just others
- study: study notes

---

## local server & deploy 本地查看和部署
```bash
hexo clean  //clean cache
hexo generate  //generate static files
hexo seserver  //localhost:4000
hexo deploy  //open server
```

---

## update notes

---

**2019.2.14 更新**

### categories & tags 分类和标签须知

- 只有文章支持分类和标签
- 分类具有顺序性和层次性,标签没有顺序和层次
- Hexo 不支持指定多个同级分类

```bash
categories:
- Diary
tags:
- PS3
- Games
```
### Tag Plugins 标签插件
#### quote

- 在文章中插入引言，可包含作者、来源和标题

```bash
{% blockquote [author[, source]] [link] [source_link_title] %}
content
{% endblockquote %}
```

- example

```bash
{% blockquote David Levithan, Wide Awake %}
Do not just seek happiness for yourself. Seek happiness for all. Through kindness. Through mercy.
{% endblockquote %}
```
Do not just seek happiness for yourself. Seek happiness for all. Through kindness. Through mercy.

**David Levithan**Wide Awake
#### code 插入代码
```bash
{% codeblock [title] [lang:language] [url] [link text] %}
code snippet
{% endcodeblock %}
```
#### image 插入图片
```bash
{% img [class names] /path/to/image [width] [height] [title text [alt text]] %}
```
#### link 插入链接
```bash
{% link text url [external] [title] %}
```
### Assert fold 资源文件夹

- 如果需要插入图片,最简单的方法就是将它们放在 source/pic 文件夹中。然后通过类似于 `![](/images/image.jpg)` 的方法访问它们.
- 通过常规的 markdown 语法和相对路径来引用图片和其它资源可能会导致它们在存档页或者主页上显示不正确。**需要使用标签插件**

```bash
{% asset_img example.jpg This is an example image %}
{% asset_path slug %}
{% asset_img slug [title] %}
{% asset_link slug [title] %}
...
```

---

**2.18 日更新**

因 NexT 不可描述的页面无法跳转原因，更换主题到 Maupassant，大道至简

- 给文章添加目录：开头加上 `toc: true`
- 首页自定义显示文章摘录：在摘录后加上`<!--more-->`

---

**2.22 日更新**

### 增加萌宠或二次元动图
[hexo live2d 插件 2.0](https://huaji8.top/post/live2d-plugin-2.0/)
[Github 地址](https://github.com/EYHN/hexo-helper-live2d/blob/master/README.zh-CN.md)

`npm install --save hexo-helper-live2d`
然后挑一个
`npm install live2d-widget-model-xxxxx`

向 Hexo 的 _config.yml 文件添加配置

```yml
live2d:
  enable: true
  scriptFrom: local
  pluginRootPath: live2dw/
  pluginJsPath: lib/
  pluginModelPath: assets/
  tagMode: false
  debug: false
  model:
    use: live2d-widget-model-xxxxx
  display:
    position: right
    width: 150
    height: 300
  mobile:
    show: true
```
### 添加 pdf 插件
`npm install --save hexo-pdf`
`hexo new page book`

.md 文件中添加 pdf

```bash
外部链接：{% pdf http://xxx.pdf %}
本地连接：{% pdf ./pdf名字.pdf %}
```
### 安装字数统计插件
`npm i --save hexo-wordcount`
将自己所用主题中的 _config.yml 文件中的 wordcount 设置为 true

### 增加 instagram 链接
`npm install hexo-tag-instagram --save`

```bash
{% instagram post-url %}
or
{% instagram BXkz1bYB1-N %}
or
{% instagram false 50% https://www.instagram.com/p/BXkz1bYB1-N/ %}
```
**7.29 日更新**

### 安装 mathjax 支持
安装 kramed(marked 修改版)
`npm uninstall hexo-renderer-marked --save`
`npm install hexo-renderer-kramed --save`

更改/node_modules/hexo-renderer-kramed/lib/renderer.js

```js
function formatText(text) {
	// Fit kramed's rule: $$ + \1 + $$
	//return text.replace(/`\$(.*?)\$`/g, '$$$$$1$$$$');
	return text
}
```
停止使用 hexo-math，改为 hexo-renderer-mathjax
`npm uninstall hexo-math --save`
`npm install hexo-renderer-mathjax --save`

打开/node_modules/hexo-renderer-mathjax/mathjax.html 更新 CDN
`<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_CHTML"></script>`

在博客头部说明中开启`Mathjax: true`

- 使用时要注意`_`的转义

---

**2020.11.26 更新**

重启博客项目，修改分类为：code，language-learning，notes，paper，repo，study

标签增加到：algorithm others Vue book boosting c++ Kaggle sklearn flask time_series ensemble_learning bp_nn hexo python JavaScript bootstrap2.0 php laravel machine_learning mysql pandas session cookie slam Linux_device log

---

## Reference

- **[hexo.io](https://hexo.io/zh-cn/docs/)**
- **[cnblogs: hexo+Github 搭建自己的博客](https://www.cnblogs.com/fengxiongZz/p/7707219.html)**