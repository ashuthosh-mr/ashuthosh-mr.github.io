---
layout: page
title: MAPPARAT
description: A resource-constrained FPGA accelerator for sparse-dense matrix multiplication.
importance: 1
category: research
related_publications: true
---

**MAPPARAT** is an FPGA-based accelerator for sparse-dense matrix multiplication, designed to
deliver high-throughput AI/ML kernel execution under tight resource constraints. The work
explores dataflow and memory-access strategies that keep utilization high when one operand is
sparse and the other dense — a common pattern in machine-learning workloads.

The design and its evaluation were published at the 35th International Conference on VLSI Design
(VLSID) 2022, where it received the **Best Paper Award** {% cite ashuthosh2022mapparat %}.

Highlights:

- Sparse-dense GEMM datapath tuned for constrained FPGA fabrics.
- High computational throughput without exhausting on-chip resources.
- Targeted at accelerating AI/ML kernels on edge-class devices.
