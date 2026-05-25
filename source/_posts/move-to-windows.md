---
title: move to windows
date: 2019-02-14 00:00:00
categories:
  - repo
tags:
  - hexo
---

由于 archlinux 上出现了一些 bug，而且因为跑 SLAM，安装包占去了过多存储空间，临时决定将 blog 移植到 Windows 上来方便经常更新。

## install necessary modules

- download **[nodejs](https://nodejs.org/en/download/)** and install
- download **[git](https://git-scm.com/downloads)** and install
- Win+R open cmd to the right direction

```bash
$ mkdir blog
$ npm install hexo -g
$ hexo -v  //check info
$ npm install  //install necessary components
$ hexo init  //initialize folder
$ hexo g  //Start processing
```

- related modules

```bash
$ npm install  //install necessary components
$ npm install hexo-deployer-git --save  // deploy to git
$ npm install hexo-generator-feed --save  // build RSS
$ npm install hexo-generator-sitemap --save // build sitemap
```
## add ssh key
```bash
$ ssh-keygen -t rsa -C "your email address"
$ cat /home/xxx/.ssh/id_rsa.pub  //check your key
```

- **load key to Github (default on Github & default you can use Github)**

```bash
$ ssh -T git@github.com
```
## set id & email
```bash
$ git config --global user.name "your id"
$ git config --global user.email "your email"
```
## copy previous files

copy source files to the new catalog (as follows)

- `_config.yml package.json node_modules scaffolds source themes`

- type `hexo s` to check