# train eshte skripta permes se ciles formohet .pkl fajlli pra classifier permes training

import numpy as np
import matplotlib.pyplot as plt

from sklearn.ensemble import RandomForestClassifier
# from sklearn.metrics import accuracy_score, classification_report

import joblib
from sklearn.inspection import permutation_importance
from sklearn.metrics import accuracy_score, precision_score, recall_score, confusion_matrix

labels = []
data_file = open('dataset/dataset.arff').read()
data_list = data_file.split('\n')
data = np.array(data_list)
data_array = [i.split(',') for i in data]
data_array = data_array[0:-1]
for i in data_array:
    labels.append(i[30])
data_array = np.array(data_array)
features = data_array[:, :-1]

# Choose only the relevant features from the data set.
features = features[:, [0, 1, 2, 3, 4, 5, 6, 8, 9, 11, 12, 13, 14, 15, 16, 17, 22, 23, 24, 25, 27, 29]]
# features = features[:, [0, 1, 5, 6, 8, 9, 12, 13, 14, 15, 23, 24, 25, 27]]

features = np.array(features).astype(np.float)

# 50/50
"""
features_train = features[:5531]
features_test = features[5531:]
labels_train = labels[:5531]
labels_test = labels[5531:]
"""

"""
# BetterRes
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

"""
features_train = features[9955:]
features_test = features[:9955]
labels_train = labels[9955:]
labels_test = labels[:9955]
"""

# features_train = features[:2200]
# features_test = features[2200:]
# labels_train = labels[:2200]
# labels_test = labels[2200:]

features_train = features
features_test = features
labels_train = labels
labels_test = labels

# features_train = features[:10000]
# features_test = features[10000:]
# labels_train = labels[:10000]
# labels_test = labels[10000:]


print("\n\n ""Random Forest Algorithm Results"" ")
clf4 = RandomForestClassifier(verbose=2, oob_score=True)
clf4.fit(features_train, labels_train)
predictions = clf4.predict(features_test)
accuracy = 100.0 * accuracy_score(labels_test, predictions)

importances = clf4.feature_importances_
print(importances)
print("=========================================")
print(clf4.oob_score_)
std = np.std([tree.feature_importances_ for tree in clf4.estimators_], axis=0)
indices = np.argsort(importances)[::-1]

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
indices_list = indices.tolist()
print(indices_list)
for label in range(len(indices_list)):
    indices_list[label] = features_plot[indices_list[label]]
# plt.figure()
# plt.title("Rendesia e vetive")
# plt.bar(range(features_train.shape[1]), importances[indices],
#         color="r", yerr=std[indices], align="center")
#
# plt.xticks(range(features_train.shape[1]), indices)
# plt.xlim([-1, features_train.shape[1]])
# plt.legend()
# plt.show()

result = permutation_importance(clf4, features_test, labels_test, n_repeats=10,
                                random_state=42, n_jobs=2)
print("-------------------------------------------------------------------")
print(result.importances_mean)
print("-------------------------------------------------------------------")


sorted_idx = result.importances_mean.argsort()
print(sorted_idx)
print("-------------------------------------------------------------------")
print(result.importances[sorted_idx].T)
print("-------------------------------------------------------------------")

fig, ax = plt.subplots()
ax.boxplot(result.importances[sorted_idx].T,
           vert=False, labels=sorted_idx)
ax.set_title("Permutation Importances (test set)")
fig.tight_layout()
plt.show()

# labels_test = [int(i) for i in labels_test]
# predictions = [int(i) for i in predictions]
#
# precision_score = precision_score(labels_test, np.array(predictions))
# recall_score = recall_score(np.array(labels_test), np.array(predictions))
# confusion_matrix = confusion_matrix(np.array(labels_test), np.array(predictions))
# print("Accuracy is :" + str(accuracy))
# print("=========================================")
# print("Precision Score: " + str(precision_score))
# print("=========================================")
# print("Recall Score: " + str(recall_score))
# print("=========================================")
# print("Confusion Matrix: " + str(confusion_matrix))
# print("=========================================")

# joblib.dump(clf4, 'classifier/random_forest_new_4.pkl')
