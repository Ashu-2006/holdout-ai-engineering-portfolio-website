---
title: Fine-tuned extraction model
outcome: Matched a frontier-model baseline on schema extraction at 1/40th the inference cost
order: 3
metrics:
  - value: "+8.4"
    label: F1 over prompted baseline
  - value: "40x"
    label: cheaper per call
    context: $8.20 to $0.21 per 1k
stack: [Llama 3.1 8B, LoRA, TRL, vLLM]
artifacts:
  - kind: repo
    url: https://github.com/example/extraction
  - kind: model
    url: https://huggingface.co/example/extraction-8b
decisions:
  - decision: Shipped an 8B fine-tune rather than prompting a frontier model
    alternatives: [GPT-class model with few-shot, Long system prompt with schema]
    rationale: Schema adherence reached 99.1% tuned versus 94% prompted
    tradeoff: Gave up general reasoning entirely; the model does exactly one job
    secondOrder:
      - Cost per 1k calls fell from $8.20 to $0.21
      - Self-hosted, so no vendor rate limits during batch runs
evals:
  - method: Exact-match on held-out schema fields
    datasetSize: 2400
    metric: field-level F1
    score: "0.912"
    baseline: "0.828 (prompted frontier model)"
    failureNotes: >-
      Nested optional fields are the weak spot. Anything outside the training
      schema distribution fails silently rather than refusing, which is worse.
limitations:
  - Fails silently on out-of-distribution schemas instead of refusing
  - Nested optional fields remain the weakest area
talkingPoint: When a small tuned model beats a large prompted one, and when it very much does not.
---

A narrow job done cheaply and predictably beat a general model done expensively.
