# Main - merr url e ofruar ne console , nxjerr vetit e faqes permes 'features_extraction' ,
# krahason vetit dhe .pkl fajllin dhe merr parashikimin
import json
import re

import joblib


import features_extraction
import sys
import numpy as np
import whois

from features_extraction import LOCALHOST_PATH, DIRECTORY_NAME


def main():
    url = sys.argv[1]
    features_test = features_extraction.main(url)
    # 2d array per scikit-learn
    features_test = np.array(features_test).reshape((1, -1))
    clf = joblib.load(LOCALHOST_PATH + DIRECTORY_NAME + '/classifier/random_forest_new_4.pkl')
    prediction = clf.predict(features_test)
    prediction_int = int(prediction[0])
    probability = clf.predict_proba(features_test)
    respond_data = {"features": features_test.tolist(), "probability": probability.tolist(),
                    "prediction": prediction_int, "url": url}
    json_respond_data = json.dumps(respond_data)
    print(json_respond_data)


if __name__ == "__main__":
    main()
