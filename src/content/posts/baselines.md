---
title: "Without a baseline, 0.94 is a decoration"
description: "The most common number on a machine learning portfolio is also the least informative one. Here is what has to sit next to it."
date: 2026-07-14
cover: /mock/cover-baseline.svg
readingTime: "6 min"
status: live
tags: ["evaluation", "baselines", "honesty"]
---

I spent a week being pleased with 0.94 accuracy. Then I checked what the majority class was. It was 0.93.

The model had learned to say "neutral" and had earned one point of accuracy for the effort. Every hour of tuning I had done was noise on top of a constant function.

## What a number needs before it means anything

Four things, and all four are cheap.

**The baseline.** Not a previous model. The dumbest thing that could possibly work: predict the majority class, predict the previous value, match on a keyword. If your model cannot beat that, you do not have a model, you have a constant with extra steps.

**The measurement set.** How many rows, drawn how, held out when. A score on data the model saw during feature selection is not a score.

**The metric, named exactly.** Accuracy on a 93 percent majority class is nearly meaningless. Macro F1 on the same data is informative. If you cannot say why you chose the metric, you chose it because it was the biggest number.

**The conditions under which it falls apart.** Every model has them. On the spindle project, recall drops from 0.89 to 0.41 below 900 RPM, because the fault signature falls under the noise floor. Writing that down cost me nothing and it is the single most useful line in the readme.

## The uncomfortable part

Doing this honestly makes your numbers smaller. The sentiment classifier that was "94 percent accurate" became "0.68 macro F1 against a 0.61 baseline", which is a much less impressive sentence.

It is also the first sentence about that model that was true. And when I later got it to 0.91, I could prove the improvement was real, because there was finally something to compare against.

A number with no baseline cannot go up. It can only be quoted.
