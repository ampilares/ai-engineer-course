# Setup

## Minimum computer setup

- Python 3.11 or newer
- Git and a GitHub account
- VS Code or another editor
- Docker Desktop or Docker Engine (recommended from Module 11; optional earlier)
- 8 GB RAM; 16 GB is more comfortable for local models

Windows learners can use PowerShell. WSL is optional, not required.

## Python environment

Learn to create one isolated environment per project. A typical course project uses:

- `httpx` for HTTP;
- `pydantic` for schemas and validation;
- `pytest` for tests;
- `pandas` or `polars` for tabular work;
- `scikit-learn` for classical ML;
- `torch`, `transformers`, and `datasets` for model work;
- `fastapi` and `uvicorn` for services;
- a provider SDK or an OpenAI-compatible HTTP client for hosted/local models.

Pin dependencies and never commit secrets. Keep API keys in environment variables or a secret manager and provide a `.env.example` containing names only.

## Free accounts and services

Create accounts only when their module needs them:

- GitHub for source control and CI;
- Kaggle or Google Colab for free notebooks/accelerators;
- Hugging Face for models, datasets, Spaces, and free courses;
- n8n Academy; run n8n locally when possible;
- one optional model provider account for API labs.

Every API lab must also support one of these substitutions:

1. a local model through [Ollama](https://docs.ollama.com/) or another OpenAI-compatible server;
2. a provider free tier;
3. recorded/fake responses for testing the surrounding application.

## Suggested repository structure for learner projects

    project/
      README.md
      pyproject.toml
      .env.example
      src/
      tests/
      evals/
        dataset.jsonl
        results/
      docs/
        architecture.md
        decisions.md
        threat-model.md
        runbook.md

## Ready check

Before Module 1, confirm that you can:

- clone a repository and create a branch;
- run a Python file and a notebook;
- install a package into an isolated environment;
- run a test;
- send an HTTP request to a public API;
- identify where secrets belong and verify they are ignored by Git.

Do not delay the course to perfect the environment. Use Colab/Kaggle for model labs and return to local setup when building services.
