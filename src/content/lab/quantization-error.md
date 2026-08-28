---
title: "Where precision goes"
blurb: "One linear layer's weight distribution against the sixteen values INT4 can represent. The tails are the story."
visual: /mock/lab-quantization.svg
teaches: "Why INT4 has a cliff that INT8 does not, in one picture."
order: 3
---

The grey histogram is 4.2 million weights from one linear layer. The orange lines are the sixteen values INT4 can represent, spread across the tensor range with a symmetric scale.

Notice where the lines sit relative to the data. Most of the distribution's mass falls between two adjacent buckets, and the tails, which carry the discriminative weight, collapse together.

That collapse is the 6.1 points of accuracy in the ladder benchmark. It is not gradual degradation, it is a specific loss of the distinctions the model was relying on.

Per-channel scaling helps because it gives each output channel its own range, so a channel with one large outlier no longer drags every other weight's resolution down with it.
