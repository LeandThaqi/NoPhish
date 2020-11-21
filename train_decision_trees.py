# train eshte skripta permes se ciles formohet .pkl fajlli pra classifier permes training

import numpy as np
import matplotlib.pyplot as plt

from sklearn import tree
# from sklearn.metrics import accuracy_score, classification_report
# from sklearn import metrics

import joblib
from sklearn.metrics import accuracy_score

labels = []
data_file = open('dataset/TrainingDataset.arff').read()

data_list = data_file.split('\n')

data = np.array(data_list)

data1 = [i.split(',') for i in data]

data1 = data1[0:-1]
for i in data1:
    labels.append(i[30])

data1 = np.array(data1)


features = data1[:, :-1]


# Choose only the relevant features from the data set.
features = features[:, [0, 1, 2, 3, 4, 5, 6, 8, 9, 11, 12, 13, 14, 15, 16, 17, 22, 23, 24, 25, 27, 29]]

features = np.array(features).astype(np.float)

# 50/50
"""
# BetterRes
features_train = features[:5531]
features_test = features[5531:]
labels_train = labels[:5531]
labels_test = labels[5531:]

"""
"""

features_train = features[5531:]
features_test = features[:5531]
labels_train = labels[5531:]
labels_test = labels[:5531]
"""
# 70/30

# BetterRes
# features_train = features[:7745]
# features_test = features[7745:]
# labels_train = labels[:7745]
# labels_test = labels[7745:]

# features_train = features[7745:]
# features_test = features[:7745]
# labels_train = labels[7745:]
# labels_test = labels[:7745]

# 90/10

# BetterRes
# features_train = features[:9955]
# features_test = features[9955:]
# labels_train = labels[:9955]
# labels_test = labels[9955:]


# features_train = features[9955:]
# features_test = features[:9955]
# labels_train = labels[9955:]
# labels_test = labels[:9955]


features_train = features
features_test = features
labels_train = labels
labels_test = labels


# features_test=features[10000:]
# labels_test=labels[10000:]


print("\n\n ""Decision Trees Algorithm Results"" ")
clf4 = tree.DecisionTreeClassifier()
clf4.fit(features_train, labels_train)
predictions = clf4.predict(features_test)
accuracy = 100.0 * accuracy_score(labels_test, predictions)
print("Accuracy is :"+str(accuracy))
# importances = clf4.feature_importances_
# print(importances)
# std = np.std([tree.feature_importances_ for tree in clf4.estimators_], axis=0)
# indices = np.argsort(importances)[::-1]

# Bar chart per te shfaqur rendesine e vetive per vleresimin final
# plt.figure()
# plt.title("Rendesia e vetive")
# plt.bar(range(features_train.shape[1]), importances[indices],
#        color="r", yerr=std[indices], align="center")
# plt.xticks(range(features_train.shape[1]), indices)
# plt.xlim([-1, features_train.shape[1]])
# plt.show()

# joblib.dump(clf4, 'classifier/decision_trees.pkl', compress=9)
