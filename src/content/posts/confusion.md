---
title: "Reading a confusion matrix like a factory floor"
description: "The off-diagonal cells are the actual findings. When they are symmetric, your labels are the problem, not your model."
date: 2026-08-25
cover: /mock/cover-matrix.svg
readingTime: "4 min"
status: draft
stage: drafting
tags: ["evaluation", "labels", "classification"]
---

Draft, roughly half written.

The argument: everyone reads the diagonal and stops. The diagonal is the summary. The off-diagonal cells are the findings, and the ones that are roughly symmetric almost always mean your label definitions overlap rather than that your model is weak.

Worked example is the review-triage matrix, where neutral and mildly-negative confuse in both directions at nearly identical rates. Three annotators disagreed on that same boundary 22 percent of the time. A classifier cannot be more decisive than its labels, and chasing that pair with more training data was four wasted days.

Still to write: the part about what to do instead, which is either merge the classes or change the labelling guide, and both are product decisions rather than modelling ones.
