---
title: Maven 项目构建笔记
date: 2019-10-13 00:00:00
categories:
  - study
tags:
  - Maven
---

Maven 可以统一集中管理所有的依赖包，并且能够自动解决重复和冲突问题。Maven 作为一个开放的架构，方便同第三方插件集成。

## Maven 配置文件
构建配置文件可以用来设置或者覆盖 Maven 构建默认值，可以为不同的生产环境（Production）和开发（Development）环境定制构建方式。

类型
配置文件定义

项目级（Per Project）
定义在项目的 POM 文件 pom.xml 中

用户级 （Per User）
定义在 Maven 的设置 xml 文件中 (%USER_HOME%/.m2/settings.xml)

全局（Global）
定义在 Maven 全局的设置 xml 文件中 (%M2_HOME%/conf/settings.xml)

### 编写和激活配置文件
在 src/main/resources 文件夹下有三个配置，env.properties 为默认配置，env.test.properties 为测试配置文件，env.prod.properties 为生产配置。
配置文件在 pom.xml 文件中使用 activeProfiles 或者 profiles 元素指定，并且可以通过各种方式触发。

#### 1.配置文件中设置
可以使用 pom.xml 来定义不同的 profile，并在命令控制台中使用 maven 命令激活 profile。

```xml
区分不同的  执行不同的 AntRun 任务-->
profiles>
  profile>
    id>normalid>
    build>
        plugins>
            plugin>
              groupId>org.apache.maven.pluginsgroupId>
              artifactId>maven-antrun-pluginartifactId>
              version>1.8version>
              executions>
                  execution>
                    phase>testphase>
                    goals>
                        goal>rungoal>
                    goals>
                    configuration>
                    tasks>
                        echo>Using env.propertiesecho>
                        copy file="src/main/resources/env.properties" tofile="${project.build.outputDirectory}/env.properties" overwrite="true"/>
                    tasks>
                    configuration>
                  execution>
              executions>
            plugin>
        plugins>
    build>
  profile>
profiles>
```
#### 2.通过 maven 设置
打开 %USER_HOME%/.m2 目录下的 settings.xml 文件配置 setting.xml

```xml
settings>
   ...
   activeProfiles>
      activeProfile>testactiveProfile>
   activeProfiles>
settings>
```
#### 3.基于环境变量设置
在 pom.xml 里面的 `<id>` 为 test 的 `<profile>` 节点，加入 `<activation>` 节点

```xml
profiles>
  profile>
      id>testid>
      activation>
        property>
          name>envname>
          value>testvalue>
        property>
      activation>
      build/>
  profile>
profiles>
```
#### 4.操作系统设置
在 activation 元素里包含操作系统信息

```xml
activation>
  os>
    name>Windows XPname>
    family>Windowsfamily>
    arch>x86arch>
    version>5.1.2600version>
  os>
activation>
```
#### 5.文件的存在或者缺失时触发
在 activation 里设置缺失条件时触发配置

```xml
activation>
  file>
      missing>target/generated-sources/...missing>
  file>
activation>
```
## maven 生命周期
Maven 三个标准的生命周期：clean 项目清理的处理；default 项目部署的处理；site 项目站点文档创建的处理
在一个 Maven 生命周期中，运行某个阶段的时候，它之前的所有阶段都会被运行。

### 1.clean
pre-clean：执行一些需要在 clean 之前完成的工作
clean：移除所有上一次构建生成的文件
post-clean：执行一些需要在 clean 之后立刻完成的工作

目标在生命周期中执行

```xml
executions>
  execution>
      id>id.pre-cleanid>
      phase>pre-cleanphase>
      goals>
        goal>rungoal>
      goals>
      configuration>
        tasks>
            echo>pre-clean phaseecho>
        tasks>
      configuration>
  execution>
executions>
```
### 2.default / build
Maven 的主要生命周期，被用于构建应用，包括 23 个构建阶段

生命周期阶段
描述

validate（校验）
校验项目是否正确并且所有必要的信息可以完成项目的构建过程。

initialize（初始化）
初始化构建状态，比如设置属性值。

generate-sources（生成源代码）
生成包含在编译阶段中的任何源代码。

process-sources（处理源代码）
处理源代码，比如说，过滤任意值。

generate-resources（生成资源文件）
生成将会包含在项目包中的资源文件。

process-resources （处理资源文件）
复制和处理资源到目标目录，为打包阶段最好准备。

compile（编译）
编译项目的源代码。

process-classes（处理类文件）
处理编译生成的文件，比如说对 Java class 文件做字节码改善优化。

generate-test-sources（生成测试源代码）
生成包含在编译阶段中的任何测试源代码。

process-test-sources（处理测试源代码）
处理测试源代码，比如说，过滤任意值。

generate-test-resources（生成测试资源文件）
为测试创建资源文件。

process-test-resources（处理测试资源文件）
复制和处理测试资源到目标目录。

test-compile（编译测试源码）
编译测试源代码到测试目标目录.

process-test-classes（处理测试类文件）
处理测试源码编译生成的文件。

test（测试）
使用合适的单元测试框架运行测试（Juint 是其中之一）。

prepare-package（准备打包）
在实际打包之前，执行任何的必要的操作为打包做准备。

package（打包）
将编译后的代码打包成可分发格式的文件，比如 JAR、WAR 或者 EAR 文件。

pre-integration-test（集成测试前）
在执行集成测试前进行必要的动作。比如说，搭建需要的环境。

integration-test（集成测试）
处理和部署项目到可以运行集成测试环境中。

post-integration-test（集成测试后）
在执行集成测试完成后进行必要的动作。比如说，清理集成测试环境。

verify （验证）
运行任意的检查来验证项目包有效且达到质量标准。

install（安装）
安装项目包到本地仓库，这样项目包可以用作其他本地项目的依赖。

deploy（部署）
将最终的项目包复制到远程仓库中与其他开发者和项目共享。

添加执行的方法同 clean

### 3.site
Maven Site 插件一般用来创建新的报告文档、部署站点等

pre-site：执行一些需要在生成站点文档之前完成的工作
site：生成项目的站点文档
post-site： 执行一些需要在生成站点文档之后完成的工作，并且为部署做准备
site-deploy：将生成的站点文档部署到特定的服务器上

添加执行的方法同 clean

## Maven 项目构建
### 命令行方法
Maven 使用原型 archetype 插件创建项目 `mvn archetype:generate`
清理目标目录 `mvn clean`
编译源代码 `mvn compile`
运行测试案例 `mvn test`
打包项目构建的输出为 jar（package）文件 `mvn clean package`
安装 `mvn install`
创建项目文档 `mvn site`，在 \target\site 文件夹。点击 index.html 查看文档
生成 API Doc 文档 `mvn javadoc:javadoc`，工程中自动产生 target\site\apidocs 目录，index.html 查看文档

### pom.xml 中添加插件
常用项目构建插件

插件名称
用途

maven-clean-plugin
清理项目

maven-compile-plugin
编译项目

maven-deploy-pligin
发布项目

maven-site-plugin
生成站点

maven-surefire-plugin
运行测试

maven-jar-plugin
构建 jar 项目

maven-javadoc-plugin
生成 javadoc 文件

maven-surefire-report-plugin
生成测试报告

用浏览器打开 [Maven Repository](http://mvnrepository.com/) 可以查看插件的最新版本，单击 Search 按钮，然后在 pom.xml 中添加 build 标签，描述插件信息

```xml
build>
  plugins>
    plugin>
        groupId>org.apache.maven.pluginsgroupId>
        artifactId>maven-xxx-pluginartifactId>
        version>version>
        configuration>
          
          includes>
              include>....include>
          includes>
          
          excludes>
              exclude>...exclude>
          excludes>
        configuration>
    plugin>
  plugins>
build>
```