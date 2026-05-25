---
title: 时间序列分析中的资金流入流出问题
date: 2019-02-20 00:00:00
categories:
  - repo
tags:
  - time_series
  - ensemble_learning
  - bp_nn
---

-服务外包项目-
资金流入流出问题的研究笔记，数据来自蚂蚁金服大数据赛题
笔记持续更新中

## 研究现状
### 资金流入流出问题

**时间序列模型分析**：启动时间短，训练数据量不大，成本低
自回归算法 AR：呈现过去时刻对预测的直接影响
移动平均算法 MA：预测意料之外的事
自回归+移动平均 ARMA：综合以上的平衡
齐次非平稳 ARIMA：针对非平稳序列

- 时间序列可较好的预测短期价格变动，时期增长会导致误差率增高

- 投资分析：长期分析法，利用经济学角度分析内在价值

基本分析：宏观经济分析，行业分析和公司分析
应用不够直观，市场反应不够敏锐
技术分析：根据图标信息，技术指标记录推断变化趋势
技术指标滞后，无法把控整体趋势

- 混沌动力学
神经网络
利用探索数据间的交叉关系建立模型
契合资金波动的高度非线性特点
- 定性预测：专家意见，德尔菲法
- 因果预测：回归分析，定性和定量分析

### 组合算法

- 统计学+机器学习

- 灰色系统+神经网络
- 时间序列+神经网络

- 集成学习 ensemble learning

- 串行思路：采用串行的方式生成多个学习器目的在于减少偏差（bias），使用多个弱分类器组合成为一个强分类器，代表算法 Bagging，boosting，GBDT
- 并行思路：通过使用并行的学习，得到多个学习模型然后取其平均结果目的在于减少方差，代表算法 Random Forest

### 因子分解机 Factorization Machine (loading…)
通过特征向量去模拟因子分解模型，利用特征抽取的方法构造出特征并借助因子分解模型对不同变量间的相互作用进行建模

FM 算法常用来解决二分类，回归，排序问题

## 模型构建
数据集—>数据预处理—>特征抽取—>预测算法设计—>误差分析—>优化

数据预处理：剔除异常值，表格间数据集成
特征抽取：时间特征，用户特征，利率特征
预测算法设计(loading…)
误差分析：用均方根误差评价

## 数据预处理
### 余额宝用户数据
基本信息数据 user_profile：

列名
类型
含义
示例

user_id
bigint
用户
ID
1234

Sex
bigint
用户性别（ 1 ：男， 0：女 ）
0

City
bigint
所在城市
6081949

constellation
string
星座
射手座

申购赎回数据 user_balance：

列名
类型
含义
示例

user_id
bigint
用户 id
1234

report_date
string
日期
20140407

tBalance
bigint
今日余额
109004

yBalance
bigint
昨日余额
97389

total_purchase_amt
bigint
今日总购买量 = 直接购买 + 收益
21876

direct_purchase_amt
bigint
今日直接购买量
21863

purchase_bal_amt
bigint
今日支付宝余额购买量
0

purchase_bank_amt
bigint
今日银行卡购买量
21863

total_redeem_amt
bigint
今日总赎回量 = 消费 + 转出
10261

consume_amt
bigint
今日消费总量
0

transfer_amt
bigint
今日转出总量
10261

tftobal_amt
bigint
今日转出到支付宝余额总量
0

tftocard_amt
bigint
今日转出到银行卡总量
10261

share_amt
bigint
今日收益
13

category1
bigint
今日类目 1 消费总额
0

category2
bigint
今日类目 2 消费总额
0

category3
bigint
今日类目 3 消费总额
0

category4
bigint
今日类目 4 消费总额
0

收益率数据 mfd_day_share_interest：

列名
类型
含义
示例

mfd_date
string
日期
20140102

mfd_daily_yield
double
万份收益，即 1 万块钱的收益。
1.5787

mfd_7daily_yield
double
七日年化收益率（ % ）
6.307

银行拆借利率数据 mfd_bank_shibor：

列名
类型
含义
示例

mfd_date
String
日期
20140102

Interest_O_N
Double
隔夜利率（%）
2.8

Interest_1_W
Double
1 周利率（%）
4.25

Interest_2_W
Double
2 周利率（%）
4.9

Interest_1_M
Double
1 个月利率（%）
5.04

Interest_3_M
Double
3 个月利率（%）
4.91

Interest_6_M
Double
6 个月利率（%）
4.79

Interest_9_M
Double
9 个月利率（%）
4.76

Interest_1_Y
Double
1 年利率（%）
4.78

### 数据关系
今日余额 = 昨日余额 + 今日申购 - 今日赎回
今日余额 = 昨日余额 + [直接购买(支付宝+银行)+ 收益] - [消费 + 支出(支付宝+银行)]
tBalance = yBalance + (direct_purchase_amt + share_amt) - (consume_amt + transfer_amt)

## 抽取特征
## 资金流预测
采用时间序列预测的 ARIMA 模型，BP 神经网络，集成学习来进行预测，并结合不同的算法进行组合预测

### ARIMA
### BP
### ARIMA+BP
### GBDT
### Random Forest