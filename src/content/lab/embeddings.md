---
title: "Nearest neighbours"
blurb: "A 2D projection of an embedding space, with one query and its five nearest chunks ringed."
visual: /mock/lab-embedding.svg
teaches: "That 'similar' means 'close in this projection', and that the projection is lying to you a little."
order: 4
---

Three clusters, one query point, five nearest neighbours by cosine distance.

The thing worth internalising: this is a projection down to two dimensions from 768. The distances you can see are not the distances the retriever uses. Two points that look adjacent here can be genuinely far apart, because the projection is optimised to preserve local neighbourhoods rather than global geometry.

So use a plot like this to check whether your clusters are separable at all, and never to justify a threshold. Thresholds get set on real distances, against labelled pairs.

The query sits inside the middle cluster and pulls all five neighbours from it. That is the healthy case. When a query's five neighbours arrive from three different clusters, either the question genuinely spans topics or your chunking cut something in half.
