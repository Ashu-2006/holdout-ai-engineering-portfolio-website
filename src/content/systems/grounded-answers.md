---
title: Grounded answer service
outcome: Cut hallucinated citations from 18% to 3% on a 50,000-document corpus
maturity: deployed
relevanceNote: >-
  Built the retrieval and evaluation layer end to end. Maps directly to teams
  shipping grounded answer products where citation accuracy is the constraint.
liveDemo: https://example.dev/demo
featured: true
order: 1
metrics:
  - value: "94%"
    label: precision@5
    context: 50k document corpus
    baseline: "71% dense-only"
  - value: "380"
    unit: ms
    label: p95 latency
    context: including rerank
    baseline: 1.4s
  - value: "3%"
    label: hallucination rate
    context: down from 18%, LLM-as-judge on 500 answers
    baseline: "18%"
diagram:
  kind: svg
  alt: "A query fans out to a dense retriever and a sparse retriever, their results merge through a reranker, and the reader generates a grounded answer"
  caption: "The reranker is where the precision came from, not the embedding model."
  source: |
    <svg viewBox="0 0 640 124" fill="none" stroke-width="1.25" aria-hidden="true">
      <rect x="4" y="44" width="92" height="36" rx="6"/>
      <text x="50" y="66" text-anchor="middle">query</text>

      <rect x="164" y="8" width="120" height="36" rx="6"/>
      <text x="224" y="30" text-anchor="middle">dense · qdrant</text>
      <rect x="164" y="80" width="120" height="36" rx="6"/>
      <text x="224" y="102" text-anchor="middle">sparse · bm25</text>

      <rect x="348" y="44" width="100" height="36" rx="6"/>
      <text x="398" y="66" text-anchor="middle">rerank 50</text>

      <rect x="512" y="44" width="124" height="36" rx="6"/>
      <text x="574" y="66" text-anchor="middle">grounded answer</text>

      <path d="M96 62 L130 62 L130 26 L164 26"/>
      <path d="M96 62 L130 62 L130 98 L164 98"/>
      <path d="M284 26 L316 26 L316 62 L348 62"/>
      <path d="M284 98 L316 98 L316 62 L348 62"/>
      <path d="M448 62 L512 62"/>
    </svg>
stack: [Qdrant, BM25, Cohere rerank, vLLM, Ragas, FastAPI]
artifacts:
  - kind: repo
    url: https://github.com/example/grounded-answers
  - kind: demo
    url: https://example.dev/demo
decisions:
  - decision: Hybrid BM25 + dense retrieval, not dense alone
    alternatives: [Dense-only with bge-large, BM25-only]
    rationale: Dense retrieval missed exact-match part numbers and IDs entirely
    tradeoff: Added 40ms of latency and a second index to keep in sync
    secondOrder:
      - Recall@20 rose from 71% to 89%
      - The reranker had materially better candidates to work with
  - decision: Reranked the top 50 rather than widening the embedding window
    alternatives: [Larger embedding model, Wider top-k with no rerank]
    rationale: A cross-encoder on 50 candidates beat a bigger bi-encoder on 200
    tradeoff: One more network hop, and a vendor dependency in the hot path
    secondOrder:
      - Precision@5 rose 12 points
      - Added a cache layer to keep p95 under the 400ms budget
evals:
  - method: LLM-as-judge with human spot check on 15%
    datasetSize: 1200
    metric: faithfulness
    score: "0.94"
    baseline: "0.71 (dense-only)"
    failureNotes: >-
      Degrades sharply on multi-hop questions spanning three or more documents.
      Tables inside scanned PDFs still parse badly and need a real OCR stage.
limitations:
  - Multi-hop questions across 3+ documents degrade sharply
  - Scanned-PDF tables parse badly; needs a dedicated OCR stage
  - The reranker adds 40ms and a second index to maintain
talkingPoint: >-
  Why the reranker mattered more than the embedding model, and the week I spent
  convinced the retriever was broken when the chunker was.
---

The corpus was technical documentation where a wrong citation is worse than no
answer. Dense retrieval alone looked fine on aggregate scores while failing on
exactly the queries that mattered most: part numbers, error codes, version
strings.
