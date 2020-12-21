# train eshte skripta permes se ciles formohet .pkl fajlli pra classifier permes training

import numpy as np
import matplotlib.pyplot as plt

from sklearn.neural_network import MLPClassifier
# from sklearn.metrics import accuracy_score, classification_report
# from sklearn import metrics

import joblib
from sklearn.metrics import accuracy_score

labels = []
data_file = open('dataset/dataset.arff').read()

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
features_train = features[:5531]
features_test = features[5531:]
labels_train = labels[:5531]
labels_test = labels[5531:]
"""

"""
BetterRes
features_train = features[5531:]
features_test = features[:5531]
labels_train = labels[5531:]
labels_test = labels[:5531]
"""
# 70/30
"""
features_train = features[:7745]
features_test = features[7745:]
labels_train = labels[:7745]
labels_test = labels[7745:]
"""
"""
BetterRes
features_train = features[7745:]
features_test = features[:7745]
labels_train = labels[7745:]
labels_test = labels[:7745]
"""
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


print("\n\n ""Neural Network Algorithm Results"" ")
# clf4 = RandomForestClassifier(min_samples_split=7, verbose=True)
clf4 = MLPClassifier(solver='lbfgs', alpha=1e-5, hidden_layer_sizes=(5, 2), random_state=1, max_iter=10000)
clf4.fit(features_train, labels_train)
predictions = clf4.predict(features_test)
accuracy = 100.0 * accuracy_score(labels_test, predictions)
print("Accuracy is :" + str(accuracy))
# importances = clf4.feature_importances_
# print(importances)
# std = np.std([tree.feature_importances_ for tree in clf4.estimators_], axis=0)
# indices = np.argsort(importances)[::-1]

# Bar chart per te shfaqur rendesine e vetive per vleresimin final
features_plot = ['Has IP instead of domain', 'Long Url', 'Url shortening service', 'Has @ symbol', 'Has "//" in Url',
                 'Has "-" in Url',
                 'Has multiple subdomains', 'Domain registration length', 'Has favicon', 'Has HTTP||HTTPS in domain',
                 'Has too many request Urls',
                 'Has too many anchor Urls', 'Has too many links to other domains',
                 'Has forms that are blank or linked to other domains',
                 'Submits information to email', 'Host name not included in Url', 'Uses iFrame', 'Age of domain',
                 'Has DNS records',
                 'Has website traffic in Alexa Database', 'Is in Google Index',
                 'PhishTank , StopBadware statistical report']
print("=======================")
# indices_list = indices.tolist()
# print(indices_list)
# for label in range(len(indices_list)):
#     indices_list[label] = features_plot[indices_list[label]]
# plt.figure()
# plt.title("Rendesia e vetive")
# plt.bar(range(features_train.shape[1]), importances[indices],
#         color="r", yerr=std[indices], align="center")
#
# plt.xticks(range(features_train.shape[1]), indices)
# plt.xlim([-1, features_train.shape[1]])
# plt.legend()
# plt.show()

# joblib.dump(clf4, 'classifier/neural_network.pkl')
