# Module 5: How large language models work

**Time:** 2 weeks

**Outcome:** Explain and implement the main components of an autoregressive transformer at small scale.

## Learn

- Language modeling as next-token prediction; tokenization and byte-pair encoding.
- Token embeddings, positional information, self-attention, causal masking, multi-head attention, MLP blocks, residual paths, normalization, and logits.
- Pretraining data and objectives; scaling laws and compute/data/model trade-offs.
- Inference: sampling, temperature, top-p/top-k, KV cache, context windows, quantization, and batching.
- Post-training: supervised fine-tuning, preference optimization/RLHF, instruction following, and safety training.
- Hallucination, bias, memorization, benchmark limits, and why fluency is not verification.

## Core resources

- [3Blue1Brown: neural networks and transformers](https://www.3blue1brown.com/topics/neural-networks): start with LLMs and attention.
- [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/): visual walkthrough.
- [Hugging Face LLM Course](https://huggingface.co/learn/llm-course/chapter1/1): free transformers/NLP course.
- [Karpathy: Neural Networks Zero to Hero](https://karpathy.ai/zero-to-hero.html): makemore, GPT, and tokenizer builds.
- [Attention Is All You Need](https://arxiv.org/abs/1706.03762): landmark paper; read after the visual explanations.
- [Stanford CS336: Language Modeling from Scratch](https://cs336.stanford.edu/): expert route with lectures and implementation-heavy assignments.

## Labs

1. Compare tokenization of code, prose, numbers, and multiple languages; estimate input cost.
2. Calculate a tiny single-head attention example and visualize its attention weights.
3. Build a character/subword language model or follow a small GPT implementation.
4. Change temperature and sampling settings on a fixed prompt; quantify diversity and error.
5. Write a one-page explanation from raw text to next-token probabilities.

## Project acceptance

- the learner distinguishes parameters, tokens, embeddings, and context;
- transformer components and tensor shapes are explainable;
- generation is described as probabilistic decoding, not database lookup;
- pretraining, post-training, prompting, RAG, and fine-tuning are not conflated;
- limitations connect to application controls used later.

## Expert route

Complete CS336 Assignment 1 or an equivalent tokenizer + transformer + optimizer implementation. The goal is systems understanding, not training a large model.
