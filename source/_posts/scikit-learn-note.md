---
title: scikit-learn 文档学习笔记(1)
date: 2019-07-30 00:00:00
categories:
  - notes
tags:
  - python
---

**—loading …—**
scikit-learn 基于 Python 语言,建立在 NumPy ，SciPy 和 matplotlib 上,是简单高效的数据挖掘和数据分析工具
文章记录 scikit-learn API 的使用方法，包括监督学习、无监督学习，模型的选择和评估，数据集的加载和转换
学习笔记(1) 为监督学习的内容，解决回归和分类问题。包括线性回归，逻辑回归，梯度下降，最近邻，贝叶斯，决策树，支持向量机，集成方法，半监督学习等
API 只给出函数结构，参数具体使用参考[scikit-learn 官方文档](https://scikit-learn.org/stable/user_guide.html)

## 监督学习
### 线性回归模型
目标值 y 是输入变量 x 的线性组合 $y(w,x) = w_0 +w_1x_1 + … + w_px_p$ 其中 w 为系数(coef) $w_0$ 为截距(intercept)。

**1. 普通最小二乘法 LinearRegression**
拟合一个带有系数 $w = (w_1, …, w_p)$ 的线性模型，使得数据集实际观测数据和预测数据（估计值）之间的残差平方和最小。
$\underset{w}{min\,} {|| X w - y||_2}^2$

`sklearn.linear_model.LinearRegression(fit_intercept=True, normalize=False, copy_X=True, n_jobs=None)`

```python
from sklearn.linear_model import LinearRegression
reg = LinearRegression().fit(X,y) # 模型拟合
reg.cof_  # 得到系数矩阵
reg.intercept_ # 得到截距矩阵
reg.score(X,y) # 误差
reg.predict(X) # 预测
```
**2. 岭回归 Ridge**
回归通过对系数的大小**施加惩罚**来解决普通最小二乘法的一些问题。 岭系数最小化的是带罚项的残差平方和。
$\underset{w}{min\,} {||X w - y||_2^2 + \alpha ||w||_2^2}$，其中$\alpha \geq 0$ 是控制系数收缩量的复杂性参数(超参数)

`sklearn.linear_model.Ridge(alpha=1.0, fit_intercept=True, normalize=False, copy_X=True, max_iter=None, tol=0.001, solver=’auto’, random_state=None)`

// alpha 可以设超参数大小
// tol 设置迭代最小边界
// solver : {‘auto’, ‘svd’, ‘cholesky’, ‘lsqr’, ‘sparse_cg’, ‘sag’, ‘saga’} 设置求解器，拟合数据时使用的算法

- `sklearn.linear_model.RidgeCV( )` 内置对$\alpha$的交叉验证实现岭回归

**3. 套索回归 Lasso**
用于拟合**稀疏系数**的线性模型，使用了 coordinate descent （坐标下降算法）来拟合系数，罚项 为 L1 范数。
$\underset{w}{min\,} { \frac{1}{2n_{samples}} ||X w - y||_2 ^ 2 + \alpha ||w||_1}$

`sklearn.linear_model.Lasso(alpha=1.0, fit_intercept=True, normalize=False, precompute=False, copy_X=True, max_iter=1000, tol=0.0001, warm_start=False, positive=False, random_state=None, selection=’cyclic’)`

- `sklearn.linear_model.LassoCV()` // 对超参数$\alpha$采用交叉验证
- `sklearn.linear_model.LassoLars()` // 采用的是最小角回归法，而不是坐标下降法进行优化
- `sklearn.linear_model.LassoLarsCV()` //同时采用不同的验证和优化方法
`sklearn.linear_model.LassoLarsIC()` //对超参数$\alpha$采用 Akaike 信息准则(AIC)和贝叶斯信息准则(BIC),需要假设模型是正确的，对大样本（渐近结果）进行导出

LassoLarsCV 在寻找 $\alpha$ 参数值上更具有优势，而且如果样本数量比特征数量少得多时，通常 LassoLarsCV 比 LassoCV 要快

**4. 弹性网络 ElasticNet**
Lasso 和 Ridge 结合，对普通的线性回归做了正则化，但是它的损失函数既不全是 L1 的正则化，也不全是 L2 的正则化，而是用一个权重参数 ρ 来平衡 L1 和 L2 正则化的比重
适合只有少量参数是非零稀疏的模型
$\underset{w}{min\,} { \frac{1}{2n_{samples}} ||X w - y||_2 ^ 2 + \alpha \rho ||w||_1 +\frac{\alpha(1-\rho)}{2} ||w||_2 ^ 2}$

`sklearn.linear_model.ElasticNet(alpha=1.0, l1_ratio=0.5, fit_intercept=True, normalize=False, precompute=False, max_iter=1000, copy_X=True, tol=0.0001, warm_start=False, positive=False, random_state=None, selection=’cyclic’)`

- `ElasticNetCV()` 可以通过交叉验证来设置参数 $\alpha$ 和 $\rho$

**5. Multitask 多任务**
可以实现多元回归稀疏模型的预测，即多个线性模型共同拟合
有`MultiTaskLasso()`,`MultiTaskLassoCV()`,`MultiTaskElasticNet()`,`MultiTaskElasticNetCV()`

**6. 正交匹配追踪法（OMP）**
`OrthogonalMatchingPursuit( )`
`OrthogonalMatchingPursuitCV( )`

**7. 贝叶斯回归**

**8. 稳健回归**

**9. 多项式回归**

### logistic 线性分类模型
解决分类问题的线性模型，将单次实验的结果输出为概率进行分类
$C \sum_{i=1}^n \log(\exp(- y_i (X_i^T w + c)) + 1) $
可以选择 L1，L2 或 Elastic-Net 正则化进行约束

`sklearn.linear_model.LogisticRegression(penalty=’l2’, dual=False, tol=0.0001, C=1.0, fit_intercept=True, intercept_scaling=1, class_weight=None, random_state=None, solver=’warn’, max_iter=100, multi_class=’warn’, verbose=0, warm_start=False, n_jobs=None, l1_ratio=None)`
// penalty 参数可以设置正则化参数
// C 用$1/{\lambda}$表示的正则化强度参数
// solver : str, {‘newton-cg’, ‘lbfgs’, ‘liblinear’, ‘sag’, ‘saga’} 选择优化算法，详细使用说明见官方文档
// class_weight 可以设置各类型的权重
// l1_ration 设置 Elastic-Net 中 ρ 控制正则化 L1 与正则化 L2 的强度

```python
from sklearn.linear_model import LogisticRegression
reg = LogisticRegression().fit(X,y) # 模型拟合
reg.cof_  # 得到系数矩阵
reg.intercept_ # 得到截距矩阵
reg.score(X,y) # 误差
reg.predict(X) # 得到预测的分类矩阵
reg.predict_proba(X) # 得到预测的概率
```

- `LogisticRegressionCV( )` 实现了内置交叉验证，可以找出最优的 C 和 l1_ratio 参数

### SGD 随机梯度下降
可以拟合线性的回归和分类模型，在样本量很大时尤为有用，选择和函数时要避免过拟合。
`SGDClassifier()` 和 `SGDRegressor()` 分别用于拟合分类问题和回归问题的线性模型，可使用不同的（凸）损失函数，支持不同的惩罚项。

### 最近邻
能够应用于决策边界非常不规则的分类情景

NearestNeighbors
BallTree
KDTree

最近邻分类属于**基于实例的学习**或**非泛化学习**：它不会去构造一个泛化的内部模型，而是简单地存储训练数据的实例。

### 决策树
决策树便于理解和解释，能够处理数值型数据和分类数据；但是容易产生一个过于复杂的模型，泛化性能会很差，结果不稳定，可以通过决策树的集成来得到缓解。如果某些类在问题中占主导地位会使得创建的决策树有偏差，建议在拟合前先对数据集进行平衡。

分类标准为最小化交叉熵（ID3），熵增益（C4.5）或基尼系数（Cart）

`sklearn.tree.DecisionTreeClassifier(criterion=’gini’, splitter=’best’, max_depth=None, min_samples_split=2, min_samples_leaf=1, min_weight_fraction_leaf=0.0, max_features=None, random_state=None, max_leaf_nodes=None, min_impurity_decrease=0.0, min_impurity_split=None, class_weight=None, presort=False)`
// criterion 选择分类标准，可以使用”gini”或者”entropy”
// splitter 设置特征划分标准
// max_feature 划分的最大特征数
// max_depth 选择树的最大深度
// min_sample_split 设置最小样本分类
// min_sample_leaf 设置最小样本叶子数
// max_leaf_nodes 最大叶子节点数
// class_weight 设置类别权重
// presort 设置数据预排序

```python
from sklearn.tree import DecisionTreeClassifier
clf = DecisionTreeClassifier().fit(X,y)
clf.n_class_ # 分类数量
clf.n_features_ # 特征数量
clf.n_outputs_ # 输出数量
clf.tree_ # 得到分类树
clf.get_depth() # 得到分类深度
clf.get_n_leaves() # 得到叶子节点数
clf.predict(X) # 返回预测矩阵
clf.predict_proba(X) # 返回预测的概率
clf.score(X,y) # 返回训练分数
```

决策树回归模型 `sklearn.tree.DecisionTreeRegressor()` （不常用）

可以使用 export_graphviz 导出器以 Graphviz 格式导出决策树,结果保存为 pdf；Jupyter notebook 也可以自动内联式渲染这些绘制节点

```python
# output
import graphviz
dot_data = tree.export_graphviz(clf, out_file=None,\
                    feature_names=iris.feature_names,\
                    class_names=iris.target_names,  \
                    filled=True, rounded=True,  \
                    special_characters=True)
graph = graphviz.Source(dot_data)
graph.render("classification_result")

# show in Jupyter
graph
```
### 支持向量机
可用于分类，回归和异常检测，在高维空间中非常高效，
SVC, NuSVC 和 LinearSV

内核岭回归
核函数

### 朴素贝叶斯
GaussianNB
MultinomialNB
ComplementNB
BernoulliNB

### 集成方法
**1. Bagging**
在原始训练集的随机子集上构建一类黑盒估计器的多个实例，然后把这些估计器的预测结果结合起来形成最终的预测结果，在构建模型的过程中引入随机性，来减少基估计器的方差。

`sklearn.ensemble.BaggingClassifier(base_estimator=None, n_estimators=10, max_samples=1.0, max_features=1.0, bootstrap=True, bootstrap_features=False, oob_score=False, warm_start=False, n_jobs=None, random_state=None, verbose=0)`
// base_estimator 设置分类估计器，默认为决策树，可设置其它分类模型
// n_estimators 设置估计器的数量
// bootstrap 设置样例抽取是否放回
// bootstrap_features 设置特征抽取是否有放回
// oob_score 设置是否用额外的样本来评估泛化精度

```python
from sklearn.ensemble import BaggingClassifier
clf = BaggingClassifier().fit(X,y)
clf.predict(X)
predict_proba(X)
score(X, y)
```
**2. 随机森林**
随机森林中的每棵树构建时的样本都是由训练集经过有放回抽样得到。在构建树的过程中进行结点分割时，选择的分割点不再是所有特征中最佳分割点，而是特征的一个随机子集中的最佳分割点，偏差通常会有略微的增大；但由于取了平均，总体上模型的泛化能力会更好。

`sklearn.ensemble.RandomForestClassifier(n_estimators=’warn’, criterion=’gini’, max_depth=None, min_samples_split=2, min_samples_leaf=1, min_weight_fraction_leaf=0.0, max_features=’auto’, max_leaf_nodes=None, min_impurity_decrease=0.0, min_impurity_split=None, bootstrap=True, oob_score=False, n_jobs=None, random_state=None, verbose=0, warm_start=False, class_weight=None)`
// n_estimators 调整森林里树的数量
// max_features 分割节点时考虑的特征的随机子集的大小。使用 max_features = sqrt(n_features)是比较好的默认值
// max_depth = None 和 min_samples_split = 2 结合可以生成完全树

- 极限随机树 `ExtraTreesClassifier()`
- 完全随机树构成森林 `RandomTreesEmbedding()`

**2. 梯度提升回归树(GBRT)**
GBRT 保证迭代的每一个阶段中选择损失最小的决策树，达到全局的最小损失
$F*m(x) = F*{m-1}(x) + \arg\min*{h} \sum*{i=1}^{n} L(y*i,F*{m-1}(x_i) - h(x))$
GBRT 具有强大的预测能力和鲁棒性，但是扩展性不够好

`GradientBoostingClassifier(loss=’deviance’, learning_rate=0.1, n_estimators=100, subsample=1.0, criterion=’friedman_mse’, min_samples_split=2, min_samples_leaf=1, min_weight_fraction_leaf=0.0, max_depth=3, min_impurity_decrease=0.0, min_impurity_split=None, init=None, random_state=None, max_features=None, verbose=0, max_leaf_nodes=None, warm_start=False, presort=’auto’, validation_fraction=0.1, n_iter_no_change=None, tol=0.0001)`
// loss 设置损失函数，默认为 deviance（$-log_2$ 似然损失函数）
// learning_rate 设置学习步长
// subsample 设置每次子训练集的采样，1 为全采样，一般可设置为 0.5

**3. AdaBoost**
通过反复修改数据权重来训练一些弱学习器，由这些弱学习器的预测结果通过加权投票(或加权求和)的方式组合, 得到最终的预测结果。
$F*m(x) = F*{m-1}(x) + \gamma*m \sum*{i=1}^{n} \nabla*F L(y_i, F*{m-1}(x*i))$
$\gamma_m$代表学习步长，通过计算损失最小的梯度下降$\gamma_m = \arg\min*{\gamma} \sum*{i=1}^{n} L(y_i, F*{m-1}(x*i) - \gamma \frac{\partial L(y_i, F*{m-1}(x*i))}{\partial F*{m-1}(x_i)})$得出

初始化时，将所有弱学习器的权重都设置为 $w_i = 1/N$ ,接下来的连续迭代中，样本的权重逐个地被修改。上一轮迭代中被预测为错误结果的样本的权重将会被增加，而那些被预测为正确结果的样本的权重将会被降低。通过不断得到最快梯度下降的权重来减小损失函数。

`sklearn.ensemble.AdaBoostClassifier(base_estimator=None, n_estimators=50, learning_rate=1.0, algorithm=’SAMME.R’, random_state=None)`
// base_estimator 设置弱学习器，默认 DecisionTreeClassifier(max_depth=1)
// n_estimator 设置最大集成数量
// learning_rate 设置学习速率

**4. 投票分类器**

---

---

- 最小角回归（LARS）：逐步寻找与响应最有关联的预测。当有很多预测有相同的关联时，它并不会继续利用相同的预测，而是在这些预测中找出应该等角的方向。高效但对噪声敏感。