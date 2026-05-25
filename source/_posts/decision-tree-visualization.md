---
title: tip:决策树、随机森林结果可视化
date: 2019-08-10 00:00:00
categories:
  - notes
tags:
  - sklearn
---

scikit-learn 决策树结果的可视化,方便观察模型，以及发现模型中的问题。
需要安装 `graphviz`

## 环境搭建
### 安装 graphviz
linux：`sudo apt install graphviz`
windows: 去官网下载 [http://www.graphviz.org/](http://www.graphviz.org/)

设置环境变量：将 graphviz 的 bin 目录加到 PATH

安装 python 库 graphviz，pydotplus：
`pip install graphviz, pydotplus`

## 可视化模型
```python
clf = DecisionTreeClassifier(max_depth=max_depth_val)
clf.fit(X_train, y_train)

# 使用graphviz提取出节点数据
dot_data = tree.export_graphviz(clf, out_file=None, feature_names=feature_names, class_names=target_names, filled=True, rounded=True, special_characters=True)
```
## 生成可视化文件
可利用 pydotplus 生成 pdf 文件

```python
graph = pydotplus.graph_from_dot_data(dot_data)
graph.write_pdf("dataset.pdf")
```
也可以利用 Ipython 的图片显示功能

```python
from IPython.display import Image
graph = pydotplus.graph_from_dot_data(dot_data)
Image(graph.create_png())
```

---

参考资料：
[https://blog.csdn.net/ydyang1126/article/details/78842952](https://blog.csdn.net/ydyang1126/article/details/78842952)
[https://github.com/ljpzzz/machinelearning/blob/master/classic-machine-learning/decision_tree_classifier.ipynb](https://github.com/ljpzzz/machinelearning/blob/master/classic-machine-learning/decision_tree_classifier.ipynb)