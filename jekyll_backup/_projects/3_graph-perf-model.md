---
layout: page
title: Graph Algorithm Performance Model
description: An analytical performance model for graph algorithms on RISC-V multi-core clusters.
importance: 3
category: research
related_publications: true
---

An **analytical performance model** for RISC-V many-core architectures that enables design-space
exploration for graph-algorithm workloads. Instead of relying solely on lengthy cycle-accurate
simulation, the model predicts how graph workloads scale across cores, capturing the
compute-memory trade-offs that shape performance on a multi-core cluster.

This work forms the core of the M.Tech (by Research) thesis, *Performance Prediction of Graph
Algorithms on RISC-V Multi-Cores*, and was published at TECHCON 2024
{% cite ashuthosh2024graph %}.

Highlights:

- Analytical prediction of graph-algorithm performance on RISC-V multi-cores.
- Fast design-space exploration without full-system simulation.
- Insight into bottlenecks and scaling behavior across cores.
