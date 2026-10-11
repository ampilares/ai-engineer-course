# Module 15: Expert topics and capstone

**Time:** 1 week specialization plus 4 weeks capstone

**Outcome:** Validate one advanced optimization against a baseline, then build and defend a production-shaped capstone with user, quality, safety, reliability, and business evidence.

## Choose one primary track

### Fine-tuning and post-training

Learn data curation, train/validation separation, supervised fine-tuning, parameter-efficient methods (LoRA/QLoRA), preference optimization, catastrophic regressions, and post-tune evaluation. Fine-tune behavior/style or repeated task skill, not changing facts that belong in retrieval.

Resources:

- [Hugging Face LLM Course](https://huggingface.co/learn/llm-course/chapter1/1)
- [Hugging Face PEFT documentation](https://huggingface.co/docs/peft/)
- [OpenAI fine-tuning guide](https://developers.openai.com/api/docs/guides/supervised-fine-tuning)
- [Stanford CS336](https://cs336.stanford.edu/) post-training lectures.

### Local/open-weight inference

Learn model licenses, quantization, memory sizing, throughput/latency, batching, serving, hardware trade-offs, and privacy/operations. Benchmark against a hosted baseline on quality and total cost.

Resources:

- [Ollama documentation](https://docs.ollama.com/)
- [Hugging Face Text Generation Inference](https://huggingface.co/docs/text-generation-inference/)
- [vLLM documentation](https://docs.vllm.ai/)
- [OpenAI gpt-oss documentation](https://developers.openai.com/cookbook/topic/gpt-oss)

### Advanced retrieval

Learn hybrid search, learned reranking, late interaction, query routing/decomposition, contextual/semantic chunking, knowledge graphs, multimodal retrieval, and retrieval distillation. Improve only the failure segment the technique targets.

Resources:

- [DeepLearning.AI RAG course](https://www.deeplearning.ai/courses/retrieval-augmented-generation-rag/)
- [LlamaIndex advanced RAG resources](https://docs.llamaindex.ai/)
- [Sentence Transformers](https://www.sbert.net/) for embeddings and rerankers.

## Required experiment

1. State a baseline failure or constraint.
2. Predict which advanced technique will improve which metric.
3. Freeze the eval set and acceptance thresholds.
4. Implement the smallest experiment.
5. Report quality, latency, cost, operational complexity, and new risks.
6. Keep the change only if the overall trade-off is worthwhile.

## Capstone studio

Scope one user, one workflow, one primary outcome, and one consequential risk. Build the narrow end-to-end path first, then add complexity only when an eval failure justifies it. Use four milestones:

1. **Baseline and contract:** current process, eligible population, target outcome, data access, and system boundary.
2. **Walking skeleton:** input to typed/guarded outcome with persistent state, trace, and a human path.
3. **Release evidence:** representative evals, threat model, privacy/data register, cost/latency envelope, deployment, rollback, and incident rehearsal.
4. **Pilot decision:** adoption and outcome evidence leading to stop, redesign, continue, or scale.

The final defense must include a real failure trace, a regression caught by the eval gate, one rejected architecture or model option, the strongest remaining limitation, and the evidence another team would need before broader rollout. Use [the capstone brief and rubric](../CAPSTONE.md) as the acceptance contract.

## Expert continuation

- Complete Stanford CS336 assignments for model systems depth.
- Contribute an eval, connector, documentation fix, or bug reproduction to an open-source AI project.
- Reproduce one recent paper on a small benchmark.
- Lead a real pilot through security review, user adoption, incident rehearsal, and post-launch evaluation.
- Teach a module; the ability to explain trade-offs clearly is an expert skill.
