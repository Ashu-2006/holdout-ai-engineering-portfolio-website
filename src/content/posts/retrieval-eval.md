---
title: "Chunking is the model decision nobody calls a model decision"
description: "Heading-aware chunks beat fixed windows by 11 points of recall on the same corpus, with the same embeddings."
date: 2026-08-27
cover: /mock/cover-refusal.svg
readingTime: "5 min"
status: draft
stage: outlined
tags: ["retrieval", "chunking"]
---

Outlined, not drafted.

Spine of the argument: everyone tunes the embedding model and the top-k, and almost nobody reports their chunking strategy, even though on my corpus it moved recall more than either. Fixed 512-token windows cut definitions in half, so the half containing the term and the half containing the meaning end up in different chunks and neither one answers the question.

Lecture notes are already structured by heading. Respecting that structure was free and worth 11 points.

To write: the counter-case, which is that heading-aware chunking fails badly on documents with no headings, and the honest boundary condition is "this works because my corpus is well structured".
