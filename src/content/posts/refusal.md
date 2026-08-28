---
title: "A retrieval system that cannot refuse cannot be trusted"
description: "The hard part of retrieval is not finding the right chunk. It is knowing when there is not one."
date: 2026-08-02
cover: /mock/cover-refusal.svg
readingTime: "7 min"
status: live
tags: ["retrieval", "evaluation", "rag"]
---

I built a thing that answers questions about my lecture notes. The first version answered every question. That was the bug.

Ask it something the notes do not cover and it would confidently assemble an answer out of the nearest four chunks, which is exactly the behaviour that makes someone stop trusting a tool after one bad experience.

## Retrieval always returns something

This is the part that took me too long to internalise. A vector search has no concept of "no match". Ask for the top four chunks and you get four chunks, ranked, always. The scores might all be terrible. The ranking is still perfectly well defined.

So the system's confidence is not a property of retrieval. It is something you have to add.

## What actually worked

A score threshold, and a refusal path that is a first-class output rather than an error case.

    hits = fuse(bm25(q), dense(q))     # reciprocal rank fusion
    if not hits or hits[0].score < TAU:
        return Answer(text=NOT_IN_NOTES, cites=[])
    return generate(q, hits[:4])

Setting TAU is the whole engineering problem, and it is a product decision wearing a hyperparameter's clothes. Too low and you get confident nonsense. Too high and the tool refuses things it does know, which teaches people it is useless.

I picked it by labelling 120 question and answer pairs by hand, including 40 the notes genuinely do not answer, then choosing the threshold that maximised the F1 of the refusal decision rather than of the answers.

## Hybrid retrieval, and why

BM25 and embeddings fail differently, which is the entire argument for running both.

Students search for the exact notation from the slide. Lexical search nails that and embeddings dilute it. Students also search for the idea in their own words, where the reverse is true. Reciprocal rank fusion over both was 11 points of recall better than either alone, a larger gain than any model change I tried.

## The numbers

Faithfulness 0.84, up from 0.52 with embedding-only retrieval, on those 120 hand-labelled pairs. Faithfulness here means every claim in the answer maps to a span that was actually retrieved.

Refusal rate on the 40 unanswerable questions went from 0 percent to 88 percent. That second number is the one I would put on a slide.
