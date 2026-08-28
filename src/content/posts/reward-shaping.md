---
title: "The sensor was fine. The clock was wrong."
description: "Two weeks of debugging a model that was learning nothing, because two data sources disagreed about what time it was."
date: 2026-06-30
cover: /mock/cover-baseline.svg
readingTime: "6 min"
status: draft
stage: "in review"
tags: ["data", "debugging", "sensors"]
---

With a reader, going out next week.

The story: the spindle classifier plateaued at chance for two weeks. I tried more features, fewer features, three model families, and resampling. All of it was pointless, because the vibration table was stamped by the Arduino's clock and the label table was stamped by the lab PC, and the two drifted apart by up to 40 seconds over a shift.

Every training row was pairing a window of vibration with a label from a slightly different moment. The model was being asked to predict noise and it correctly declined.

The fix was one line of NTP setup and a re-join. The lesson is the one I keep relearning: when a model cannot learn anything at all, suspect the join before the architecture.
