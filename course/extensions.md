# Optional engineering extensions

Choose an extension only after the practical core or when a measured limitation justifies it. Keep the original baseline, change one factor at a time, and use independent cases for the final comparison. These are additional investigations, not required core modules.

## Classical ML and forecasting

Use an authorised labelled dataset for a structured prediction task. Establish a simple majority, previous-value, or seasonal baseline. Split chronologically where the task predicts future outcomes. Fit a small model without leaking future fields; compare error and operational consequences against the baseline. Submit the split rationale, feature provenance, metric calculation, and cases where the simpler method wins.

## Model internals

Choose a behaviour observed in your application: tokenisation, context loss, sampling variability, or attention-related limitations. Design a small controlled experiment with saved prompts and repeated trials. Explain which variables you can actually control. Submit observations and a mechanism-based explanation without claiming access to undocumented model internals.

## Advanced retrieval

Use missed evidence from Week 6. Compare keyword retrieval with embeddings, then optionally hybrid retrieval or reranking. Keep corpus, permissions, source dates, and questions fixed. Measure relevant-source recall, evidence usefulness, latency, and cost separately from answer quality. Submit the comparison and one regression introduced by a change.

## Fine-tuning and adaptation

First establish that better instructions, examples, or retrieval do not resolve the measured gap. Obtain authorised training examples with distinct development and test sets. Compare a small training experiment with the strongest simpler baseline. Include training/inference costs and data maintenance. Submit a go/no-go recommendation; the experiment can appropriately end before training if the case is weak.

## Local models and inference

Use [Ollama's official documentation](https://docs.ollama.com/) or another documented runtime. Check hardware, model licence, tool compatibility, and data egress. Run the same bounded cases locally and through the existing system. Measure setup effort, memory, latency, task success, and energy or hosting cost where measurable. Local execution alone does not establish correct permissions or adequate quality.

## Multiple agents

Identify separable responsibilities in an existing task and a reason coordination might help. Compare a single agent or fixed workflow with a multi-agent design under an equal total budget. Include handoff errors, duplicated work, latency, and conflicting conclusions. Submit complete traces and evidence that coordination adds value, or retain the simpler design.

## Voice and real-time interaction

Define an interaction where speech materially helps. Test interruption, silence, unclear input, tool delays, and transfer to a person. Measure end-to-end response delay and completion success, not only transcription accuracy. Submit a consent/data-handling procedure, trace of an interrupted action, and reliable human handoff.

The [legacy module guides](../modules/README.md) contain deeper engineering material. Recheck external APIs and examples before use; the October core's verification does not retroactively validate every historical lesson.
