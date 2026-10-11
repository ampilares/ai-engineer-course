# Module 3: Data, math, and classical machine learning

**Time:** 2 weeks

**Outcome:** Frame a business question as an ML task, create a credible baseline, evaluate it, and explain its limitations.

## Learn

- Vectors, matrices, dot products, derivatives/gradients, probability, distributions, expectation, and sampling.
- Data profiling, missing values, categorical encoding, feature engineering, and leakage.
- Supervised vs. unsupervised learning; regression, classification, clustering, and anomaly detection.
- Train/validation/test splits, cross-validation, temporal/group splits, and distribution shift.
- Baselines and metrics: MAE/RMSE, accuracy, precision, recall, F1, ROC/PR curves, calibration.
- Underfitting, overfitting, regularization, class imbalance, interpretability, and error slicing.

## Core resources

- [Google Machine Learning Crash Course](https://developers.google.com/machine-learning/crash-course): current interactive foundation.
- [Kaggle Learn](https://www.kaggle.com/learn): Python, pandas, intro/intermediate ML, data cleaning, explainability.
- [Mathematics for Machine Learning](https://mml-book.github.io/): free book; use selected chapters as reference.
- [StatQuest video index](https://statquest.org/video_index.html): concise visual explanations of statistics and ML.
- [scikit-learn user guide](https://scikit-learn.org/stable/user_guide.html): primary implementation reference.

## Labs

1. Audit a dataset and write a data-quality report before modeling.
2. Define the prediction target, unit of observation, prediction time, and action taken from a prediction.
3. Build a naive rule/constant baseline, then a linear/logistic model and a tree model.
4. Choose a split that matches deployment; demonstrate how leakage inflates a metric.
5. Inspect false positives/negatives and performance across two meaningful segments.

## Project acceptance

- the user decision and cost of errors are explicit;
- the baseline is recorded before tuning;
- the split prevents known leakage;
- the chosen metric matches the business cost;
- results include uncertainty or variation across folds/samples;
- the model card states intended use, data, metrics, limitations, and prohibited use.

## Stretch

Estimate expected business value at multiple decision thresholds. Show why the “best” model metric need not produce the best operational outcome.
