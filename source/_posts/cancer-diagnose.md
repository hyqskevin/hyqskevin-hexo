---
title: breast-cancer-diagnose from Kaggle
date: 2018-10-28 00:00:00
categories:
  - study
tags:
  - Kaggle
---

人工智能课程作业，乳腺癌检测（from Kaggle）。作业训练基础的数据清理，数据特征分类，验证不同的分类算法之间的分类效果

训练数据集：
[Breast Cancer Wisconsin (Diagnostic) Data Set]
([https://archive.ics.uci.edu/ml/datasets/Breast+Cancer+Wisconsin+%28Diagnostic%29](https://archive.ics.uci.edu/ml/datasets/Breast+Cancer+Wisconsin+%28Diagnostic%29))

- UCI 关于此数据集有两份，本实验使用较为完整的一份

- 实验数据为文本数据，数据量是为 569 的小型数据，有部分数据缺失
- **步骤中降维部分，violin 图部分为半成品，效果并不显著，可以自动忽略**

### Attribute Information:

- ID number

- Diagnosis (M = malignant, B = benign)

Ten real-valued features are computed for each cell nucleus:
a) radius (mean of distances from center to points on the perimeter)
b) texture (standard deviation of gray-scale values)
c) perimeter
d) area
e) smoothness (local variation in radius lengths)
f) compactness (perimeter^2 / area - 1.0)
g) concavity (severity of concave portions of the contour)
h) concave points (number of concave portions of the contour)
i) symmetry
j) fractal dimension (“coastline approximation” - 1)

以下列举部分实验结果，[具体实现步骤>>](https://hyqskevin.coding.me/2018/10/28/cancer-diagnose/breast-cancer-diagnose.html)

- [breast-cancer-diagnose.ipynb download](https://hyqskevin.coding.me/2018/10/28/cancer-diagnose/breast-cancer-diagnose.ipynb)

#### LogisticRegression (逻辑斯蒂回归 分类器)
```plain
from sklearn.linear_model import LogisticRegression

LR = LogisticRegression()
LR.fit(X_train, y_train)
LR.predict(X_test)
LR.score(X_test,y_test)
```
Out: 0.9883040935672515

- **结论：** 通过比较，逻辑斯蒂模型比随机梯度下降模型在测试集上表现有更高的准确性，因为逻辑斯蒂采用解析的方式精确计算模型参数，而随机梯度下降采用估计值
- **特点分析：** 逻辑斯蒂对参数的计算采用精确解析的方法，计算时间长但是模型性能高，随机梯度下降采用随机梯度上升算法估计模型参数，计算时间短但产出的模型性能略低，一般而言，对于训练数据规模在 10 万量级以上的数据，考虑到时间的耗用，推荐使用随机梯度算法

#### SGDClassifier (梯度下降 分类器)
```plain
from sklearn.linear_model import SGDClassifier
```
```plain
SGD = SGDClassifier(loss='hinge', penalty='l2', alpha=0.001, l1_ratio=0.15, fit_intercept=True, max_iter=None, tol=None, shuffle=True, verbose=0, epsilon=0.1, n_jobs=1, random_state=None, learning_rate='optimal', eta0=0.0, power_t=0.5, class_weight=None, warm_start=False, average=False, n_iter=None)
SGD.fit(X_train,y_train)
SGD.predict(X_test)
SGD.score(X_test,y_test)
```
Out: 0.9824561403508771

#### LinearRegression (线性回归 分类器)
```plain
from sklearn.linear_model import LinearRegression
```
```plain
LR2 = LinearRegression(fit_intercept=True, normalize=False, copy_X=True, n_jobs=1)
LR2.fit(X_train,y_train)
LR2.predict(X_test)
LR2.score(X_test,y_test)
```
Out: 0.8739645029687063

#### KNeighborsClassifier (k 近邻 分类器)
```plain
from sklearn.neighbors import KNeighborsClassifier
```
```plain
KNN = KNeighborsClassifier(n_neighbors=5, weights='uniform', algorithm='auto', leaf_size=30, p=2, metric='minkowski', metric_params=None, n_jobs=1, **kwargs)
KNN.fit(X_train,y_train)
KNN.predict(X_test)
KNN.score(X_test,y_test)
```
Out: 0.9883040935672515

#### GaussianNB (朴素贝叶斯 分类器)
```plain
from sklearn.naive_bayes import GaussianNB
```
```plain
GNB = GaussianNB(priors=None)
GNB.fit(X_train,y_train)
GNB.predict(X_test)
GNB.score(X_test,y_test)
```
Out: 0.9766081871345029