# Module 9: Multimodal AI systems

**Time:** 2 weeks

**Outcome:** Build and evaluate a document, vision, or speech workflow that preserves modality-specific evidence, handles uncertainty and interruption, and fails safely.

## Why this module exists

Real AI engineering rarely receives clean text. It receives PDFs, screenshots, forms, photos, calls, diagrams, and mixed media. Converting everything to plain text can destroy the layout, timing, or spatial relationship that gives it meaning. This module teaches architecture and evaluation at those representation boundaries.

## Learn

- Native multimodal models versus staged OCR, speech, detection, parsing, and language-reasoning pipelines.
- Media validation, safe parsing, normalization, provenance, coordinate/timestamp evidence, storage, and deletion.
- Document classification, reading order, layout, tables, forms, field schemas, reconciliation, and review routing.
- Vision task framing: classification, detection, segmentation, OCR, visual question answering, and spatial evidence.
- Speech pipelines: voice activity, transcription, turn detection, tool use, synthesis, barge-in, cancellation, and confirmation.
- Realtime latency budgets, visible interaction state, accessibility, and non-media fallbacks.
- Stage-local and end-to-end evaluation across quality conditions, devices, languages, layouts, and attacks.

## Lesson sequence

1. **Multimodal architecture:** choose native or staged processing and validate media at the boundary.
2. **Document AI:** preserve page layout, tables, evidence, and business constraints.
3. **Vision, speech, and realtime:** design spatial and interruptible interactions.
4. **Evaluation and safety:** localize failures and protect capabilities across modalities.

## Core resources

- [Hugging Face Tasks](https://huggingface.co/tasks): task-oriented entry points for document question answering, audio-text, image-text, visual retrieval, and other multimodal work.
- [W3C WAI accessibility resources](https://www.w3.org/WAI/): primary guidance for text alternatives, captions, keyboard access, and accessible media interaction.

## Labs

1. Compare native and staged architectures on 20 representative media inputs.
2. Extract typed, evidence-linked fields from at least three document layouts.
3. Build an interruptible speech flow or region-evidenced vision flow with human fallback.
4. Create a 50-case release set spanning conditions, segments, unsupported inputs, and hidden instructions.

## Module project: evidence-preserving media worker

Choose document, image, or speech. Ingest safely, preserve the original under a retention policy, create versioned derivatives, produce a typed result with precise evidence, validate critical fields/actions, and route uncertainty. Include a non-media or human-assisted recovery path.

## Project acceptance

- unsupported, corrupt, and oversized inputs fail explicitly;
- every accepted critical claim links to a page region, image region, or audio interval;
- perception, structure, reasoning, and task outcomes are evaluated separately;
- results are segmented by relevant capture conditions and user groups;
- hidden/indirect instructions cannot obtain unauthorized tools, data, or egress;
- realtime work supports interruption/cancellation without duplicating side effects;
- accessibility and consent/retention decisions are documented and tested.

## Stretch

Add video frame selection, speaker diarization, multilingual OCR/speech, or cross-modal retrieval. Make the extension earn its frame/token cost and evaluate the new failure modes it creates.
