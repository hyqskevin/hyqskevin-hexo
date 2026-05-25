---
title: imblearn API
date: 2019-08-20 00:00:00
categories:
  - notes
tags:
  - python
---

imblearn 是 python 的第三方库，用于处理不平衡数据(imbalanced data)的分类，一般分为降采样，过采样和综合采样

## imblearn.under_sampling 降采样
使用`imblearn.under_sampling.prototype_generation`来生成新样本

### 常用参数
sampling_strategy
return_indices
random_state
n_neighbors
n_seeds_S
kind_sel
n_jobs
ratio

### 原型选择
`CondensedNearestNeighbour(sampling_strategy='auto', return_indices=False, random_state=None, n_neighbors=None, n_seeds_S=1, n_jobs=1, ratio=None)`
基于压缩最近邻方法执行欠采样
`EditedNearestNeighbours(sampling_strategy='auto', return_indices=False, random_state=None, n_neighbors=3, kind_sel='all', n_jobs=1, ratio=None)`
基于编辑的最近邻居方法执行欠采样
`RepeatedEditedNearestNeighbours(sampling_strategy='auto', return_indices=False, random_state=None, n_neighbors=3, max_iter=100, kind_sel='all', n_jobs=1, ratio=None)`
基于重复编辑的最近邻居方法执行欠采样
`AllKNN(sampling_strategy='auto', return_indices=False, random_state=None, n_neighbors=3, kind_sel='all', allow_minority=False, n_jobs=1, ratio=None)`
基于 AllKNN 方法执行欠采样
`InstanceHardnessThreshold(estimator=None, sampling_strategy='auto', return_indices=False, random_state=None, cv=5, n_jobs=1, ratio=None)`
根据实例硬度阈值执行欠采样
`NearMiss(sampling_strategy='auto', return_indices=False, random_state=None, version=1, n_neighbors=3, n_neighbors_ver3=3, n_jobs=1, ratio=None)`
基于 NearMiss 方法执行欠采样
`NeighbourhoodCleaningRule(sampling_strategy='auto', return_indices=False, random_state=None, n_neighbors=3, kind_sel='all', threshold_cleaning=0.5, n_jobs=1, ratio=None)`
根据邻居清洁规则进行欠采样
`OneSidedSelection(sampling_strategy='auto', return_indices=False, random_state=None, n_neighbors=None, n_seeds_S=1, n_jobs=1, ratio=None)`
基于单侧选择方法执行欠采样
`RandomUnderSampler(sampling_strategy='auto', return_indices=False, random_state=None, replacement=False, ratio=None)[source]`
用于执行随机欠采样
`TomekLinks(sampling_strategy='auto', return_indices=False, random_state=None, n_jobs=1, ratio=None)`
通过删除 Tomek 的链接来执行欠采样 s

## imblearn.over_sampling 过采样
ADASYN（[sampling_strategy，…]） 使用自适应合成（ADASYN）采样方法对不平衡数据集执行过采样。
BorderlineSMOTE（[…]） 使用 Borderline SMOTE 进行过采样。
KMeansSMOTE（[…]） 在使用 SMOTE 进行过采样之前应用 KMeans 聚类。
RandomOverSampler（[…]） 用于执行随机过采样的类。
SMOTE（[sampling_strategy，…]） 使用 SMOTE 执行过采样的类。
SMOTENC（categorical_features） 标称和连续的合成少数过采样技术（SMOTE-NC）。
SVMSMOTE（[sampling_strategy，…]） 使用 SVM-SMOTE 进行过采样。

## imblearn.combine 组合采样
SMOTEENN（[sampling_strategy，…]） 使用 SMOTE 执行过采样并使用 ENN 进行清洁的类。
SMOTETomek（[sampling_strategy，…]） 使用 SMOTE 执行过采样并使用 Tomek 链接进行清洁的类。

## imblearn.ensemble 方法整合
BalancedBaggingClassifier（[…]） Bagging 分级机，具 ​​ 有额外的平衡功能。
BalancedRandomForestClassifier（[…]） 平衡的随机森林分类器。
EasyEnsemble（** kwargs） 通过迭代应用随机欠采样来创建集合集。
EasyEnsembleClassifier（[…]） 一袋平衡的提升学习者也被称为 EasyEnsemble。
RUSBoostClassifier（[…]） 随机欠采样集成在 AdaBoost 分类器的学习中。

---

参考资料：
[https://imbalanced-learn.org/en/stable/index.html](https://imbalanced-learn.org/en/stable/index.html)
[https://github.com/scikit-learn-contrib/imbalanced-learn](https://github.com/scikit-learn-contrib/imbalanced-learn)
[https://blog.csdn.net/qq_31813549/article/details/79964973](https://blog.csdn.net/qq_31813549/article/details/79964973)