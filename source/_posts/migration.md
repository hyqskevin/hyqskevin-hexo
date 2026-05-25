---
title: Laravel SQL migration
date: 2019-02-27 00:00:00
categories:
  - repo
tags:
  - laravel
---

结合 Laravel 的 Schema 构建器构建应用的数据库表结构，类似于数据库的版本控制，允许团队成员间编辑并共享应用的数据库表结构
Laravel 的 Schema 门面提供了与数据库系统无关的创建和操纵表的支持，在 Laravel 所支持的所有数据库系统中提供一致的、优雅的、流式的 API，将 SQL 转成 PHP 去执行

部署环境(WAMP)
php 7.3.1
composer 1.8.4
laravel 5.8.0
MySQL 5.7.24

## 迁移步骤

- MySQL 数据库创建 Database
- 到 laravel 目录下修改`.env`文件符合数据库配置

```plain
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=root
DB_PASSWORD=
```

到 laravel 目录创建新的迁移
`php artisan make:migration create_table_name`
创建的数据表在`laravel\database\migration`目录下

`--table`和`--create`选项可以用于指定表名以及该迁移是否要创建一个新的数据表。这些选项只需要简单放在上述迁移命令后面并指定表名
`php artisan make:migration create_users_table --create=users`
`php artisan make:migration add_votes_to_users_table --table=users`

编写迁移数据表
迁移类包含了两个方法：`up`和`down`。`up`方法用于新增表，列或者索引到数据库，而`down`方法就是`up`方法的反操作
用到 Laravel 的`schema`构建器来创建和修改表，后面给出具体实现方法

运行迁移表到数据库
`php artisan migrate`

强制运行这些命令而不被提示，可以使用—force（不推荐）
`php artisan migrate --force`

在 MySQL 中可以看到 Database 下有新的表
![](https://hyqskevin.github.io/pic/laravel/laraveltest.png)

- 执行回滚

在 Database 下有 migration 表，使得 laravel 可以回滚
![](https://hyqskevin.github.io/pic/laravel/migration.png)

执行文件中的`public function down()`,回滚最后一批运行的迁移
`php artisan migrate:rollback`
回滚所有的应用迁移
`php artisan migrate:reset`
先回滚所有数据库迁移
`php artisan migrate:refresh`
回滚或重建指定数量的迁移,refresh 命令提供的 step 选项
`php artisan migrate:refresh --step=5`

在迁移之前进行试验
`php artisan migrate --pretend`

## 创建表
使用 Schema 门面上的 create 方法来创建新的数据表。create 方法接收两个参数，第一个是表名，第二个是获取用于定义新表的 Blueprint 对象的闭包
`Schema::create('table_name', function (Blueprint $table){ })`

### 创建表中的列
在 Schema 中创建表中的列结构 `$table->类型('名称');`

- 常用属性

```php
$table->bigIncrements('id');	//自增ID，类型为bigint
$table->bigInteger('votes');	//等同于数据库中的BIGINT类型
$table->binary('data');	//等同于数据库中的BLOB类型
$table->boolean('confirmed');	//等同于数据库中的BOOLEAN类型
$table->char('name', 4);	//等同于数据库中的CHAR类型
$table->date('created_at');	//等同于数据库中的DATE类型
$table->dateTime('created_at');	//等同于数据库中的DATETIME类型
$table->dateTimeTz('created_at');	//等同于数据库中的DATETIME类型（带时区）
$table->decimal('amount', 5, 2);	//等同于数据库中的DECIMAL类型，带一个精度和范围
$table->double('column', 15, 8);	//等同于数据库中的DOUBLE类型，带精度, 总共15位数字，小数点后8位.
$table->enum('choices', ['foo', 'bar']);	//等同于数据库中的 ENUM类型
$table->float('amount');	//等同于数据库中的 FLOAT 类型
$table->increments('id');	//数据库主键自增ID
$table->integer('votes');	//等同于数据库中的 INTEGER 类型
$table->ipAddress('visitor');	//等同于数据库中的 IP 地址
$table->json('options');	//等同于数据库中的 JSON 类型
$table->jsonb('options');	//等同于数据库中的 JSONB 类型
$table->longText('description');	//等同于数据库中的 LONGTEXT 类型
$table->macAddress('device');	//等同于数据库中的 MAC 地址
$table->mediumIncrements('id');	//自增ID，类型为无符号的mediumint
$table->mediumInteger('numbers');	//等同于数据库中的 MEDIUMINT类型
$table->mediumText('description');	//等同于数据库中的 MEDIUMTEXT类型
$table->morphs('taggable');	//添加一个 INTEGER类型的 taggable_id 列和一个 STRING类型的 taggable_type列
$table->nullableTimestamps();	//和 timestamps()一样但允许 NULL值.
$table->rememberToken();	//添加一个 remember_token 列： VARCHAR(100) NULL.
$table->smallIncrements('id');	//自增ID，类型为无符号的smallint
$table->smallInteger('votes');	//等同于数据库中的 SMALLINT 类型
$table->softDeletes();	//新增一个 deleted_at 列 用于软删除.
$table->string('email');	//等同于数据库中的 VARCHAR 列  .
$table->string('name', 100);	//等同于数据库中的 VARCHAR，带一个长度
$table->text('description');	//等同于数据库中的 TEXT 类型
$table->time('sunrise');	//等同于数据库中的 TIME类型
$table->timeTz('sunrise');	//等同于数据库中的 TIME 类型（带时区）
$table->tinyInteger('numbers');	//等同于数据库中的 TINYINT 类型
$table->timestamp('added_on');	//等同于数据库中的 TIMESTAMP 类型
$table->timestampTz('added_on');	//等同于数据库中的 TIMESTAMP 类型（带时区）
$table->timestamps();	//添加 created_at 和 updated_at列
$table->timestampsTz();	//添加 created_at 和 updated_at列（带时区）
$table->unsignedBigInteger('votes');	//等同于数据库中无符号的 BIGINT 类型
$table->unsignedInteger('votes');	//等同于数据库中无符号的 INT 类型
$table->unsignedMediumInteger('votes');	//等同于数据库中无符号的 MEDIUMINT 类型
$table->unsignedSmallInteger('votes');	//等同于数据库中无符号的 SMALLINT 类型
$table->unsignedTinyInteger('votes');	//等同于数据库中无符号的 TINYINT 类型
$table->uuid('id');	//等同于数据库的UUID
```

- 常用约束

```php
->after('column')	//将该列置于另一个列之后 (仅适用于MySQL)
->comment('my comment')	//添加注释信息
->default($value)	//指定列的默认值
->first()	//将该列置为表中第一个列 (仅适用于MySQL)
->nullable()	//允许该列的值为NULL
->storedAs($expression)	//创建一个存储生成列（只支持MySQL）
->unsigned()	//设置 integer 列为 UNSIGNED
->virtualAs($expression)	//创建一个虚拟生成列（只支持MySQL）
```

- 格式示例

```php
class CreateTableName extends Migration
{
/**
 * Run the migrations.
 *
 * @return void
*/
public function up()
{
    Schema::create('table_name', function (Blueprint $table) {
        $table->bigIncrements('id');
        $table->string('name');
        $table->string('email')->unique();
        $table->timestamp('email_verified_at')->nullable();
        $table->string('password');
        $table->rememberToken();
        $table->timestamps();
    });
}

/**
 * Reverse the migrations.
 *
 * @return void
*/
public function down()
{
    Schema::dropIfExists('table_name');
}
```
### 修改、重命名、删除列
`->change()`方法允许你修改已存在的列为新的类型，或者修改列的属性
`->renameColumn()`方法可以重命名一个列
`->dropColumn`方法可以删除列

```php
Schema::table('users', function ($table) {
    $table->string('name', 50)->change();  //name列的尺寸从 25 增加到 50
    $table->renameColumn('from', 'to');  //重命名 from 为 to
    $table->dropColumn('votes');  //删除一个列
    $table->dropColumn(['votes', 'avatar', 'location']);  //删除多个列
});
```

- 需要添加 doctrine/dbal 依赖到 composer.json 文件
- 暂不支持 enum 类型的列的修改和重命名

### 添加索引键
```php
$table->primary('id');	//添加主键索引
$table->primary(['first', 'last']);	//添加混合索引
$table->unique('email');	//添加唯一索引
$table->unique('state', 'my_index_name');	//指定自定义索引名称
$table->index('state');	//添加普通索引
```
### 删除索引
```php
$table->dropPrimary(' ');	//删除主键索引
$table->dropUnique(' ');	//删除唯一索引
$table->dropIndex(' ');	 //删除普通索引
```
### 外键约束（loading…）
## 检查列表是否存在
使用 `hasTable` 和 `hasColumn` 方法检查表或列是否存在

```php
if (Schema::hasTable('users')) {
    //
}

if (Schema::hasColumn('users', 'email')) {
    //
}
```
## 设置表的存储引擎，在 schema 构建器上设置 engine 属性
```php
Schema::create('users', function ($table) {
    $table->engine = 'InnoDB';
    $table->increments('id');
});
```
## 重命名/删除表
在`public function up()`中添加
`Schema::rename('your_table_name','change_name');`
更新`public function down()`中的表名

在`public function down()`中添加
`Schema::drop('users');` 或 `Schema::dropIfExists('users');`
用于迁移的回滚

---

参考：
[Laravel 数据库迁移](https://laravelacademy.org/post/9580.html)
[Database Migration](https://laravel.com/docs/5.7/migrations)