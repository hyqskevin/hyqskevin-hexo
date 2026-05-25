---
title: Pandas 数据整合、清洗和SQL比较
date: 2019-02-19 00:00:00
categories:
  - study
tags:
  - python
  - pandas
---

some examples of how various SQL operations would be performed using pandas
收集和比较 pandas 使用过程中和数据库类似的一些操作，方便使用 pandas 进行数据分析

import pandas and NumPy as follows

```python
import numpy as np
import pandas as pd
```

attributions of DataFrame

```python
df.dtypes  # data type of columns
df.index  # indexes
df.columns  # return pandas.index
df.values  # return values of each row
df.shape  # return dimensionality of df
```

## 列的修改操作
```sql
-- add
ALTER TABLE tip
ADD column_name NULL

--update
UPDATE tips
SET tip = tip*2
WHERE tip 2;

--delete
DELETE FROM tips
WHERE tip > 9;

--distinct 去重
SELECT DISTINCT time
FROM tips
```

添加
`tip['new_col'] = [value1,value2 ...]`
// 直接添加列
`tip.assign(new_col = func)`
// 通过 assign 使用赋值函数添加
`tip.loc[df.col==value, 'new_col'] = 'new_value'`
// 通过索引到行单独添加

更新
`tips.loc[tips['tip'] < 2, 'tip'] *= 2`
// 通过条件筛选出列来直接更新

删除
`tips = tips.drop(tips['tip']>9, axis=1)`
`tips = tips.loc[tips['tip'] <= 9]`
Pandas 可以把不需要的过滤掉而不是删除

去重
`tip[tip.duplicated()]`
// 查看重复的数据
`tips.drop_duplicates(subset=['time'], keep='last', inplace=True)`
// subset 选定列
// keep {‘first’,’last’,False}， 保留重复元素中的第一个、最后一个，或全部删除
// inplace 是否在原对象基础上进行修改

排序
`sort_value('col_name', ascending=True, na_position='last')`
`sort_value(['col_name1', 'col_name2'], ascending=True, na_position='last')`
// ascending 设定升降序，na_position 决定 缺失值排列的位置

`sort_index('col_name')`可对索引进行排序

## select 查找
```sql
SELECT 'name_1', 'name_2', ...
FROM tips
LIMIT 5;
```
SELECT * = tips 不列举列名，显示所有列
`tips[['name_1','name_2' ...]].head(5)` pandas 中利用列名和 head()进行筛选

`df.loc[1:3, ['name_1,'name_2','name_3' ...]]` 基于列 label，可选取特定行（根据行 index）
`df.iloc[1:3, [0,1,3,5,...]]` 基于 position(行/列)的位置
ix 为 loc 与 iloc 的混合体，既支持 label 也支持 position
`df.at[3, 'name']` 根据指定行 index 及列 label，快速定位 DataFrame 的元素；
iat 与 at 类似，不同的是根据 position 来定位的；

### where
```sql
SELECT *
FROM tips
WHERE time = 'Dinner'
LIMIT 5;

-- tips of more than $5.00 at Dinner meals
SELECT *
FROM tips
WHERE time = 'Dinner' AND tip > 5.00;

-- tips of more than 5 sizes or more than 45 total_bill
SELECT *
FROM tips
WHERE size >= 5 OR total_bill > 45;

SELECT *
FROM tips
WHERE total_bill in 20;

SELECT *
FROM tips
WHERE total_bill not in 20,22,24;

SELECT *
FROM frame
WHERE col2 IS NULL;

SELECT *
FROM frame
WHERE col1 IS NOT NULL;
```
`tips[tips['time'] == 'Dinner'].head(5)` 最直观的是使用布尔索引

`tips[(tips['time'] == 'Dinner') & (tips['tip'] > 5.00)]`
`tips[(tips['size'] >= 5) | (tips['total_bill'] > 45)]`
`tips[tips['total_bill].isin([20])]`
`tips[-tips['total_bill].isin([20,22,24])]`
搭配 and, or, in, not 关键词可用 & | isin() 实现
查询两者之间记录可以使用`between(5, 40, inclusive=True)`

`frame[frame['col2'].isna()/isnull()]`
`frame[frame['col1'].notna()/isnull()==False]`
搭配 NULL, NOT NULL，Pandas 中使用 isna() notna() 或 isnull()==True/False 实现

- 可以使用`str.contains()`进行正则表达式匹配查询
可以使用 pandas 提供的`query()`方法完成指定条件查询
`tips.query('指定条件')`

### group by
`df.groupby(['group_name'])[['col1, col2 ...]].max/min/mean/median/std/count/size()`
// col_name 作为分组变量，对之后给出的统计量进行分组

```sql
SELECT sex, count(*)
FROM tips
GROUP BY sex;
-- Female 87 Male 157
```
`tips.groupby('sex').size()`
//groupby()将数据集拆分为组，应用一些函数(通常是聚合)，然后将这些组组合在一起

`ips.groupby('sex')['total_bill'].count()`
//可以使用 count()返回特定列中的非空记录数

```sql
SELECT day, AVG(tip), COUNT(*)
FROM tips
GROUP BY day;
/*
Fri   2.734737   19
Sat   2.993103   87
Sun   3.255132   76
Thur  2.771452   62
...
*/

SELECT smoker, day, COUNT(*), AVG(tip)
FROM tips
GROUP BY smoker, day;
```
`tips.groupby('day').agg({'tip': np.mean, 'day': np.size})`
//agg()可以使用字典格式描述列，一次汇总多个统计量

`tips.groupby(['smoker', 'day']).agg({'tip': [np.size, np.mean]})`
//groupby()支持多条件

对分组之后的数据表可以使用多重索引的方式进行索引
`df['group_name']['col_name']`

#### groupby 其它操作
`df.groupby(['tips']).groups` // 查看分组对象
`df.groupby(['tips']).get_group('day')` // 得到某一个分组
`df.groupby(['tips']).transform(lambda x: ...)` // 对分组数据进行 lambda 公式转换
`df.groupby(['tips']).filter(filter_func)` // 带数据过滤的分组，filter 函数单独书写
`for group in df.groupby(['tips']):print (group)` // 迭代输出分组内容

#### 数据透视表
`pd.pivot_table`函数用来探索数据集内部的关联性，可实现拆分和堆叠列；数据透视表更像是一种多维的 GroupBy 累计操作。

拆分
`pd.pivot_table(table, index='id', columns='type', values='value', fill_value='0', aggfunc='sum').reset_index()`
// index 原数据中用于分组的列或键，作为新表的行
// columns 新数据表中变量所在的列，作为新表的列
// values 待拆分的列
// fill_value 替换缺失值
// aggfunc 聚合函数或函数列表

堆叠
`pd.melt(table, id_vars='id', value_vars=['value1','value2' ...], value_name='name', var_name='type')`
// id_vars 用于标示的变量
// value_vars 用于堆叠的变量
// value_type 堆叠后变量的名称
// value_name 堆叠后值的名称

### join
```sql
-- inner join
SELECT *
FROM df1
INNER JOIN df2
  ON df1.key = df2.key;

-- left join: show all records from df1
SELECT *
FROM df1
LEFT OUTER JOIN df2
  ON df1.key = df2.key;

-- right join: show all records from df1
SELECT *
FROM df1
LEFT OUTER JOIN df2
  ON df1.key = df2.key;

-- full join: show all records from both tables
SELECT *
FROM df1
FULL OUTER JOIN df2
  ON df1.key = df2.key;
```
JOINs can be performed with join() or merge()
`pd.merge(df1, df2, on='key')`
`pd.merge(df1, df2, on='key', how='left')`
`pd.merge(df1, df2, on='key', how='right')`
`pd.merge(df1, df2, on='key', how='outer')`

- 可以设置关键字匹配索引：`pd.merge(df1, df2.set_index('key'), on='key', right_index=True)`
- full join 在 RDBMS(关系型数据库)里不适用

### union
```sql
SELECT city, rank
FROM df1
UNION ALL
SELECT city, rank
FROM df2;
/*
         city  rank
      Chicago     1
San Francisco     2
New York City     3
      Chicago     1
       Boston     4
  Los Angeles     5
*/
```
`pd.concat([df1, df2])` // concat()用于链接两个数据表内容
`pd.concat([df1, df2], axis=1)` // axis=1 进行横向合并
`pd.concat([df1, df2]).drop_duplicates()` // 可以移除重复行

### order and aggregate
```sql
SELECT * FROM tips
ORDER BY tip DESC
LIMIT 10 OFFSET 5;
```
`tips.nlargest(10 + 5, columns='tip').tail(10)` // 根据 tip 降序排序，从最小 5 开始输出 10 个结果

```sql
-- Oracle's ROW_NUMBER() analytic function
SELECT * FROM (
  SELECT
    t.*,
    ROW_NUMBER() OVER(PARTITION BY day ORDER BY total_bill DESC) AS rn
  FROM tips t
)
WHERE rn 3
ORDER BY day, rn;
```
`ROW_NUMBER() OVER (PARTITION BY COL1 ORDER BY COL2)`row_number 从 1 开始，为每一条分组记录返回一个数字,根据 COL1 分组，在分组内部根据 COL2 排序，而此函数计算的值就表示每组内部排序后的顺序编号（组内连续的唯一的)
MySQL 本身不含`row_number()`函数

```python
tips.assign(rn=tips.sort_values(['total_bill'], ascending=False)
    .groupby(['day'])
    .cumcount() + 1)
    .query('rn )
    .sort_values(['day', 'rn'])
```
// DataFrame.assign()整理出一个新的列
// sort_values([‘total_bill’], ascending=False 根据 total_bill 的值倒叙排序，赋值 rn
// groupby([‘day’]) 根据 day 聚合
// query(‘rn < 3’) 筛选 rn<3 的行
// sort_values([‘day’, ‘rn’] 根据 day 和 rn 排序

```python
tips.assign(rnk=tips.groupby(['day'])['total_bill']
    .rank(method='first', ascending=False))
    .query('rnk )
    .sort_values(['day', 'rnk'])
```
// 使用 rank 函数返回从小到大排序的下标

```sql
SELECT * FROM (
  SELECT
    t.*,
    RANK() OVER(PARTITION BY sex ORDER BY tip) AS rnk
  FROM tips t
  WHERE tip 2
)
WHERE rnk 3
ORDER BY sex, rnk;
```
```python
tips[tips['tip'] 2]
  .assign(rnk_min=tips.groupby(['sex'])['tip']
  .rank(method='min'))
  .query('rnk_min )
  .sort_values(['sex', 'rnk_min'])
```
## 数据清洗

- 使用 `df.drop_duplicated()` 去除重复的数据
- 使用 `df.apply(lambda col:sum(col.isnull()))` 计算每列缺失的数据
- 使用 `df.col.fillna(df.col.mean/median())` 填补缺失值
- 使用盖帽法，分箱法，聚类法去除噪声

- 盖帽法

```python
def cap(x,quantile=[0.01,0.99]):
  # 生成分位数
  Q01,Q99 = x.quantile(quantile).values.tolist()
  if Q01 > x.min():
    x = x.copy()
    x.loc(x
  if Q99 
    x = x.copy()
    x.loc(x>Q99) = Q99

new_df = df.apply(cap, quantile=[0.01, 0.99])
```

分箱法
等深分箱：每个分箱中样本数量一致
`df.cut(df.col, bins=df.col.quantile([0, 0.25, 0.5, 0.75, 1]))`
// 利用分位数找到分割点进行 4 等分箱

等宽分箱：每个分箱中取值范围一致
`pd.cut(pd.col, 5)`
// 根据列将数据分成 5 等分

- 聚类法多用于多变量处理，常用的有 k-means 聚类