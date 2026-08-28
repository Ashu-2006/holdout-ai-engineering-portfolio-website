---
title: "Subword boundaries"
blurb: "Where a BPE tokenizer actually cuts a sentence, and why the cuts land in surprising places."
visual: /mock/lab-tokenizer.svg
teaches: "That token count is not word count, and that a leading space belongs to the token after it."
order: 2
---

"Quantization" is two tokens. "is" is one token, and it includes the space in front of it. That leading space is the detail that trips people up when they try to count tokens by hand.

The practical consequences are all downstream of that. Your context window is measured in these, not in words. Rare technical terms fragment into three or four tokens, so they cost more and are predicted less well. And a prompt that ends mid-token behaves differently from one that ends cleanly.

The ratio here is 4.4 characters per token, which is typical for English prose. Code runs closer to 3. Some non-Latin scripts run under 2, which is a real fairness problem hiding inside a billing detail.
