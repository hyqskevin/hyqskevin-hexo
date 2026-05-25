---
title: boosting
date: 2019-08-01 00:00:00
categories:
  - notes
tags:
  - boosting
---

[XgBoost](https://xgboost.ai/) 和 [LightGBM](https://github.com/Microsoft/LightGBM) 官方文档阅读和算法学习
`*`号为未解释完全，具体使用方法请参考官方文档

## XgBoost
### 常用参数
`booster` [default= gbtree ]  基础模型类型，可选参数包括: gbtree、gblinear、dart，其中 gbtree、dart 为树模型、gblinear 为线性函数模型

`eta` 学习率

`tree_method` XGBoost 中树的构造算法，可选项包括: auto, exact, approx, hist, gpu_exact, gpu_hist

`eval_metric` 依据目标函数选择评估指标
rmse: 根均方误差
mae: 平均绝对值误差
logloss: 负的似然函数
error: 二分类问题的分类错误率
merror: 多分类问题的分类错误率
mlogloss: 多分类问题的负似然函数
auc: IOC 曲线下面积
aucpr: PR 曲线下面积

`updater` 线性模型的拟合算法
shotgun: 基于 shotgun 算法的坐标下降法
coord_descent: 普通的坐标下降法
feature_selector: 特征选择和排序算法

`objective` 训练的模型类型和目标函数
reg:linear: 线性回归
reg:logistic: 逻辑回归
binary:logistic: 二分类问题, 输出概率值
binary:logitraw: 二分类问题, 输出得分值，需要通过 sigmoid 函数转化成概率值
binary:hinge: 二分类问题，使用铰链损失函数,输出 0 或 1，而不是概率值
count:poisson: 用于计数问题的泊松分布，输出泊松分布的均值。
survival:cox: Cox regression for right censored survival time data
multi:softmax: 多分类目标函数, 使用此目标函数，需要设置样本类别数据： num_class
multi:softprob: 同 softmax, 但是输出的结果为 ndata * nclass 维的向量，表示样本属于每个类别的概率

`cyclic`: 循环变量特征
`shuffle`: 类型与循环变量特征，但是在每次更新时都会随机打乱特征的顺序
`random`: 随机(带替换)的坐标选择器
`greedy`: 选择最大梯度的坐标
`thrifty`: 近似 greedy 的坐标选择器
`top_k`: greedy 算法和 thrifty 算法选择的最优特征数量，0 表示不限制。

### API
**1. 数据结构类，提供数据的构建和处理**
`xgboost.DMatrix(data, label=None, missing=None, weight=None, silent=False, feature_names=None, feature_types=None)`

`data`数据源或文件路径
`label`训练数据的标签
`missing`缺省值表示字符，如果没填, 默认值为：np.nan
`weight`每个样本的权重
`silent`构造数据结构时是否显示日志
`feature_names`各个特征的名称
`feature_types`各个特征的数据类型
`nthread` 加载数据开启的线程数

**2. 模型类，提供了一些基础的函数，如模型加载、保存、评估和预测等方法**
`xgboost.Booster(params=None, cache=(), model_file=None)`

```python
load_model(fname)
从文件或内存中加载模型，参数含义如下：

fname (string or a memory buffer) – 模型文件名称或内存缓存对象
2. save_model(fname)
将模型保存到文件中，参数的含义如下：

fname (string) – 输出文件的名称
3. eval(data, name, iteration)
用给定的数据评估模型好坏，参数的含义如下:

data (DMatrix) – 用于评估模型的数据

name (str, 可选) – 用于评估模型的数据集名称

iteration (int, 可选) –迭代次数
```
**3. 对模型进行训练**
`xgboost.train(params, dtrain, num_boost_round=10, evals=(), obj=None, feval=None, maximize=False, early_stopping_rounds=None, evals_result=None, verbose_eval=True, learning_rates=None, xgb_model=None, callbacks=None)`

`params`配置参数
`dtrain`训练数据
`num_boost_round`生成树的数量
`evals`评估数据
`obj`自定义的目标函数
`feval`自定义的评价函数
`maximize`是否最大化评价指标
`early_stopping_rounds`错误率 early_stopping_rounds 轮未下降，则停止训练
`evals_result`模型评估结果
`learning_rates`学习率
`xgb_model`在训练前加载之前训练的模型
`callback`设置回调函数，比如重新设置学习率

**4. 对数据分类**
`xgboost.XGBClassifier(max_depth=3, learning_rate=0.1, n_estimators=100, silent=True, objective='binary:logistic', nthread=-1, gamma=0, min_child_weight=1, max_delta_step=0, subsample=1, colsample_bytree=1, colsample_bylevel=1, reg_alpha=0, reg_lambda=1, scale_pos_weight=1, base_score=0.5, seed=0, missing=None)`

`max_depth` 最大树深度
`learning_rate` 学习率
`n_estimators` 树的迭代次数
`gamma` 节点分裂需要下降的最小损失
`min_child_weight` 节点中样本的最小权重和
`max_delta_step` 每轮允许叶子输出值的最大增量
`subsample` 每轮训练使用的样本数量等于样本总数乘以采样率
`colsample_bytree` 每轮训练使用的特征占比
`colsample_bylevel` 每层训练使用的特征占比
`reg_alpha` L1 正则
`reg_lambda` L2 正则
`scale_pos_weight` 用于控制正例和负例均衡的权重
`base_score` 初始时各个样本的得分

**5. 数据拟合和预测**

```python
xgboost.fit(X, y, sample_weight=None, eval_set=None, eval_metric=None, early_stopping_rounds=None, verbose=True)
# sample_weight：每个训练样本的权重
# eval_set：设置验证集
# eval_metric：验证的度量指标
# early_stopping_rounds` 指定连续多少轮未改善后停止

xgboost.predict(data, output_margin=False, ntree_limit=0, pred_leaf=False, pred_contribs=False, approx_contribs=Flase, pred_interactions=False, validate_features=Flase)`

# output_margin 是否输出原始未经转化的值
# ntree_limit 用于预测的树的数量，默认为0，代表使用所有树进行预测
# pred_leaf 指明每条数据分别落到每棵树的哪个叶子节点上
# pred_contribs 指明每个样本的每个特征对预测结果的贡献值
# approx_contribs 是否启用特征贡献大小的预估功能
# pred_interactions 指明两两特征间相互影响的SHAP值
# validate_features首先验证待预测的数据特征名称是否与模型中的特征名称相同，默认情况下，系统认为他们是相同的，不进行验证
```

- `class xgboost.XGBRegressor()`用于回归任务

### XgBoost 示例
```python
import xgboost as xgb
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score

train_data = pd.read_csv('train.csv')   # 读取数据
y = train_data.pop('30').values   # 用pop方式将训练数据中的标签值y取出来，作为训练目标，这里的‘30’是标签的列名
col = train_data.columns
x = train_data[col].values  # 剩下的列作为训练数据
train_x, valid_x, train_y, valid_y = train_test_split(x, y, test_size=0.333, random_state=0)   # 分训练集和验证集
# 这里不需要Dmatrix

parameters = {
              'max_depth': [5, 10, 15, 20, 25],
              'learning_rate': [0.01, 0.02, 0.05, 0.1, 0.15],
              'n_estimators': [500, 1000, 2000, 3000, 5000],
              'min_child_weight': [0, 2, 5, 10, 20],
              'max_delta_step': [0, 0.2, 0.6, 1, 2],
              'subsample': [0.6, 0.7, 0.8, 0.85, 0.95],
              'colsample_bytree': [0.5, 0.6, 0.7, 0.8, 0.9],
              'reg_alpha': [0, 0.25, 0.5, 0.75, 1],
              'reg_lambda': [0.2, 0.4, 0.6, 0.8, 1],
              'scale_pos_weight': [0.2, 0.4, 0.6, 0.8, 1]
}
xlf = xgb.XGBClassifier(max_depth=10,
            learning_rate=0.01,
            n_estimators=2000,
            silent=True,
            objective='binary:logistic',
            nthread=-1,
            gamma=0,
            min_child_weight=1,
            max_delta_step=0,
            subsample=0.85,
            colsample_bytree=0.7,
            colsample_bylevel=1,
            reg_alpha=0,
            reg_lambda=1,
            scale_pos_weight=1,
            seed=1440,
            missing=None)

# 有了gridsearch我们便不需要fit函数
gsearch = GridSearchCV(xlf, param_grid=parameters, scoring='accuracy', cv=3)
gsearch.fit(train_x, train_y)

print("Best score: %0.3f" % gsearch.best_score_)
print("Best parameters set:")
best_parameters = gsearch.best_estimator_.get_params()
for param_name in sorted(parameters.keys()):
    print("\t%s: %r" % (param_name, best_parameters[param_name]))
```
## LightGBM
### paramenter 常用参数
**objective**:
‘regression’,’regression_l2’,’mean_squared_error’,’mse’,’l2_root’,’root_mean_squred_error’,’rmse’： 表示回归任务，但是使用 L2 损失函数。默认为’regression’
‘binary’： 表示二分类任务，使用对数损失函数作为目标函数。
‘multiclass’： 表示多分类任务，使用 softmax 函数作为目标函数。必须设置 num_class 参数
‘multiclassova’,’multiclass_ova’,’ova’,’ovr’： 表示多分类任务，使用 one-vs-all 的二分类目标函数。必须设置 num_class 参数
‘regression_l1’,’mae’,’mean_absolute_error’： 表示回归任务，但是使用 L1 损失函数。
‘huber’： 表示回归任务，但是使用 huber 损失函数。
‘fair’： 表示回归任务，但是使用 fair 损失函数。
‘poisson’： 表示 Poisson 回归任务。
‘quantile’： 表示 quantile 回归任务。
‘quantile_l2’：表示 quantile 回归任务，但是使用了 L2 损失函数。
‘mape’,’mean_absolute_precentage_error’： 表示回归任务，但是使用 MAPE 损失函数
‘gamma’： 表示 gamma 回归任务。
‘tweedie’： 表示 tweedie 回归任务。
‘xentropy’,’cross_entropy’： 目标函数为交叉熵（同时具有可选择的线性权重）。要求标签是[0,1] 之间的数值。
‘xentlambda’,’cross_entropy_lambda’： 替代了参数化的 cross_entropy 。要求标签是[0,1] 之间的数值。
‘lambdarank’：表示排序任务。

**boosting_type**: // 基学习器模型算法
‘gbdt’： 表示传统的梯度提升决策树。默认值为’gbdt’
‘rf’： 表示随机森林。
‘dart’： 表示带 dropout 的 gbdt
‘goss’：表示 Gradient-based One-Side Sampling 的 gbdt

**metric**：//指定度量的指标
‘l1’ 或者 mean_absolute_error 或者 mae 或者 regression_l1： 表示绝对值损失
‘l2’ 或者 mean_squared_error 或者 mse 或者 regression_l2 或者 regression：表示平方损失
‘l2_root’ 或者 root_mean_squared_error 或者 rmse：表示开方损失
‘quantile’ 表示 Quantile 回归中的损失
‘mape’ 或者 ‘mean_absolute_percentage_error’ 表示 MAPE 损失
‘huber’ 表示 huber 损失
‘fair’ 表示 fair 损失
‘poisson’ 表示 poisson 回归的负对数似然
‘gamma’ 表示 gamma 回归的负对数似然
‘gamma_deviance’ 表示 gamma 回归的残差的方差
‘tweedie’ 表示 Tweedie 回归的负对数似然
‘ndcg’ 表示 NDCG
‘map’ 或者’mean_average_precision’ 表示平均的精度
‘auc’ 表示 AUC
‘binary_logloss’或者’binary’ 表示二类分类中的对数损失函数
‘binary_error’ 表示二类分类中的分类错误率
‘multi_logloss’或者 ‘multiclass’或者 ‘softmax’或者 ‘multiclassova’或者 ‘multiclass_ova’,或者’ova’或者 ‘ovr’ 表示多类分类中的对数损失函数
‘multi_error’ 表示多分类中的分类错误率
‘xentropy’或者’cross_entropy’ 表示交叉熵
‘xentlambda’ 或者’cross_entropy_lambda’ 表示 intensity 加权的交叉熵
‘kldiv’或者’kullback_leibler’ 表示 KL 散度

### 数据结构
**1. 数据结构类，提供数据的构建和处理**
`lightgbm.Dataset(data, label=None, max_bin=None, reference=None, weight=None, group=None, init_score=None, silent=False, feature_name='auto', categorical_feature='auto', params=None, free_raw_data=True)`

`label` 指定数据的标签列
`max_bin` 特征值最大分类数量
`reference` 增加评估参照，评估模型时使用，reference=train
`weight` 设置权重
`group` 设置数据组的大小
`init_score` 加入之前的分数
`silent` 是否在训练过程中屏蔽输出
`feature_name` 特征名字
`categorical_feature`设置分类特征
`free_raw_data` 创建完后释放数据

**2. 模型类，提供了一些基础的函数，如模型加载、保存、评估和预测等方法**
`lightgbm.Booster(params=None, train_set=None, model_file=None, model_str=None, silent=False)`
`params` 一个字典或者 None，给出了 Booster 的参数。默认为 None
`train_set` 一个 Dataset 对象或者 None，给出了训练集。 默认为 None
`model_file` 一个字符串或者 None，给出了 model file 的路径。 默认为 None
`silent` 一个布尔值，指示是否在构建过程中打印消息。默认为 False

```python
lightgbm.add_valid(data,name) # 添加一个验证集。
lightgbm.current_iteration() # 返回当前的迭代的index（即迭代的编号）
lightgbm.dump_model(num_iteration=-1) # dump 当前的Booster 对象为json 格式。
lightgbm.eval(data,name,feval=None) # 对指定的数据集evaluate
lightgbm.eval_train(feval=None) # 对训练集进行evaluate
lightgbm.eval_valid(feval=None) # 对验证集进行evaluate
lightgbm.feature_importance(importance_type='split', iteration=-1) # 获取特征的importance
lightgbm.feature_name() # 获取每个特征的名字。
lightgbm.free_dataset() # 释放Booster 对象的数据集
lightgbm.free_network() # 释放Booster 对象的Network
lightgbm.get_leaf_output(tree_id, leaf_id) # 获取指定叶子的输出
lightgbm.num_feature() # 获取特征的数量（即由多少列特征）
lightgbm.reset_parameter(params) #重设Booster 的参数。
lightgbm.rollback_one_iter() # 将Booster 回滚一个迭代步
lightgbm.save_model(filename,num_iteration=-1) # 保存Booster 对象到文件中。
lightgbm.set_attr(**kwargs) # 设置Booster 的属性。
lightgbm.set_network(machines,local_listen_port=12400,listen_time_out=120,num_machines=1) # 配置网络
lightgbm.set_train_data_name(name) # 设置训练集的名字
lightgbm.update(train_set=None, fobj=None) # 更新一个迭代步
```
### 训练
**1. `lightgbm.train()`执行训练**

`lightgbm.train(params, train_set, num_boost_round=100, valid_sets=None, valid_names=None, fobj=None, feval=None, init_model=None, feature_name='auto', categorical_feature='auto', early_stopping_rounds=None, evals_result=None, verbose_eval=True, learning_rates=None, keep_training_booster=False, callbacks=None)`

`params` 相关参数配置，另外导入字典
`train_set` 训练数据
`num_boost_round` boost 迭代次数
`valid_sets`，`valid_names` 设置训练时用于评估的数据集 *
`fobj` 自定义目标函数 preds, train_data -> grad,hess *
`feval` 自定义评估函数 preds, train*data -> eval_name, eval_result, is_higher_better *
`init_model` 导入之前训练数据
`feature_name` 指定特征名字，数据源为 pandas DataFrame 会使用里面的 column*names
`categorical_feature` 指定分类特征
`early_stopping_rounds` 指定连续多少轮未改善后停止
`evals_result` 指定字典存储 valid_sets 中验证的结果 *
`verbose_eval` 设置打印评估的间隔，可设置每个提升阶段打印或间隔`verbose_eval`个阶段打印
`learning_rates` 设置学习率
`keep_training_booster` 设置训练得到的 booster 是否继续训练
`callbacks` 设置每次迭代后需要执行的函数

最后返回 booster 实例

**2. `lightgbm.cv()` 执行交叉检验**

`lightgbm.cv(params, train_set, num_boost_round=10, folds=None, nfold=5, stratified=True, shuffle=True, metrics=None, fobj=None, feval=None, init_model=None, feature_name='auto',categorical_feature='auto', early_stopping_rounds=None, fpreproc=None, verbose_eval=None, show_stdv=True, seed=0, callbacks=None)`

`folds`：一个生成器、一个迭代器、或者 None *
`nfold`：指定交叉检验的数量。默认为 5
`stratified`：指示是否进行分层拆分
`shuffle`：指示是否在拆分之前先混洗数据
`metrics`：指定评估度量标准，在 params 中设置
`fpreproc`：设置预处理函数，在训练开始之前进行 *
`show_stdv`：在训练过程中展示标准差信息
`seed`：一个整数，给出了生成 fold 的随机数种子 *

最后以字典的形式返回检验结果的均值和标准差

### scikit-learn API
**1. LGBMMOdel**
实现 lightgbm 在 scikir-learn 中的接口，详见分类和回归任务

**2. LGBMClassifier: LGBMModel 的子类，用于分类任务**

`lightgbm.LGBMClassifier(boosting_type='gbdt', num_leaves=31, max_depth=-1, learning_rate=0.1, n_estimators=10, max_bin=255, ubsample_for_bin=200000, objective=None, min_split_gain=0.0, in_child_weight=0.001, min_child_samples=20, subsample=1.0, subsample_freq=1, colsample_bytree=1.0, reg_alpha=0.0, reg_lambda=0.0, random_state=None, n_jobs=-1, silent=True, **kwargs)`

`boosting_type`： 指定学习器的算法’gbdt, rf, dart, goss’
`num_leaves`：一棵树上的叶子数
`max_depth`：树模型的最大深度
`learning_rate`：学习率
`n_estimators`：提升树的数量
`max_bin`： 每个特征的最大分支数量
`class_weight`：给出了每个类别的权重占比
`subsample_for_bin`：构建直方图的样本的数量 *
`objective`：问题类型以及对应的目标函数，对于 LGBMRegressor 为’regression’；对于 LGBMClassifier 为’binary’ 或者’multiclass’；对于 LGBMRanker 为’lambdarank’
`min_split_gain`：执行切分的最小增益
`min_child_weight`：一个叶子节点上的最小权重之和，默认为 1e-3
`min_child_samples`： 一个叶子节点上包含的最少样本数量
`subsample`： 表示训练样本的采样比例，取值范围为[0.0,1.0]。如果小于 1.0，则 lightgbm 会在每次迭代中随机选择部分样本来训练（非重复采样）
`subsample_freq`：表示训练样本的采样频率
`colsample_bytree`：表示特征的采样比例，取值范围为[0.0,1.0]。如果小于 1.0，则 lightgbm 会在每次迭代中随机选择部分特征
`reg_alpha`：L1 正则化系数
`reg_lambda`：L2 正则化系数
`random_state`：随机数种子 *
`n_jobs`：并行线程数量
`silent`：是否在训练过程中屏蔽输出

```python
import lightgbm as lgb
gbm = lgb.LGBMClassifier()
gbm.n_features_：# 给出了特征的数量
gbm.classes_：# 样本的标签
gbm.n_classes_：# 类别的数量
gbm.best_score_：# 训练完毕模型的最好的score
gbm.best_iteration_：# 训练完毕模型的最好的迭代数
gbm.objective_：# 训练模型的目标函数
gbm.booster_：# 底层的Booster 对象
gbm.evals_result_：# 模型评估结果
gbm.feature_importances_： # 特征的重要性
```
### 预测
```python
gbm.fit(X, y, sample_weight=None, init_score=None, eval_set=None, eval_names=None, eval_sample_weight=None, eval_init_score=None, eval_metric='logloss', early_stopping_rounds=None, verbose=True, feature_name='auto', categorical_feature='auto', callbacks=None)`
# sample_weight：每个训练样本的权重
# init_score：每个训练样本的初始分数
# group：每个训练样本的分组

# eval_set：设置验证集
# eval_names：设置验证集的名字
# eval_sample_weight：验证集中每个样本的权重
# eval_init_score：每个验证集中，每个样本的init score
# eval_group：每个验证集中，每个样本的分组
# eval_metric：验证的方法

gbm.predict(data, num_iteration=-1, raw_score=False, pred_leaf=False, pred_contrib=False, data_has_header=False, is_reshape=True, pred_parameter=None)
# num_iteration`：设置在预测时，使用多少个子树
# raw_score`：是否输出raw score
# pred_leaf： 输出每个样本在每个子树的哪个叶子上
# pred_contrib：输出每个特征对每个样本预测结果的贡献程度
# data_has_header：指示数据集是否含有标题
# is_reshape：是否reshape
# pred_parameter：给出其它的参数

gbm.predict_proba(X, raw_score=False, num_iteration=0)
```

- LGBMRegressor 是 LGBMModel 的子类，它用于回归任务
- LGBMRanker 是 LGBMModel 的子类，它用于排序任务，详见排序学习算法

### 绘图 API
### booster API
### LightGBM 示例
```python
import pandas as pd
import lightgbm as lgb
from sklearn.grid_search import GridSearchCV  # Perforing grid search
from sklearn.model_selection import train_test_split

train_data = pd.read_csv('train.csv')   # 读取数据
y = train_data.pop('30').values   # 用pop方式将训练数据中的标签值y取出来，作为训练目标，这里的‘30’是标签的列名
col = train_data.columns
x = train_data[col].values  # 剩下的列作为训练数据
train_x, valid_x, train_y, valid_y = train_test_split(x, y, test_size=0.333, random_state=0)   # 分训练集和验证集
train = lgb.Dataset(train_x, train_y)
valid = lgb.Dataset(valid_x, valid_y, reference=train)

parameters = {
              'max_depth': [15, 20, 25, 30, 35],
              'learning_rate': [0.01, 0.02, 0.05, 0.1, 0.15],
              'feature_fraction': [0.6, 0.7, 0.8, 0.9, 0.95],
              'bagging_fraction': [0.6, 0.7, 0.8, 0.9, 0.95],
              'bagging_freq': [2, 4, 5, 6, 8],
              'reg_alpha': [0, 0.1, 0.4, 0.5, 0.6],
              'reg_lambda': [0, 10, 15, 35, 40],
              'cat_smooth': [1, 10, 15, 20, 35]
}
gbm = lgb.LGBMClassifier(boosting_type='gbdt',
                         objective = 'binary',
                         metric = 'auc',
                         verbose = 0,
                         learning_rate = 0.01,
                         num_leaves = 35,
                         feature_fraction=0.8,
                         bagging_fraction= 0.9,
                         bagging_freq= 8,
                         reg_alpha= 0.6,
                         reg_lambda= 0)

gsearch = GridSearchCV(gbm, param_grid=parameters, scoring='accuracy', cv=3)
gsearch.fit(train_x, train_y)

print("Best score: %0.3f" % gsearch.best_score_)
print("Best parameters set:")
best_parameters = gsearch.best_estimator_.get_params()
for param_name in sorted(parameters.keys()):
    print("\t%s: %r" % (param_name, best_parameters[param_name]))
```