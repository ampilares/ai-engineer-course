# Module 2: Data engineering for AI systems

**Time:** 2 weeks

**Outcome:** Build a replayable, versioned data or knowledge pipeline with source contracts, quality gates, lineage, review operations, and lifecycle controls.

## Why this module exists

AI failures are frequently data failures with a model-shaped symptom: a partial export, lost historical value, stale document, biased review queue, or deletion that never reached an embedding index. This module sits before ML so every later experiment has a reproducible input and every production system can explain where its evidence came from.

## Learn

- Source contracts: identity, schema, ownership, event/effective time, delivery semantics, volume, freshness, permissions, and deletion.
- Batch, event, and change-data ingestion; late/out-of-order data; snapshots and incremental updates.
- Idempotent stages, durable checkpoints, quarantine, backfills, atomic publication, and rollback.
- Data quality at row and dataset level: schema, uniqueness, referential integrity, volume, freshness, distribution, and reconciliation.
- Lineage from sources and transformations to datasets, indexes, evals, and models.
- Labeling rubrics, reviewer calibration, agreement, adjudication, active learning, and feedback selection bias.
- Versioning, permission propagation, correction, deletion, retention, and drift monitoring across derivatives.

## Lesson sequence

1. **Source to dataset:** write the contract and preserve point-in-time provenance.
2. **Pipelines, quality, and lineage:** make execution retryable and publication reviewable.
3. **Labels and feedback:** treat human decisions as measured, selected data.
4. **Data lifecycle:** operate freshness, access, correction, and deletion after launch.

Use the companion interactive lessons under `site/content/modules/data-engineering/` and the software/data section of [RESOURCES.md](../RESOURCES.md#software-data-and-ml-foundations).

## Core resources

- [Data Engineering Zoomcamp](https://github.com/DataTalksClub/data-engineering-zoomcamp): free self-paced end-to-end work on ingestion, orchestration, warehousing, testing, batch, and streaming; select the parts that match this module’s local project.
- [SQLite documentation](https://www.sqlite.org/docs.html) and [Python `sqlite3`](https://docs.python.org/3/library/sqlite3.html): enough to implement the core pipeline without cloud infrastructure.

## Labs

1. Ingest two deliveries containing an insert, update, duplicate, malformed record, late record, and deletion.
2. Add quality checks and publish a complete version atomically; inject partial delivery and transformation failure.
3. Label 60 examples with an overlap set; measure disagreement and revise the rubric.
4. Propagate a correction, permission revocation, and deletion through every active derivative.

## Module project: trustworthy dataset release

Publish a small dataset or retrieval index that another learner can rebuild from declared inputs. Include the source contract, pipeline state, quality report, dataset manifest, lineage, version promotion, rollback, and lifecycle tests.

## Project acceptance

- replaying a delivery produces no duplicate logical records;
- point-in-time fields do not use information unavailable at the cutoff;
- partial or malformed delivery cannot silently replace the active version;
- every published row/chunk traces to source, transformation, and run;
- review metrics distinguish targeted feedback from random quality audits;
- permission revocation and deletion remove active derivatives within the stated service level;
- the learner can identify the blast radius of a deliberately broken parser version.

## Stretch

Add partitioned backfills, schema-compatibility checks, a simple lineage graph, and a freshness/quality dashboard. Compare the operational value against the added infrastructure rather than treating scale as an end in itself.
