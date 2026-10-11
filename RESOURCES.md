# Free resource library

**Checked:** 18 July 2026

**Selection rule:** Prefer primary documentation, university/open-source courses, original papers, and instruction from the teams that built the technology. “Free” means the learning material can be accessed without payment; certificates, hosted compute, or API usage may cost money.

This is a menu, not a second syllabus. For each module, use the required resources in its guide, then select one alternative when a concept does not click. Consuming every link would delay building.

## Best complete courses

| Level | Resource | Format | Why use it |
|---|---|---|---|
| Beginner | [CS50 Python](https://cs50.harvard.edu/python/) | video, notes, problems | rigorous programming start with no prerequisite |
| Beginner | [Google ML Crash Course](https://developers.google.com/machine-learning/crash-course) | video, visualizations, exercises | compact modern ML foundation |
| Beginner–intermediate | [Kaggle Learn](https://www.kaggle.com/learn) | interactive notebooks | fast practice in Python, pandas, SQL, ML, cleaning, and explainability |
| Intermediate | [fast.ai Practical Deep Learning](https://course.fast.ai/) | video, free book, notebooks | build useful deep-learning systems early |
| Intermediate | [Hugging Face LLM Course](https://huggingface.co/learn/llm-course/chapter1/1) | lessons, video, code | transformers, tokenizers, datasets, fine-tuning, and modern NLP |
| Intermediate | [Full Stack Deep Learning](https://fullstackdeeplearning.com/) | video, labs, slides | AI product lifecycle and production engineering |
| Intermediate | [DeepLearning.AI RAG](https://www.deeplearning.ai/courses/retrieval-augmented-generation-rag/) | video, readings, assignments | focused, production-oriented RAG sequence |
| Intermediate–advanced | [Hugging Face Agents Course](https://huggingface.co/learn/agents-course/en/unit0/introduction) | lessons, video, assignments | tools, frameworks, agentic RAG, evals, and final project |
| Intermediate–advanced | [LangChain Academy](https://academy.langchain.com/) | video, code, projects | free LangGraph and LangSmith courses; use after primitives |
| Advanced | [Stanford CS336](https://cs336.stanford.edu/) | lectures, code, assignments | language modeling from tokenizer through training systems and alignment |
| Advanced | [MIT OCW Deep Learning](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/) | lecture videos, notes, problems | university-level deep-learning depth |

## Video-first learning

- [Andrej Karpathy: Neural Networks: Zero to Hero](https://karpathy.ai/zero-to-hero.html) links the complete video sequence for micrograd, makemore, GPT, and tokenization.
- [3Blue1Brown: Neural Networks](https://www.3blue1brown.com/topics/neural-networks) contains exceptional visual videos on neural nets, LLMs, transformers, and attention.
- [Stanford CS336](https://cs336.stanford.edu/) links its official YouTube recordings and implementation material.
- [Full Stack Deep Learning](https://fullstackdeeplearning.com/) publishes its course and LLM Bootcamp recordings free.
- [fast.ai](https://course.fast.ai/) pairs each lesson with a long-form lecture and notebook.
- [MIT OpenCourseWare Deep Learning](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/) supplies downloadable lecture video and transcripts.
- [n8n learning resources](https://support.n8n.io/article/learning-resources) points to the official YouTube tutorials, beginner automation series, docs, and templates.
- [freeCodeCamp YouTube](https://www.youtube.com/@freecodecamp) has long-form Python, Git, SQL, APIs, Docker, and ML courses. Use it as a supplement; prefer current official docs for fast-changing AI frameworks.

## Software, data, and ML foundations

- [Official Python tutorial](https://docs.python.org/3/tutorial/): language reference path.
- [Automate the Boring Stuff with Python](https://automatetheboringstuff.com/): free online book focused on practical automation.
- [Pro Git](https://git-scm.com/book/en/v2): free official Git book.
- [GitHub Skills](https://skills.github.com/): interactive GitHub exercises.
- [MDN HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview): understand the protocol behind APIs.
- [FastAPI tutorial](https://fastapi.tiangolo.com/tutorial/): typed Python API course/reference.
- [SQLBolt](https://sqlbolt.com/) and [PostgreSQL tutorial](https://www.postgresql.org/docs/current/tutorial.html): interactive then production database foundations.
- [pandas getting started](https://pandas.pydata.org/docs/getting_started/index.html): tabular data.
- [scikit-learn user guide](https://scikit-learn.org/stable/user_guide.html): algorithms, preprocessing, selection, and metrics.
- [Mathematics for Machine Learning](https://mml-book.github.io/): free text for linear algebra, calculus, and probability.
- [StatQuest](https://statquest.org/video_index.html): intuitive statistics/ML video index.
- [PyTorch tutorials](https://pytorch.org/tutorials/): official deep-learning implementation guides.
- [Data Engineering Zoomcamp](https://github.com/DataTalksClub/data-engineering-zoomcamp): free, self-paced end-to-end course covering ingestion, orchestration, testing, batch, streaming, and a final project. Use it selectively; this course’s Module 2 emphasizes smaller local pipelines, lineage, and AI-data lifecycle.

## LLM concepts and original material

- [Attention Is All You Need](https://arxiv.org/abs/1706.03762): original Transformer paper.
- [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/): accessible visual bridge into the paper.
- [The Annotated Transformer](https://nlp.seas.harvard.edu/annotated-transformer/): paper plus working implementation.
- [The Illustrated GPT-2](https://jalammar.github.io/illustrated-gpt2/): decoder-only architecture.
- [Hugging Face Transformers docs](https://huggingface.co/docs/transformers/): official open-source model library.
- [Hugging Face Tokenizers docs](https://huggingface.co/docs/tokenizers/): production tokenization.
- [Sentence Transformers](https://www.sbert.net/): embeddings, semantic search, and rerankers.
- [Karpathy’s nanoGPT](https://github.com/karpathy/nanoGPT): compact GPT training reference.

## Model APIs, prompting, and context

- [OpenAI API documentation](https://developers.openai.com/api/docs/): official API and guides.
- [OpenAI Cookbook](https://cookbook.openai.com/): implementation examples; check publication/version dates.
- [Anthropic developer learning hub](https://www.anthropic.com/learn/build-with-claude): prompt engineering, tools, context, and API lessons.
- [Anthropic: Effective context engineering for agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents): managing context as a system.
- [Google Gemini API documentation](https://ai.google.dev/gemini-api/docs): multimodal models, structured outputs, tools, and embeddings.
- [Google tools guide](https://ai.google.dev/gemini-api/docs/tools): distinguishes final structured output from action/tool calling.
- [DeepLearning.AI short courses](https://www.deeplearning.ai/short-courses/): short guided courses taught with vendors/researchers; access terms can change.

Do not memorize a “perfect prompt formula.” Build a representative dataset, state the required behavior, use schemas/examples where helpful, and measure changes.

## Retrieval and knowledge systems

- [DeepLearning.AI RAG course](https://www.deeplearning.ai/courses/retrieval-augmented-generation-rag/): design, retrieval, vector databases, evaluation, and deployment.
- [LlamaIndex documentation](https://docs.llamaindex.ai/): data loading, indexing, querying, agents, and evaluation.
- [pgvector](https://github.com/pgvector/pgvector): vector similarity search in PostgreSQL.
- [FAISS](https://faiss.ai/): similarity search library and research documentation.
- [Elasticsearch vector search](https://www.elastic.co/docs/solutions/search/vector): hybrid production search concepts.
- [Google Cloud RAG architectures](https://docs.cloud.google.com/architecture/rag-reference-architectures): architecture patterns.
- [RAG original paper](https://arxiv.org/abs/2005.11401): provenance for the technique; modern systems extend it substantially.

## Agents, tools, and interoperability

- [Anthropic: Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents): simple workflow and agent patterns.
- [OpenAI: A Practical Guide to Building AI Agents](https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/): use-case, model, tools, instructions, orchestration, and guardrails.
- [Hugging Face Agents Course](https://huggingface.co/learn/agents-course/en/unit0/introduction): structured free curriculum.
- [LangGraph Academy course](https://academy.langchain.com/courses/intro-to-langgraph): state, memory, human-in-the-loop, and deployment.
- [Model Context Protocol documentation](https://modelcontextprotocol.io/docs/): official protocol concepts.
- [Build an MCP server](https://modelcontextprotocol.io/docs/develop/build-server): official Python/TypeScript/etc. tutorial.
- [Google Gemini function calling](https://ai.google.dev/gemini-api/docs/function-calling): clear tool-loop explanation and examples.

Frameworks are optional. First build a minimal tool loop in ordinary code so that state, permissions, retries, and stop conditions remain visible.

## Multimodal systems and AI product design

- [Hugging Face Tasks](https://huggingface.co/tasks): task-oriented starting points for document question answering, audio-text, image-text, visual retrieval, and other multimodal work.
- [People + AI Guidebook](https://pair.withgoogle.com/guidebook-v2/): actionable patterns, case studies, and workshop material for deciding where AI adds value, calibrating trust, giving users control, collecting feedback, and recovering from failure.
- [W3C Web Accessibility Initiative](https://www.w3.org/WAI/): primary accessibility guidance for text alternatives, captions, keyboard operation, adaptable structure, and inclusive interaction.

For media systems, evaluate perception and structure before language reasoning. For product design, test what users understand and do, not only whether they say the concept sounds useful.

## Workflow automation and business value

- [n8n Foundations](https://learn.n8n.io/programs/2a2aae4a-aebd-4366-993b-70eaf0024670/about): free self-paced path from first workflow to AI/testing/production.
- [n8n documentation](https://docs.n8n.io/): nodes, APIs, webhooks, error handling, credentials, scaling, and AI.
- [n8n workflow templates](https://n8n.io/workflows/): use as patterns, then threat-model and test before production.
- [n8n RAG learning page](https://n8n.io/rag/): tutorials and community examples; distinguish demos from validated production designs.
- [Zapier AI quick start](https://help.zapier.com/hc/en-us/articles/18590756459277-AI-quick-start-guide-in-Zapier): alternative managed automation platform.
- [Microsoft Learn: business value of generative AI](https://learn.microsoft.com/en-us/training/paths/explore-business-value-generative-ai-solutions/): free business-leader learning path.
- [OpenAI: Identifying and scaling AI use cases](https://openai.com/business/guides-and-resources/identifying-and-scaling-ai-use-cases/): use-case workshops and workflow examples.

## Evaluation, security, and responsible deployment

- [Anthropic: Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents): task, transcript/trajectory, grader, and harness design.
- [OpenAI evals guide](https://developers.openai.com/api/docs/guides/evals): evaluation datasets and graders.
- [promptfoo](https://www.promptfoo.dev/docs/intro/): open-source eval/red-team harness.
- [LangSmith evaluation concepts](https://docs.langchain.com/langsmith/evaluation-concepts): offline/online evaluation workflow.
- [OWASP GenAI Security Project](https://genai.owasp.org/): LLM and agentic security material.
- [OWASP Top 10 for LLM Applications 2025](https://genai.owasp.org/resource/owasp-top-10-for-llm-applications-2025/): primary threat overview.
- [OWASP LLM Security Verification Standard](https://owasp.org/www-project-llm-verification-standard/): controls and verification.
- [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework) and [GenAI Profile](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf): risk-management framework and actions.
- [MITRE ATLAS](https://atlas.mitre.org/): adversarial tactics and techniques.

## Production, serving, and operations

- [Google Cloud: Deploy and operate generative AI applications](https://docs.cloud.google.com/architecture/deploy-operate-generative-ai-applications): evaluation, versioning, logging, monitoring, and continuous evaluation.
- [Docker Get Started](https://docs.docker.com/get-started/): containers.
- [GitHub Actions](https://docs.github.com/en/actions/get-started/understand-github-actions): continuous integration/delivery.
- [OpenTelemetry](https://opentelemetry.io/docs/): vendor-neutral observability.
- [Ollama](https://docs.ollama.com/): accessible local model runtime.
- [vLLM](https://docs.vllm.ai/): high-throughput open-model serving.
- [Hugging Face Text Generation Inference](https://huggingface.co/docs/text-generation-inference/): production model serving.
- [Hugging Face PEFT](https://huggingface.co/docs/peft/): parameter-efficient fine-tuning.

## How to evaluate a new resource

Before adding a blog post or video, ask:

1. Is the author close to the underlying research/tool or demonstrating real measured work?
2. Is the publication/version date visible?
3. Does it teach a durable concept or only a fast-changing interface?
4. Are code, data, assumptions, and failures inspectable?
5. Does it distinguish a demo from a production claim?
6. Can a learner apply it in a lab and evaluate the result?
7. Is access genuinely free, and are certificate/API/compute costs disclosed?

Archive stale framework tutorials rather than allowing them to silently teach obsolete APIs.
