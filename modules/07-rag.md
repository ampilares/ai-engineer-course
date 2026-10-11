# Module 7: Retrieval-augmented generation

**Time:** 2 weeks

**Outcome:** Build a cited knowledge assistant and diagnose retrieval separately from generation.

## Learn

- Why RAG: changing/private knowledge, grounding, provenance, and access control.
- Ingestion: connectors, parsing, OCR, cleaning, chunking, metadata, deduplication, and freshness.
- Sparse/keyword, dense/embedding, and hybrid retrieval; vector similarity and indexes.
- Query rewriting, filters, multi-query, reranking, context packing, and parent-child retrieval.
- Citation design, abstention, structured-data retrieval, and when long context or SQL is better.
- Retrieval metrics (recall@k, precision@k, MRR/nDCG) versus answer metrics.
- Tenant isolation, document permissions, deletion, data lineage, and index updates.

## Core resources

- [DeepLearning.AI Retrieval-Augmented Generation course](https://www.deeplearning.ai/courses/retrieval-augmented-generation-rag/): end-to-end free learning path.
- [Hugging Face LLM Course](https://huggingface.co/learn/llm-course/chapter1/1): embeddings and transformer foundations.
- [LlamaIndex documentation](https://docs.llamaindex.ai/): ingestion, indexes, retrievers, evaluation, and advanced patterns.
- [pgvector](https://github.com/pgvector/pgvector): open-source vector search in PostgreSQL.
- [Google Cloud RAG reference architectures](https://docs.cloud.google.com/architecture/rag-reference-architectures): production architecture examples.

## Labs

1. Build a naive pipeline: parse → chunk → embed → retrieve → answer with citations.
2. Author 30 questions with expected source documents/chunks before tuning.
3. Compare two chunking strategies and keyword, dense, or hybrid retrieval.
4. Add metadata/permission filters and prove one user cannot retrieve another user’s documents.
5. Add reranking or query rewriting only if the baseline failure analysis justifies it.
6. Create “no evidence” cases and require abstention.

## Project acceptance

- every answer claim can be traced to displayed evidence;
- retrieval and answer scores are reported separately;
- access checks occur before context reaches the model;
- index freshness, update, and deletion behavior are documented;
- malformed/empty documents and missing evidence are handled;
- examples show where RAG fails and where SQL/full-document lookup is better.

## Common traps

Do not use vector search to enumerate exact records, assume PDF parsing is correct, evaluate only fluent answers, or trust citations merely because they look plausible.
