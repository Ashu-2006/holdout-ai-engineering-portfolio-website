---
title: Multi-agent workflow with tracing
outcome: Cut silent failures 71% by making every tool call in a 6-step agent observable
maturity: deployed
liveDemo: https://example.dev/agent
order: 2
metrics:
  - value: "71%"
    label: fewer silent failures
    context: replay of 400 production runs
    baseline: "31 of 400 runs failed silently"
  - value: "6"
    label: tool steps traced
    context: end to end
stack: [LangGraph, OpenTelemetry, Postgres, FastAPI]
artifacts:
  - kind: repo
    url: https://github.com/example/agent-traces
decisions:
  - decision: Span-per-tool-call instead of one span per agent turn
    alternatives: [One span per turn, Structured logs with no tracing]
    rationale: Turn-level spans hid which of six tools actually failed
    tradeoff: Roughly 4x the trace volume and the storage cost that implies
    secondOrder:
      - Mean time to diagnose a failed run dropped from hours to minutes
      - Sampling became necessary above 10k runs a day
evals:
  - method: Replay of 400 production runs against known-good outputs
    datasetSize: 400
    metric: task completion
    score: "0.88"
    baseline: "0.62 (before retry logic)"
    failureNotes: >-
      Long-horizon tasks past about 12 steps still drift. No good signal yet for
      distinguishing a genuinely stuck agent from a slow tool.
limitations:
  - Drifts on tasks longer than ~12 steps
  - Cannot yet distinguish a stuck agent from a slow tool
talkingPoint: What observability actually has to look like before you trust an agent in production.
---

Agents fail quietly. The interesting engineering was not the orchestration, it
was making failure legible.
