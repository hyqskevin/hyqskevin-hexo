---
title: Maven POM 学习笔记
date: 2019-10-28 00:00:00
categories:
  - study
tags:
  - Maven
---

POM( Project Object Model，项目对象模型 ) 是 Maven 工程的基本工作单元，是一个 XML 文件，包含了项目的基本信息，用于描述项目如何构建，声明项目依赖。
POM 中可以指定以项目依赖，插件，执行目标，项目构建 profile，项目版本，项目开发者列表，相关邮件列表信息。
所有 POM 文件都需要 project 元素和三个必需字段：groupId，artifactId，version。

## 1.Minimal POM
最小 POM 需要 project 根标签和项目描述。

```xml
project xmlns = "http://maven.apache.org/POM/4.0.0"
    xmlns:xsi = "http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation = "http://maven.apache.org/POM/4.0.0
    http://maven.apache.org/xsd/maven-4.0.0.xsd">

    
    modelVersion>4.0.0modelVersion>

    
    groupId>com.companyname.project-groupgroupId>

    
    artifactId>projectartifactId>

    
    version>2.2.6.RELEASEversion>

     
    packaging>jarpackaging>
project>
```
## 2.父（Super）POM
父（Super）POM 是 Maven 默认的 POM。所有的 POM 都继承自一个父 POM，包含了一些可以被继承的默认设置。

```xml
project>
  
  repositories/>
  
  pluginRepositories/>
  
  build/>
  
  pluginManagement/>
  
  reporting/>
  
  profiles/>
project>
```
## 3.POM 标签详解
基于 POM 项目的基本`<project/>`结构，引入不同的标签定义不同的项目信息

### parent
parent 元素可以指定父 pom。用户可以通过增加 parent 元素来自定义一个父 pom，从而继承该 pom 的配置。parent 元素中包含一些子元素，用来定位父项目和父项目的 pom 文件位置。

```xml
parent>
    
    artifactId>com.companyname.project-groupartifactId>
    
    groupId>base-projectgroupId>
    
    version>1.0.1-RELEASEversion>
    
    relativePath>../pom.xmlrelativePath>
parent>
```
### 生成文档相关的元素
maven 可以通过 mvn site 命令生成项目的相关文档，包括 name，url，和 description。

```xml
name>kevin-mavenname>

url>http://www.xxxxx.com/kevinurl>

description>A maven project to study maven.description>
```
### issueManagement 项目的描述性信息
#### 问题管理
```xml
issueManagement>
  
  system>questionsystem>
  
  url>http://xxxxx.com/questionurl>
issueManagement>
```
#### 开发者和贡献列表
```xml
developers>
  
  developer>
    id/>
    name/>
    email/>
    url />
    roles>
        role>Project Managerrole>
        role>Architectrole>
    roles>
    organization/>
    organizationUrl/>
    
    properties>
        dept>Nodept>
    properties>
    
    timezone/>
  developer>
developers>
```
```xml
contributors>
  
  ...
contributors>
```
#### license 许可
```xml
licenses>
  license>
      name/>
      
      url/>
      
      distribution>repodistribution>
      
      comments/>
  license>
licenses>
```
#### SCM 代码库控制管理
```xml
scm>
  
  connection>scm:svn:http://...connection>
  
  developerConnection>scm:svn:http://...developerConnection>
  
  tag />
  
  url>http://...url>
scm>
```
#### 项目组织描述
```xml
organization>
  
  name>demoname>
  
  url>http://xxxurl>
organization>
```
#### 创建时间
`<inceptionYear /> //4位数字。当产生版权信息时需要使用这个值`

### repositories 远程仓库
远程仓库列表的配置，包括 `<repositories>` 依赖和扩展的远程仓库配置，以及 `<pluginRepositories>` 插件的远程仓库配置。在本地仓库找不到的情况下，maven 下载依赖、扩展和插件就是从这里配置的远程仓库中进行下载。
其中 release 是稳定版本，一经发布不再修改，想发布修改后的项目，只能升级项目版本再进行发布；snapshot 是不稳定的，一个 snapshot 的版本可以不断改变。项目在开发期间一般会使用 snapshot，更方便进行频繁的代码更新；一旦发布到外部，或者开发基本完成，代码迭代不再频繁，则推荐使用 release。

```xml
repositories>
  
  repository>
    
    releases>
        
        enabled />
        
        
        updatePolicy />
        
        checksumPolicy />
    releases>
    snapshots>
        enabled />
        updatePolicy />
        checksumPolicy />
    snapshots>

    
    id>name-repository-proxyid>
    
    name>name-repository-proxyname>
    
    url>url>
    
    layout>defaultlayout>
  repository>
repositories>

pluginRepositories>
  pluginRepository>
      ...
  pluginRepository>
pluginRepositories>
```
### dependencies 项目依赖
pom 文件中通过 `dependencyManagement` 来声明依赖，通过 `dependencies` 元素来管理依赖。

```xml
dependencies>
  dependency>
      
      groupId>org.apache.mavengroupId>
      artifactId>maven-artifactartifactId>
      version>3.8.1version>

      
      type>jartype>
      
      classifier>classifier>

      
      exclusions>
          exclusion>
              artifactId>spring-coreartifactId>
              groupId>org.springframeworkgroupId>
          exclusion>
      exclusions>
      
      optional>trueoptional>

      
          - compile：默认范围，用于编译
          - provided：类似于编译，但支持jdk或者容器提供，类似于classpath
          - runtime: 在执行时需要使用
          - systemPath: 仅用于范围为system。提供相应的路径
          - test: 用于test任务时使用
          - system: 需要外在提供相应的元素。通过systemPath来取得
          - optional: 当项目自身被依赖时，标注依赖是否传递。用于连续依赖时使用
      -->
      scope>scope>
  dependency>
dependencies>

dependencyManagement>
  dependencies>
    dependency>
        ...
    dependency>
  dependencies>
dependencyManagement>
```
### build 项目构建需要的信息
`<build/>`元素中包括 directory 路径管理，resource 资源管理，plugin 插件管理，extension 构建扩展等

#### 路径管理
路径管理定义了各种源码和编译结果的输出路径。如果遵循 maven 默认的路径约定，这里的几个元素不需要配置。

```xml
sourceDirectory />

testSourceDirectory />

outputDirectory />

testOutputDirectory />

scriptSourceDirectory />
```
#### resource 资源管理
`<resources/>`主要是对应用程序 resource 资源和单元测试部分 resource 资源的管理，分别通过 resource 标签和 testResource 标签管理两种资源。两个标签元素可选的子元素都是一样的。

```xml
resources>
  
  resource>
      
      targetPath />
      
      filtering />
      
      directory />
      
      includes />
      
      excludes />
  resource>
resources>

testResources>
  testResource>
    ...
  testResource>
testResources>
```
#### plugin 插件管理
插件包括 `<pluginManagement/>` 和 `<plugins/>`。`<pluginManagement/>` 中有子元素 `<plugins/>`，主要是用来声明子项目可以引用的默认插件信息，如果只写在 `<pluginManagement/>` 中是不会被引入的。`<project/>` 下的直接子元素 `<plugins/>` 中定义的才是这个项目中真正需要被引入的插件。

```xml
pluginManagement>
  
  plugins>
    
    plugin>
      
      groupId />
      artifactId />
      version />
      
      
      extensions />

      
      executions>
        
        execution>
          
          id />
          
          phase />
          
          goals />
          
          inherited />
          
          configuration />
        execution>
      executions>

      
      dependencies/>
      
      inherited />
      
      configuration />
    plugin>
  plugins>
pluginManagement>
```
```xml
plugins>

  plugin/>
plugins>
```
#### extension 构建扩展
`<extensions/>` 是在此构建中使用的项目的列表，它们将被包含在运行构建的 classpath 中。这些项目可以启用对构建过程的扩展，并使活动的插件能够对构建生命周期进行更改。简而言之，扩展是在构建期间激活的 artifacts。

```xml
extensions>
  extension>
    
    groupId />
    artifactId />
    version />
  extension>
extensions>
```
#### 其它配置
```xml
defaultGoal />

directory />

finalName />

filters />
```
### profile 配置
定义项目构建的模板，当有条件被激活时会修改构建处理

```xml
profiles>
    
    profile>
        
        id />
        
        activation>
            
            activeByDefault />
            
            jdk />
            
            os>
                
                name>Windows XPname>
                
                family>Windowsfamily>
                
                arch>x86arch>
                
                version>5.1.2600version>
            os>
            
            property>
                
                name>mavenVersionname>
                
                value>2.0.3value>
            property>
            
            
            file>
                
                exists>/usr/local/abcd/abcd-home/jobs/maven-guide-zh-to-production/workspace/
                exists>
                
                missing>/usr/local/abcd/abcd-home/jobs/maven-guide-zh-to-production/workspace/
                missing>
            file>
        activation>

        build />
        repositories />
        pluginRepositories />
        dependencies />
        dependencyManagement />
        reporting />
        distributionManagement />
        modules />
        properties />
    profile>
profiles>
```
### distributionManagement 项目分发信息相关元素
```xml
distributionManagement>
  
  repository>
      
      uniqueVersion />
      id>kevin-maven2id>
      name>kevinmaven2name>
      url>file://${basedir}/target/deployurl>
      layout />
  repository>
  
  snapshotRepository/>
    repository>
    ...
    repository/>
  snapshotRepository>

  
  site>
    
    id>kevin-siteid>
    
    name>websitename>
    
    url/>
  site>

  
  
  downloadUrl />

  
  relocation>
      groupId />
      artifactId />
      version />
      
      message />
  relocation>

  
  
      partner（直接从伙伴Maven 2仓库同步过来），deployed（从Maven 2实例部署），
      verified（被核实时正确的和最终的） -->
  status />
distributionManagement>
```
### reporting 报表规范
报表规范描述的是使用 mvn site 命令时使用的一些配置

```xml
reporting>
  
  excludeDefaults />
  
  outputDirectory />
  
  plugins>
      
      plugin>
        groupId />
        artifactId />
        version />
        inherited />
        configuration />
        
        reportSets>
          
          reportSet>
              
              id />
              
              configuration />
              
              inherited />
              
              reports />
          reportSet>
        reportSets>
      plugin>
  plugins>
reporting>
```
### 邮件列表
```xml
mailingLists>
  mailingList>
    
    name>Demoname>
    
    post>kevin@123.compost>
    
    subscribe>kevin@123.comsubscribe>
    
    unsubscribe>kevin@123.comunsubscribe>
    
    archive>http:/xxxxxx/kevin/demo/archive>
  mailingList>
mailingLists>
```
### ciManagement 持续集成配置
```xml
ciManagement>
  
  system />
  
  url />
  
  notifiers>
    
    notifier>
        
        type />
        
        sendOnError />
        
        sendOnFailure />
        
        sendOnSuccess />
        
        sendOnWarning />
        
        address />
        
        configuration />
    notifier>
  notifiers>
ciManagement>
```
### 其他配置
```xml
prerequisites>
    
    maven />
prerequisites>

modules />
```
## POM 主要配置结构
```c
project: modelVersion, artifactId, packing, version, name, url, description, inceptionYear
|-- prerequisites: maven
|-- *parent: artifactId, groupId, version, relativePath
|-- *repositories: repository
|                    |-- id, name, url, layout
|                        release
|                           |-- enabled, updatePolicy, checksumPolicy
|                        snapshot
|                           |-- enabled, updatePolicy, checksumPolicy
|-- *pluginRepositories: pluginRepository（同repositories）
|-- *dependencies: dependency
|                    |-- artifactId, groupId, version, type, classifier, scope, systemPath, optional
|                        executions
|                           |-- exclusion
|                                 |-- artifactId, groupId
|-- *build: sourceDirectory, scriptCourceDirectory, testSourceDirectory, outputDirectory, testOutputDirectory,
|           extensions, defaultGoal, directory, finalName, filters
|              |-- groupId, artifactId, version
|           resources
|              |-- resource
|                    |-- targetPath, filtering, directory, includes, excludes
|           testResources
|              |-- testResource
|                    |-- targetPath, filtering, directory, includes, excludes
|           pluginManagement
|              |-- plugins
|                    |-- plugin
|                          |-- groupId, artifactId, version, extensions, inherited, configuration
|                              executions
|                                 |-- execution
|                                     |-- id, phase, goals, inherited, configuration
|                              dependencies（同project/dependencies）
|           plugins（同pluginManagement/plugins）
|-- *reporting: excludeDefaults, outputDirectory
|               plugin
|                 |-- groupId,artifactId, version, extensions, goals, inherited, configuration
|                    reportSets
|                      |-- reportSet
|                           |-- id, configuration, inherited
|-- *dependencyManagement: dependencie（同project/dependencies）
|-- *distributionManagement: repository, downloadUrl, status
|                               |-- uniqueVersion, id, name, url, layout
|                            snaphotRepository
|                               |-- uniqueVersion, id, name, url, layout
|                            site
|                               |-- id, name, url
|                            relocation
|                               |-- groupId, artifactId, version, message
|-- *profiles: profile
|                |-- id, activation, modules
|                           |-- activeByDefault, jdk, property,
|                               os
|                                 |-- name, family, arch, version
|                               file
|                                 |-- exists, missing
|                    build（同project/build）
|
|
|-- developers: developer
|                |-- id, name, email, url, roles, organization, organizationUrl, properties, timezone
|-- contributors: contributor
|                |-- name, email, url, roles, organization, organizationUrl, properties, timezone
|-- licenses: license
|                |-- name, url, distribution, comments
|-- scm: connection, developerConnection, tag, url
|-- organization: name, url
|-- mailingLists: mailingList
|                      |-- name, post, subscribe, unsubscribe, archive
|-- issueManagement: system, url
|-- ciManagement: system, url, notifiers
|                                 |-- type, sendOnError, sendOnFailure, sendOnSuccess, sendOnWarning, address, configuration
```