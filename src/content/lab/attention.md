---
title: "Attention, one head"
blurb: "Fourteen tokens through a single attention head, with the causal mask and the sink on token zero both visible."
visual: /mock/lab-attention.svg
teaches: "Why the first token soaks up attention, and what the triangular mask actually removes."
order: 1
---

Every row sums to one. That constraint is the whole reason the sink exists: a head with nothing useful to attend to still has to put its mass somewhere, and token zero is the reliable somewhere.

The triangle is the causal mask. Position six cannot see position seven, which is what makes the model able to generate rather than only reconstruct.

The bright diagonal is the head attending to the current token. The softer band beside it is local context.

If you remember one thing: attention is a weighted average, and the weights have to add up, which means attention is always a decision about what to ignore.
