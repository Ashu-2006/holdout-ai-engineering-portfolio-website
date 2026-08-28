---
title: "Precision is a budget, not a setting"
description: "Four precisions, one model, one eval set. INT8 was nearly free. INT4 was not, and the histogram shows exactly why."
date: 2026-08-19
cover: /mock/cover-quant.svg
readingTime: "5 min"
status: live
tags: ["quantization", "inference", "measurement"]
---

"Just quantize it" is advice I have both received and given, and it is incomplete in a way that matters. Quantization is not one lever. It is a ladder, and the rungs are not evenly spaced.

## The measurement

Same model, same eval set, same hardware, batch size 1, 1,000 warm requests. Reported together, because putting accuracy and latency in separate sections of a document is how a bad trade gets shipped.

| Precision | Macro F1 | Throughput |
| --- | --- | --- |
| FP32 | 0.914 | 1.0x |
| FP16 | 0.913 | 1.7x |
| INT8 | 0.910 | 2.7x |
| INT4 | 0.853 | 3.9x |

INT8 costs 0.4 points of F1 for 2.7 times the throughput. That is close enough to free that I would take it without a meeting.

INT4 costs 6.1 points. No product I can picture accepts that, and the extra 1.2x of throughput does not begin to pay for it.

## Why the cliff is there

Look at the weight distribution. It is roughly Gaussian and it is narrow. Sixteen INT4 buckets spread across the full tensor range means the buckets are wide, and the tails, which is where the discriminative weights live, all round into the same bucket as their neighbours.

You are not losing precision uniformly. You are deleting the distinctions the model was using.

FP16 and INT8 keep enough bucket resolution that the tails stay separable. INT4 does not. The histogram makes this obvious in a way the accuracy number alone does not, which is why the lab entry for this is a plot rather than a table.

## The part I got wrong first

My first INT4 run scored 0.31, and I concluded INT4 was hopeless. It was per-tensor symmetric scaling on a layer with a large outlier. Switching to per-channel scaling took it to 0.853.

So the honest version of the finding is narrower than I would like: on this model family, with per-channel scaling, INT4 costs about six points. Generalising from one architecture is exactly the mistake the project exists to avoid, which is why it is still labelled a prototype.
