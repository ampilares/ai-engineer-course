// One-shot: append new questions to existing pools and raise examCount to 10
// where the pool supports it. Safe to re-run (skips ids that already exist).
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const NEW = {
  "agents-and-tools": [
    {
      "id": "at-x01",
      "type": "single",
      "prompt": "A 40-step agent drags its full raw transcript into every call. The context-engineering fix is…",
      "options": [
        {
          "id": "a",
          "text": "…maintain explicit working state (goal, facts established, actions taken, pending) and feed that forward: compressing noise while keeping signal"
        },
        {
          "id": "b",
          "text": "…a model with a bigger window, forever"
        },
        {
          "id": "c",
          "text": "…deleting all history each step"
        },
        {
          "id": "d",
          "text": "…raising temperature to improve focus"
        }
      ],
      "answer": "a",
      "explanation": "Transcript is mostly noise; state is signal. Structured state fixes cost, the lost-in-the-middle effect, and drift simultaneously."
    },
    {
      "id": "at-x02",
      "type": "single",
      "prompt": "After summarization, an agent recalls a customer's account number from its own summary. Before a consequential action it must…",
      "options": [
        {
          "id": "a",
          "text": "…re-fetch the exact identifier from the system of record: summaries are lossy model output, and paraphrased identifiers are corrupted identifiers"
        },
        {
          "id": "b",
          "text": "…proceed; summaries are memory"
        },
        {
          "id": "c",
          "text": "…ask the model to double-check itself"
        },
        {
          "id": "d",
          "text": "…lower the temperature and re-summarize"
        }
      ],
      "answer": "a",
      "explanation": "Verify-before-act for exacts: identifiers survive verbatim or get re-read from durable storage. A summary's confidence is not provenance."
    },
    {
      "id": "at-x03",
      "type": "single",
      "prompt": "Cross-session 'memory' (assistant remembers user preferences weeks later) is correctly built as…",
      "options": [
        {
          "id": "a",
          "text": "…durable facts stored outside the context (database/vector store), retrieved by relevance per request: RAG pointed at your own history"
        },
        {
          "id": "b",
          "text": "…an infinitely growing context window"
        },
        {
          "id": "c",
          "text": "…fine-tuning the model nightly per user"
        },
        {
          "id": "d",
          "text": "…browser cookies containing the transcript"
        }
      ],
      "answer": "a",
      "explanation": "Nothing persists in the window between sessions. Store outside, retrieve relevantly: same primitive as document RAG, different corpus."
    },
    {
      "id": "at-x04",
      "type": "single",
      "prompt": "Rolling summarization should preserve which content classes verbatim or near-verbatim?",
      "options": [
        {
          "id": "a",
          "text": "Commitments/constraints and exact identifiers (order numbers, emails, amounts), while used-up retrieval chunks and verbose tool payloads can die"
        },
        {
          "id": "b",
          "text": "Greetings and pleasantries"
        },
        {
          "id": "c",
          "text": "Everything equally, compressed uniformly"
        },
        {
          "id": "d",
          "text": "Nothing; a summary can safely omit exact facts and commitments"
        }
      ],
      "answer": "a",
      "explanation": "Compression is a design decision about what the system may never recall again. Facts that gate future actions survive; ambient noise doesn't."
    },
    {
      "id": "at-x05",
      "type": "single",
      "prompt": "Orchestrator–workers beats a free-form multi-agent 'discussion' when…",
      "options": [
        {
          "id": "a",
          "text": "…the task decomposes into independent sub-tasks with a mechanical integration step: each worker gets a small clean context; a discussion adds lossy handoffs with no structural payoff"
        },
        {
          "id": "b",
          "text": "…the task is a single lookup"
        },
        {
          "id": "c",
          "text": "…never; discussions are strictly superior"
        },
        {
          "id": "d",
          "text": "…the org chart says so"
        }
      ],
      "answer": "a",
      "explanation": "Multi-agent structure should mirror task structure. Parallel independent research fits orchestrator-workers exactly; committees mostly perform meetings in tokens."
    },
    {
      "id": "at-x06",
      "type": "single",
      "prompt": "Your 4-agent ensemble scores 84% vs. 82% for a single well-context-engineered agent at a third of the cost. Ship…",
      "options": [
        {
          "id": "a",
          "text": "…the single agent: complexity must clear a margin, not a tie: the two points don't pay for 3× cost, new failure surfaces, and harder debugging"
        },
        {
          "id": "b",
          "text": "…the ensemble; higher number wins"
        },
        {
          "id": "c",
          "text": "…both in parallel, doubling cost again"
        },
        {
          "id": "d",
          "text": "…neither; go back to rules"
        }
      ],
      "answer": "a",
      "explanation": "The baseline discipline from Module 5, applied to architecture: permanent complexity cost demands decisive, not marginal, wins."
    },
    {
      "id": "at-x07",
      "type": "single",
      "prompt": "In a multi-agent system, least privilege and budgets apply…",
      "options": [
        {
          "id": "a",
          "text": "…per worker AND to the whole: each agent gets only its task's tools, and the system has global caps on depth, workers, and spend: an orchestrator that spawns workers spawns costs"
        },
        {
          "id": "b",
          "text": "…only to the orchestrator"
        },
        {
          "id": "c",
          "text": "…only to workers with write tools"
        },
        {
          "id": "d",
          "text": "…not at all; bounds are single-agent concepts"
        }
      ],
      "answer": "a",
      "explanation": "Every single-agent wall persists per agent, plus new global ones. And one correlated trace for the ensemble, or debugging becomes archaeology."
    },
    {
      "id": "at-x08",
      "type": "single",
      "prompt": "The generator–critic pattern works economically because…",
      "options": [
        {
          "id": "a",
          "text": "…evaluating output against a rubric is easier (and cheaper) than generating it: the critic catches what the generator's momentum missed, like an inline LLM-as-judge"
        },
        {
          "id": "b",
          "text": "…adding a second model automatically removes correlated errors"
        },
        {
          "id": "c",
          "text": "…critics never err"
        },
        {
          "id": "d",
          "text": "…it eliminates the need for evals"
        }
      ],
      "answer": "a",
      "explanation": "Asymmetry of verification: checking is cheaper than producing. The same asymmetry powers LLM-as-judge (Module 14): this is that pattern moved inline."
    }
  ],
  "ai-product-engineering": [
    {
      "id": "pe-x01",
      "type": "single",
      "prompt": "Shadow mode (processing real inputs without showing outputs) can establish…",
      "options": [
        {
          "id": "a",
          "text": "…integration behavior, latency, traffic mix, and model-decision distributions, but not user behavior, since users never see the output"
        },
        {
          "id": "b",
          "text": "…long-term adoption with certainty"
        },
        {
          "id": "c",
          "text": "…that approvals work under real responsibility"
        },
        {
          "id": "d",
          "text": "…nothing useful"
        }
      ],
      "answer": "a",
      "explanation": "Shadow gives production-shaped technical evidence risk-free. The human questions (trust, adoption, workflow fit) need exposure stages that follow."
    },
    {
      "id": "pe-x02",
      "type": "single",
      "prompt": "A pilot needs predefined stop conditions because…",
      "options": [
        {
          "id": "a",
          "text": "…without them, sunk cost declares failures successes and one anecdote kills successes: stop rules are pre-registered honesty, like eval criteria"
        },
        {
          "id": "b",
          "text": "…pilots are illegal without them"
        },
        {
          "id": "c",
          "text": "…they make pilots shorter"
        },
        {
          "id": "d",
          "text": "…predefined stop conditions guarantee that the primary outcome will improve"
        }
      ],
      "answer": "a",
      "explanation": "Deciding what failure looks like before seeing results is the product-scale version of not tuning on the test set."
    },
    {
      "id": "pe-x03",
      "type": "single",
      "prompt": "Why randomize an A/B experiment by team or user rather than by request?",
      "options": [
        {
          "id": "a",
          "text": "…a person using both variants learns from each: contaminating the comparison; the randomization unit must contain the learning effects"
        },
        {
          "id": "b",
          "text": "…request-level randomization is computationally hard"
        },
        {
          "id": "c",
          "text": "…teams prefer being units"
        },
        {
          "id": "d",
          "text": "…the math only works for teams"
        }
      ],
      "answer": "a",
      "explanation": "Contamination blurs effects. Choose units that isolate exposure, and predefine outcome, guardrails, and duration before peeking."
    },
    {
      "id": "pe-x04",
      "type": "single",
      "prompt": "Alongside the primary metric, experiments carry guardrail metrics to catch…",
      "options": [
        {
          "id": "a",
          "text": "…wins that secretly cost too much elsewhere: throughput up while error rate, escalations, or downstream rework quietly climb"
        },
        {
          "id": "b",
          "text": "…nothing; one metric is cleaner"
        },
        {
          "id": "c",
          "text": "…slow dashboards"
        },
        {
          "id": "d",
          "text": "…jealous stakeholders"
        }
      ],
      "answer": "a",
      "explanation": "A metric can improve while the system worsens (the course's oldest warning). Guardrail metrics track outcomes that the primary metric does not protect."
    },
    {
      "id": "pe-x05",
      "type": "single",
      "prompt": "Adoption analysis found users silently overriding 40% of AI suggestions. This most likely signals…",
      "options": [
        {
          "id": "a",
          "text": "…rational rejection of quality or fit: interview the overriders and inspect their cases before concluding 'training problem'"
        },
        {
          "id": "b",
          "text": "…users are wrong and need mandates"
        },
        {
          "id": "c",
          "text": "…a UI color issue"
        },
        {
          "id": "d",
          "text": "…nothing; overrides are noise"
        }
      ],
      "answer": "a",
      "explanation": "Overrides are the richest feedback stream in the system: each one is a labeled disagreement. Users are usually responding to something real."
    },
    {
      "id": "pe-x06",
      "type": "single",
      "prompt": "Build-versus-buy for an AI capability should weigh…",
      "options": [
        {
          "id": "a",
          "text": "…differentiation (is this your product's core judgment?), data sensitivity, integration depth, and total ownership cost: buying commodity capability, building differentiating workflow"
        },
        {
          "id": "b",
          "text": "…only the sticker price"
        },
        {
          "id": "c",
          "text": "…whichever option demos faster"
        },
        {
          "id": "d",
          "text": "…always build, for pride"
        }
      ],
      "answer": "a",
      "explanation": "OCR and transcription are commodities; your domain's judgment layer and evals are differentiation. Spend build-effort where moats form."
    },
    {
      "id": "pe-x07",
      "type": "single",
      "prompt": "Good AI-product UX for uncertain outputs includes…",
      "options": [
        {
          "id": "a",
          "text": "…visible confidence/evidence, one-tap correction, and human control over consequential steps: designing FOR uncertainty rather than hiding it"
        },
        {
          "id": "b",
          "text": "…hiding uncertainty so users trust the system"
        },
        {
          "id": "c",
          "text": "…disclaimers in 6-point font"
        },
        {
          "id": "d",
          "text": "…removing all human controls for speed"
        }
      ],
      "answer": "a",
      "explanation": "Trust comes from calibrated presentation and recoverability, not from performed confidence. Corrections double as your feedback loop."
    },
    {
      "id": "pe-x08",
      "type": "single",
      "prompt": "Defining sunset criteria for an AI feature at launch means…",
      "options": [
        {
          "id": "a",
          "text": "…agreeing in advance what usage/quality evidence justifies removal, so an unused or unsafe feature gets retired instead of defended for the launch narrative"
        },
        {
          "id": "b",
          "text": "…scheduling the feature's death date unconditionally"
        },
        {
          "id": "c",
          "text": "…nothing; features are forever"
        },
        {
          "id": "d",
          "text": "…planning the next press release"
        }
      ],
      "answer": "a",
      "explanation": "Portfolio honesty: removal is a legitimate outcome. Pre-agreed criteria make it a process decision, not a political battle."
    }
  ],
  "business-automation": [
    {
      "id": "ba-x01",
      "type": "single",
      "prompt": "Incoming webhooks should be verified (signature/secret) because…",
      "options": [
        {
          "id": "a",
          "text": "…your trigger URL is reachable by anyone: unverified, an attacker can inject fabricated events that your pipeline dutifully processes"
        },
        {
          "id": "b",
          "text": "…verification improves latency"
        },
        {
          "id": "c",
          "text": "…webhooks fail without it"
        },
        {
          "id": "d",
          "text": "…it's only needed for financial data"
        }
      ],
      "answer": "a",
      "explanation": "A webhook endpoint is an open door; the signature is the key check. Trigger authenticity is part of the trust boundary."
    },
    {
      "id": "ba-x02",
      "type": "single",
      "prompt": "The idempotency key for a workflow step is best composed of…",
      "options": [
        {
          "id": "a",
          "text": "…the event/record ID plus the step name, so each step of each item is dedupable independently, and a retried step 3 can't skip because step 2 already ran"
        },
        {
          "id": "b",
          "text": "…a fresh random UUID per attempt"
        },
        {
          "id": "c",
          "text": "…the current timestamp"
        },
        {
          "id": "d",
          "text": "…the worker's hostname"
        }
      ],
      "answer": "a",
      "explanation": "Keys must be deterministic per logical operation: same work → same key → deduped; different steps → different keys. Random keys defeat the whole purpose."
    },
    {
      "id": "ba-x03",
      "type": "single",
      "prompt": "'Automation rate' (share auto-processed) rose from 78% to 91% after loosening the confidence threshold. What must be checked before celebrating?",
      "options": [
        {
          "id": "a",
          "text": "The error rate among auto-processed items: throughput gains from a looser threshold may just be errors reclassified as successes"
        },
        {
          "id": "b",
          "text": "Nothing; higher automation is the goal"
        },
        {
          "id": "c",
          "text": "The dashboard's font size"
        },
        {
          "id": "d",
          "text": "Whether the queue is empty"
        }
      ],
      "answer": "a",
      "explanation": "The threshold trades review load against error rate (precision/recall in business clothing). Moving it changes BOTH numbers; report them together."
    },
    {
      "id": "ba-x04",
      "type": "single",
      "prompt": "A well-designed human review queue item contains…",
      "options": [
        {
          "id": "a",
          "text": "…the source document, the model's draft with confidence, the reason it routed here, and one-click approve/correct: everything needed to decide in seconds"
        },
        {
          "id": "b",
          "text": "…only the record ID, to avoid bias"
        },
        {
          "id": "c",
          "text": "…the entire database"
        },
        {
          "id": "d",
          "text": "…a blank form to re-enter from scratch"
        }
      ],
      "answer": "a",
      "explanation": "Review UX determines whether the queue is a 3-minute task or a 15-minute one, and corrections captured here feed the eval set."
    },
    {
      "id": "ba-x05",
      "type": "single",
      "prompt": "The manual fallback path should be rehearsed periodically because…",
      "options": [
        {
          "id": "a",
          "text": "…an unexercised fallback rots (people forget, credentials expire, volumes outgrow it), and you discover that during the outage, which is the worst time"
        },
        {
          "id": "b",
          "text": "…rehearsal is billable"
        },
        {
          "id": "c",
          "text": "…automation improves by watching"
        },
        {
          "id": "d",
          "text": "…a written runbook guarantees the fallback will work without rehearsal"
        }
      ],
      "answer": "a",
      "explanation": "A fallback is a capability, and capabilities decay without exercise: the same logic as incident game days (Module 16)."
    },
    {
      "id": "ba-x06",
      "type": "single",
      "prompt": "A growing exception/review queue with stable input volume is an early signal of…",
      "options": [
        {
          "id": "a",
          "text": "…drift: inputs are changing shape (new formats, segments) faster than the automation handles them: investigate the queue's contents as diagnostic data"
        },
        {
          "id": "b",
          "text": "…database storage approaching its capacity limit"
        },
        {
          "id": "c",
          "text": "…database fragmentation"
        },
        {
          "id": "d",
          "text": "…seasonal weather"
        }
      ],
      "answer": "a",
      "explanation": "The queue is a drift detector: what lands there is precisely what the system no longer handles. Its composition is a prioritized to-do list."
    },
    {
      "id": "ba-x07",
      "type": "single",
      "prompt": "Batch (nightly) versus realtime (webhook) triggering should be chosen by…",
      "options": [
        {
          "id": "a",
          "text": "…the business latency requirement: if decisions can wait hours, batch is simpler, cheaper, and easier to operate; realtime earns its complexity only when freshness pays"
        },
        {
          "id": "b",
          "text": "…the automation platform's default trigger mode"
        },
        {
          "id": "c",
          "text": "…batch always, for safety"
        },
        {
          "id": "d",
          "text": "…whichever the vendor demo showed"
        }
      ],
      "answer": "a",
      "explanation": "Latency requirements are business requirements. Overpaying for unneeded freshness is the infrastructure version of using a frontier model for classification."
    },
    {
      "id": "ba-x08",
      "type": "single",
      "prompt": "In n8n-style visual workflows, the error-workflow (a flow triggered by failures) exists to…",
      "options": [
        {
          "id": "a",
          "text": "…give failures a designed path (notify owners, record context, route to humans) instead of dying silently inside a node"
        },
        {
          "id": "b",
          "text": "…make diagrams symmetrical"
        },
        {
          "id": "c",
          "text": "…retry forever automatically"
        },
        {
          "id": "d",
          "text": "…replace testing"
        }
      ],
      "answer": "a",
      "explanation": "Same principle as code: failure paths are designed, not hoped away. Visual tools just make the design literal: a red wire to somewhere intentional."
    }
  ],
  "data-engineering": [
    {
      "id": "de-x01",
      "type": "single",
      "prompt": "A pipeline stage is 'idempotent' when…",
      "options": [
        {
          "id": "a",
          "text": "…running it twice with the same input produces the same final state as running it once: via deterministic keys and upserts or atomic partition replacement"
        },
        {
          "id": "b",
          "text": "…it never fails"
        },
        {
          "id": "c",
          "text": "…it runs on a schedule"
        },
        {
          "id": "d",
          "text": "…it processes one record at a time"
        }
      ],
      "answer": "a",
      "explanation": "Retries and replays are guaranteed in distributed systems; idempotency is what makes them harmless instead of duplicating data."
    },
    {
      "id": "de-x02",
      "type": "single",
      "prompt": "A dead-letter queue that nobody monitors is…",
      "options": [
        {
          "id": "a",
          "text": "…a slower way to lose data: quarantine only works when the queue has an owner, an alert, and a review workflow"
        },
        {
          "id": "b",
          "text": "…perfectly fine; the data is technically retained"
        },
        {
          "id": "c",
          "text": "…a performance optimization"
        },
        {
          "id": "d",
          "text": "…required by SQL standards"
        }
      ],
      "answer": "a",
      "explanation": "The DLQ is a promise that failures get human attention. Without an owner and a replay process, it becomes write-only storage while unresolved failures accumulate."
    },
    {
      "id": "de-x03",
      "type": "single",
      "prompt": "Why do backfills (historical recomputation) need isolated outputs and promotion checks?",
      "options": [
        {
          "id": "a",
          "text": "So recomputed history can be verified before replacing production data, and a buggy backfill can't clobber current good datasets"
        },
        {
          "id": "b",
          "text": "Because old data is legally different"
        },
        {
          "id": "c",
          "text": "To make backfills slower"
        },
        {
          "id": "d",
          "text": "They don't; backfills should write directly to production"
        }
      ],
      "answer": "a",
      "explanation": "A backfill is a mass-write with a bug's blast radius measured in months of data. Stage, verify, then promote: blue/green thinking applied to datasets."
    },
    {
      "id": "de-x04",
      "type": "single",
      "prompt": "A currency-conversion bug is found in last month's pipeline code. Lineage lets you…",
      "options": [
        {
          "id": "a",
          "text": "…enumerate exactly which dataset versions, models, reports, and decisions consumed the affected outputs: sizing the blast radius instead of guessing"
        },
        {
          "id": "b",
          "text": "…undo the bug automatically"
        },
        {
          "id": "c",
          "text": "…blame the right engineer"
        },
        {
          "id": "d",
          "text": "…avoid writing tests"
        }
      ],
      "answer": "a",
      "explanation": "Lineage answers 'who consumed this version?' Without it teams either underreact (miss poisoned consumers) or rebuild everything (weeks of waste)."
    },
    {
      "id": "de-x05",
      "type": "single",
      "prompt": "Inter-annotator agreement is measured during labeling because…",
      "options": [
        {
          "id": "a",
          "text": "…if trained humans disagree on labels, the label definition is ambiguous, and no model (or eval) built on those labels can be trusted beyond that ambiguity"
        },
        {
          "id": "b",
          "text": "…it speeds up labeling"
        },
        {
          "id": "c",
          "text": "…regulations require three annotators"
        },
        {
          "id": "d",
          "text": "…models require an odd number of labels"
        }
      ],
      "answer": "a",
      "explanation": "Label quality caps everything downstream. Low agreement means fix the guidelines, not average the noise."
    },
    {
      "id": "de-x06",
      "type": "single",
      "prompt": "Human corrections from a review queue are most valuable when routed into…",
      "options": [
        {
          "id": "a",
          "text": "…versioned datasets that feed evals (and eventually fine-tuning): turning operational work into permanent quality assets"
        },
        {
          "id": "b",
          "text": "…a spreadsheet nobody reads"
        },
        {
          "id": "c",
          "text": "…immediate automatic retraining without review"
        },
        {
          "id": "d",
          "text": "…deletion after 24 hours"
        }
      ],
      "answer": "a",
      "explanation": "Corrections are continuous ground truth. The feedback loop (capture, curate, evaluate) is what makes AI systems improve instead of merely run."
    },
    {
      "id": "de-x07",
      "type": "single",
      "prompt": "A user exercises their right to deletion. For your AI data platform this must propagate to…",
      "options": [
        {
          "id": "a",
          "text": "…source copies, derived datasets, indexes/embeddings, and caches, which requires knowing where the person's data flowed (lineage, again)"
        },
        {
          "id": "b",
          "text": "…only the original upload folder"
        },
        {
          "id": "c",
          "text": "…nothing; derived data is exempt"
        },
        {
          "id": "d",
          "text": "…the model's weights via retraining that night"
        }
      ],
      "answer": "a",
      "explanation": "Deletion is a data-flow problem: every derived copy is still their data. Designing for deletion up front beats forensic archaeology under a deadline."
    },
    {
      "id": "de-x08",
      "type": "single",
      "prompt": "An upstream team renames a column in the export your pipeline consumes. The defense that catches this at the boundary is…",
      "options": [
        {
          "id": "a",
          "text": "…a schema contract check that fails fast (or quarantines) on unexpected structure, alerting both teams: instead of nulls silently flowing downstream"
        },
        {
          "id": "b",
          "text": "…hoping the column name never mattered"
        },
        {
          "id": "c",
          "text": "…retrying the pipeline until the column returns"
        },
        {
          "id": "d",
          "text": "…a bigger database"
        }
      ],
      "answer": "a",
      "explanation": "Schema drift is a when, not an if. Contracts turn it into a loud, attributable event at the boundary rather than a quiet corruption in every consumer."
    }
  ],
  "deep-learning": [
    {
      "id": "dl-x01",
      "type": "single",
      "prompt": "An 'epoch' of training is…",
      "options": [
        {
          "id": "a",
          "text": "…one full pass over the training dataset, usually made of many mini-batch gradient steps"
        },
        {
          "id": "b",
          "text": "…one gradient update"
        },
        {
          "id": "c",
          "text": "…one prediction"
        },
        {
          "id": "d",
          "text": "…one hour of GPU time"
        }
      ],
      "answer": "a",
      "explanation": "Batches estimate gradients cheaply; an epoch is the bookkeeping unit of 'saw all the data once'. Models typically train for several epochs."
    },
    {
      "id": "dl-x02",
      "type": "single",
      "prompt": "With early stopping, which checkpoint do you ship?",
      "options": [
        {
          "id": "a",
          "text": "The one at the validation-loss minimum, not the final epoch, whose extra training bought only memorization"
        },
        {
          "id": "b",
          "text": "The last checkpoint, since more training is always better"
        },
        {
          "id": "c",
          "text": "The first checkpoint, since it's least overfit"
        },
        {
          "id": "d",
          "text": "A random checkpoint for fairness"
        }
      ],
      "answer": "a",
      "explanation": "After the validation minimum, train loss keeps improving while generalization worsens. The best-generalizing weights are the ones you save and serve."
    },
    {
      "id": "dl-x03",
      "type": "single",
      "prompt": "In transfer learning with a small dataset, why freeze most pretrained layers and train only the top?",
      "options": [
        {
          "id": "a",
          "text": "The early layers hold general features your data needn't relearn; freezing them prevents your small dataset from destroying them while you fit the task-specific head"
        },
        {
          "id": "b",
          "text": "Frozen layers use no memory"
        },
        {
          "id": "c",
          "text": "It makes the model smaller on disk"
        },
        {
          "id": "d",
          "text": "Freezing is required by GPU drivers"
        }
      ],
      "answer": "a",
      "explanation": "Small data can't re-earn general vision/language features but can easily wreck them (catastrophic forgetting). Freeze the general, tune the specific."
    },
    {
      "id": "dl-x04",
      "type": "single",
      "prompt": "Dropout randomly silences neurons during training. At inference time…",
      "options": [
        {
          "id": "a",
          "text": "…it is disabled: all neurons participate, and the network behaves deterministically"
        },
        {
          "id": "b",
          "text": "…it stays on, adding helpful randomness to predictions"
        },
        {
          "id": "c",
          "text": "…half the network is permanently deleted"
        },
        {
          "id": "d",
          "text": "…the model retrains itself"
        }
      ],
      "answer": "a",
      "explanation": "Dropout is a training-time regularizer that prevents co-dependent neurons. Serving uses the full ensemble-like network with dropout off."
    },
    {
      "id": "dl-x05",
      "type": "single",
      "prompt": "Both training and validation loss are high and flat. The remedy list starts with…",
      "options": [
        {
          "id": "a",
          "text": "…more capacity, better features/inputs, longer training, or a higher learning rate: this is underfitting, not overfitting"
        },
        {
          "id": "b",
          "text": "…more dropout and early stopping"
        },
        {
          "id": "c",
          "text": "…a smaller model"
        },
        {
          "id": "d",
          "text": "…deleting training data"
        }
      ],
      "answer": "a",
      "explanation": "Regularization treats the gap between curves; here there is no gap: the model can't even fit the training data. Diagnosis before treatment."
    },
    {
      "id": "dl-x06",
      "type": "single",
      "prompt": "Data augmentation (flips, crops, noise on images) combats overfitting by…",
      "options": [
        {
          "id": "a",
          "text": "…manufacturing label-preserving variations, effectively enlarging the dataset and teaching invariances the task should have"
        },
        {
          "id": "b",
          "text": "…making images prettier"
        },
        {
          "id": "c",
          "text": "…reducing the number of classes"
        },
        {
          "id": "d",
          "text": "…shrinking the model"
        }
      ],
      "answer": "a",
      "explanation": "A cat flipped is still a cat; the network learns that truth instead of memorizing exact pixels. More effective signal per labeled example."
    },
    {
      "id": "dl-x07",
      "type": "single",
      "prompt": "Choosing between two architectures should be decided by…",
      "options": [
        {
          "id": "a",
          "text": "…their validation-set performance (with the test set kept untouched for the final honest number)"
        },
        {
          "id": "b",
          "text": "…training-set performance"
        },
        {
          "id": "c",
          "text": "…which has more parameters"
        },
        {
          "id": "d",
          "text": "…test-set performance, checked repeatedly during development"
        }
      ],
      "answer": "a",
      "explanation": "Model selection is 'tuning': it spends the validation set, not the test set. Repeated test-set peeking silently overfits your choices to it."
    },
    {
      "id": "dl-x08",
      "type": "single",
      "prompt": "Mini-batches serve GPUs well because…",
      "options": [
        {
          "id": "a",
          "text": "…a batch's examples are processed in parallel as one large matrix operation: utilizing thousands of cores per step while keeping gradient estimates cheap"
        },
        {
          "id": "b",
          "text": "…small batches use more memory"
        },
        {
          "id": "c",
          "text": "…GPUs cannot process single examples"
        },
        {
          "id": "d",
          "text": "…batches eliminate the need for gradients"
        }
      ],
      "answer": "a",
      "explanation": "Batching converts many small computations into few large matrix multiplies: the shape GPUs are built for. Batch size trades memory, speed, and gradient noise."
    }
  ],
  "engineering-foundations": [
    {
      "id": "ef-x01",
      "type": "single",
      "prompt": "In REST semantics, why should a data-fetching endpoint use GET rather than POST?",
      "options": [
        {
          "id": "a",
          "text": "GET declares the request safe and repeatable (cacheable, retryable, and bookmarkable) while POST signals a state change"
        },
        {
          "id": "b",
          "text": "GET is faster on all networks"
        },
        {
          "id": "c",
          "text": "POST cannot return JSON"
        },
        {
          "id": "d",
          "text": "There is no difference"
        }
      ],
      "answer": "a",
      "explanation": "Verbs carry contracts: intermediaries and clients treat GET as side-effect-free. Fetching via POST forfeits caching and safe retries; mutating via GET invites disaster from prefetchers."
    },
    {
      "id": "ef-x02",
      "type": "single",
      "prompt": "An API returns results in pages of 100. Your job processed page 1 and stopped. The subtle bug class this represents is…",
      "options": [
        {
          "id": "a",
          "text": "silent partial ingestion: always follow pagination (next tokens/links) to completion and reconcile expected vs. received counts"
        },
        {
          "id": "b",
          "text": "rate limiting"
        },
        {
          "id": "c",
          "text": "a JSON syntax error"
        },
        {
          "id": "d",
          "text": "an authentication failure"
        }
      ],
      "answer": "a",
      "explanation": "Nothing errored: you just quietly got 100 of 4,000 records. Pagination handling plus count reconciliation catches what status codes can't."
    },
    {
      "id": "ef-x03",
      "type": "single",
      "prompt": "A PRIMARY KEY (or UNIQUE constraint) on orders.order_id primarily buys you…",
      "options": [
        {
          "id": "a",
          "text": "…database-enforced integrity: duplicates become impossible to insert, making the table safe to upsert against"
        },
        {
          "id": "b",
          "text": "…alphabetical ordering of rows"
        },
        {
          "id": "c",
          "text": "…automatic backups"
        },
        {
          "id": "d",
          "text": "…smaller file size"
        }
      ],
      "answer": "a",
      "explanation": "Constraints move correctness from 'code remembers to check' to 'storage refuses to be wrong': the foundation idempotent pipelines build on."
    },
    {
      "id": "ef-x04",
      "type": "single",
      "prompt": "Why do small, well-described commits beat one giant 'initial commit'?",
      "options": [
        {
          "id": "a",
          "text": "History becomes searchable and reviewable: 'what changed and why' has an answer per change, which is what debugging and code review consume"
        },
        {
          "id": "b",
          "text": "Git charges per commit size"
        },
        {
          "id": "c",
          "text": "Large commits corrupt repositories"
        },
        {
          "id": "d",
          "text": "It only matters for open source"
        }
      ],
      "answer": "a",
      "explanation": "Version control's value is the story it records. One blob commit records nothing, and reviewers (human or AI) can only review what's legible."
    },
    {
      "id": "ef-x05",
      "type": "single",
      "prompt": "Configuration like API keys belongs in environment variables (or a secret store) rather than code because…",
      "options": [
        {
          "id": "a",
          "text": "…code is shared, versioned, and long-lived while secrets must stay private and rotatable: mixing them leaks keys into Git history forever"
        },
        {
          "id": "b",
          "text": "…environment variables execute faster"
        },
        {
          "id": "c",
          "text": "…code files cannot contain strings"
        },
        {
          "id": "d",
          "text": "…it makes deployment harder, which is safer"
        }
      ],
      "answer": "a",
      "explanation": "The .env-plus-gitignore pattern separates what ships from what authenticates. Git history is effectively permanent: a committed key is a compromised key."
    },
    {
      "id": "ef-x06",
      "type": "single",
      "prompt": "Your ETL script hits a record with malformed JSON in one field. Production-grade handling is to…",
      "options": [
        {
          "id": "a",
          "text": "…catch the parse error for that record, quarantine it with context for review, count it, and continue the batch"
        },
        {
          "id": "b",
          "text": "…crash the whole batch to be safe"
        },
        {
          "id": "c",
          "text": "…silently skip it with no trace"
        },
        {
          "id": "d",
          "text": "…guess the intended value"
        }
      ],
      "answer": "a",
      "explanation": "Per-record isolation + quarantine + visibility: the batch completes, the bad record is reviewable, and the failure rate is measurable. Crash-everything and silent-skip both destroy information."
    }
  ],
  "evaluation": [
    {
      "id": "ev-x01",
      "type": "single",
      "prompt": "In pairwise A/B judging, why must the order of the two candidates be randomized per comparison?",
      "options": [
        {
          "id": "a",
          "text": "LLM judges show position bias (favoring one slot); randomization prevents the bias from systematically inflating one system"
        },
        {
          "id": "b",
          "text": "Alphabetical order is unfair to system Z"
        },
        {
          "id": "c",
          "text": "It makes judging faster"
        },
        {
          "id": "d",
          "text": "Order doesn't matter to models"
        }
      ],
      "answer": "a",
      "explanation": "Known judge biases (position, length, self-family preference) get engineering mitigations: randomize order, grade criteria separately, calibrate against humans."
    },
    {
      "id": "ev-x02",
      "type": "single",
      "prompt": "The economic argument for exhausting code-check graders before LLM judges is…",
      "options": [
        {
          "id": "a",
          "text": "…code checks are free, deterministic, and run on every commit: spending judge tokens on what a regex could verify wastes money and adds noise"
        },
        {
          "id": "b",
          "text": "…LLM judges are illegal in CI"
        },
        {
          "id": "c",
          "text": "…code checks are more prestigious"
        },
        {
          "id": "d",
          "text": "…there is no argument; always use judges"
        }
      ],
      "answer": "a",
      "explanation": "Cheapest sufficient instrument, always: schema validity, citation presence, forbidden content, and length are deterministic questions with deterministic answers."
    },
    {
      "id": "ev-x03",
      "type": "single",
      "prompt": "A sensible release-gate policy for evals is…",
      "options": [
        {
          "id": "a",
          "text": "…block on regressions in critical criteria (faithfulness, safety, abstention); allow judgment calls on minor aggregate movements, with the failure list reviewed either way"
        },
        {
          "id": "b",
          "text": "…block on any metric moving at all"
        },
        {
          "id": "c",
          "text": "…never block; evals are advisory"
        },
        {
          "id": "d",
          "text": "…block only on Fridays"
        }
      ],
      "answer": "a",
      "explanation": "Gates need teeth where harm lives and flexibility where noise lives. Criteria-level gating (not one average) is what makes that possible."
    },
    {
      "id": "ev-x04",
      "type": "single",
      "prompt": "Traces must be redacted before storage because…",
      "options": [
        {
          "id": "a",
          "text": "…they capture full prompts and outputs (including personal data and secrets) making the observability store itself a breach surface and retention liability"
        },
        {
          "id": "b",
          "text": "…raw traces are too large to store"
        },
        {
          "id": "c",
          "text": "…redaction improves search speed"
        },
        {
          "id": "d",
          "text": "…they mustn't be; full fidelity always wins"
        }
      ],
      "answer": "a",
      "explanation": "Observability and privacy collide in traces. Redact secrets and unneeded PII at capture; you cannot leak what you didn't keep (Module 15)."
    },
    {
      "id": "ev-x05",
      "type": "single",
      "prompt": "Offline evals and canary deployments are complementary because…",
      "options": [
        {
          "id": "a",
          "text": "…evals catch anticipated failure classes pre-release; the canary catches the unanticipated in production with a small blast radius: neither substitutes for the other"
        },
        {
          "id": "b",
          "text": "…they are identical techniques"
        },
        {
          "id": "c",
          "text": "…canaries make evals unnecessary"
        },
        {
          "id": "d",
          "text": "…evals make canaries unnecessary"
        }
      ],
      "answer": "a",
      "explanation": "Two nets at different heights: known-unknowns offline, unknown-unknowns online-but-bounded. Mature teams run both on every meaningful change."
    },
    {
      "id": "ev-x06",
      "type": "single",
      "prompt": "Why version eval datasets like code?",
      "options": [
        {
          "id": "a",
          "text": "Scores are only comparable against the same dataset version: an 87% on today's set versus 85% on last month's set is not an improvement claim, and audits need to reconstruct exactly what was measured"
        },
        {
          "id": "b",
          "text": "Git compresses JSON well"
        },
        {
          "id": "c",
          "text": "Datasets are too small to matter"
        },
        {
          "id": "d",
          "text": "To prevent anyone from adding cases"
        }
      ],
      "answer": "a",
      "explanation": "The dataset is half the measurement instrument. Version it, and note which version every reported score came from, or comparisons are apples to oranges."
    },
    {
      "id": "ev-x07",
      "type": "single",
      "prompt": "Human corrections from production review queues are the richest quality signal because…",
      "options": [
        {
          "id": "a",
          "text": "…they are continuous, labeled, real-traffic ground truth: every correction is a solved failure case ready to become an eval example"
        },
        {
          "id": "b",
          "text": "…they're cheaper than logging"
        },
        {
          "id": "c",
          "text": "…they arrive pre-anonymized"
        },
        {
          "id": "d",
          "text": "…humans are always right"
        }
      ],
      "answer": "a",
      "explanation": "The review queue is an eval-data factory. Systems that harvest it improve continuously; systems that discard it re-learn failures the hard way."
    },
    {
      "id": "ev-x08",
      "type": "single",
      "prompt": "A judge scores answers 'helpful: 8.7/10' on average. What's the methodological weakness?",
      "options": [
        {
          "id": "a",
          "text": "Fine-grained scalar scales are noisy and drift-prone for LLM judges; binary or 3-point criteria-specific judgments calibrate better against humans and produce actionable failures"
        },
        {
          "id": "b",
          "text": "8.7 is too low to report"
        },
        {
          "id": "c",
          "text": "Helpfulness cannot be judged at all"
        },
        {
          "id": "d",
          "text": "The average should be a median"
        }
      ],
      "answer": "a",
      "explanation": "Ask judges narrow, checkable questions such as 'does the answer cite a source for the refund claim?' instead of requesting a broad subjective score. Precise questions produce more interpretable measurements."
    }
  ],
  "expert-topics": [
    {
      "id": "et-x01",
      "type": "single",
      "prompt": "Distillation (training a small model on a large model's outputs) is attractive when…",
      "options": [
        {
          "id": "a",
          "text": "…a narrow task needs the big model's quality at small-model cost/latency: the student learns the specific behavior without the teacher's breadth"
        },
        {
          "id": "b",
          "text": "…you want the small model to gain general intelligence"
        },
        {
          "id": "c",
          "text": "…you have no eval set"
        },
        {
          "id": "d",
          "text": "…never; distillation is obsolete"
        }
      ],
      "answer": "a",
      "explanation": "A teacher-labeled dataset for one job transfers that job. Validate the student on YOUR evals; expect the narrow win, not general parity."
    },
    {
      "id": "et-x02",
      "type": "single",
      "prompt": "Synthetic training data (generated by a model) carries which core caution?",
      "options": [
        {
          "id": "a",
          "text": "It inherits the generator's blind spots and can't be the sole evidence of real-world performance: real, held-out data must anchor evaluation"
        },
        {
          "id": "b",
          "text": "It is illegal in most countries"
        },
        {
          "id": "c",
          "text": "It is always superior to human data"
        },
        {
          "id": "d",
          "text": "It cannot be stored in JSON"
        }
      ],
      "answer": "a",
      "explanation": "Synthetic data expands coverage cheaply but circularly. The test set that decides anything must come from reality."
    },
    {
      "id": "et-x03",
      "type": "single",
      "prompt": "For fine-tuning, you split train/validation/test by distinct entities or time periods (not random rows) because…",
      "options": [
        {
          "id": "a",
          "text": "…near-duplicate rows from the same entity landing in both train and test inflate scores: the leakage lessons of Module 5 apply fully to adaptation data"
        },
        {
          "id": "b",
          "text": "…random splits are computationally expensive"
        },
        {
          "id": "c",
          "text": "…entities have legal rights to one split"
        },
        {
          "id": "d",
          "text": "…it doesn't matter for fine-tuning"
        }
      ],
      "answer": "a",
      "explanation": "Same customer's ten similar invoices across splits = memorization measured as skill. Split on the axis of real-world generalization."
    },
    {
      "id": "et-x04",
      "type": "single",
      "prompt": "Quantization's accuracy cost shows up MOST in…",
      "options": [
        {
          "id": "a",
          "text": "…tasks sensitive to small numerical distinctions and less-represented languages, which is why you re-run YOUR evals on the quantized model, not trust generic benchmarks"
        },
        {
          "id": "b",
          "text": "…file download speed"
        },
        {
          "id": "c",
          "text": "…the model's vocabulary size"
        },
        {
          "id": "d",
          "text": "…nothing; quantization is lossless"
        }
      ],
      "answer": "a",
      "explanation": "Precision loss is uneven across capabilities. The decision instrument is your task's eval before/after: the module's recurring answer."
    },
    {
      "id": "et-x05",
      "type": "single",
      "prompt": "Self-hosting adds which operational jobs that hosted APIs hide?",
      "options": [
        {
          "id": "a",
          "text": "Capacity planning, batching/throughput tuning, warm-up, hardware utilization, model provenance verification, and security patching: the platform team you become"
        },
        {
          "id": "b",
          "text": "None; local models run themselves"
        },
        {
          "id": "c",
          "text": "Only electricity bills"
        },
        {
          "id": "d",
          "text": "Prompt writing"
        }
      ],
      "answer": "a",
      "explanation": "The API fee was buying operations. Self-hosting's TCO includes the engineering time that replaces it: count it before celebrating per-token savings."
    },
    {
      "id": "et-x06",
      "type": "single",
      "prompt": "An architecture decision record (ADR) for adopting/rejecting a technique should include…",
      "options": [
        {
          "id": "a",
          "text": "…the evidence compared (baseline vs. candidate on your evals), costs, migration effort, fallback, and a review date, so future engineers know why, and when to reconsider"
        },
        {
          "id": "b",
          "text": "…only the final choice"
        },
        {
          "id": "c",
          "text": "…marketing materials from the vendor"
        },
        {
          "id": "d",
          "text": "…nothing; decisions speak for themselves"
        }
      ],
      "answer": "a",
      "explanation": "Decisions with recorded evidence survive team changes and hype cycles. 'Hold, revisit in Q2 when X matures' is a complete, successful outcome."
    },
    {
      "id": "et-x07",
      "type": "single",
      "prompt": "A team wants to fine-tune because 'the prompt is getting long.' The first question is…",
      "options": [
        {
          "id": "a",
          "text": "…whether prompt caching already makes the long stable prefix nearly free: fine-tuning to save cached tokens usually buys complexity for pennies"
        },
        {
          "id": "b",
          "text": "…which GPU to buy"
        },
        {
          "id": "c",
          "text": "…how many epochs to run"
        },
        {
          "id": "d",
          "text": "…nothing; long prompts always justify tuning"
        }
      ],
      "answer": "a",
      "explanation": "Climb the ladder in order: the caching rung (Module 8) often dissolves the stated motivation before the fine-tuning rung is reached."
    },
    {
      "id": "et-x08",
      "type": "single",
      "prompt": "Choosing between a base model and an instruct/chat model for fine-tuning: the instruct model is usually right when…",
      "options": [
        {
          "id": "a",
          "text": "…your task is assistant-shaped (instructions in, helpful output): you're adjusting behavior on top of post-training rather than rebuilding it from a raw text-continuer"
        },
        {
          "id": "b",
          "text": "…never; base models are always better"
        },
        {
          "id": "c",
          "text": "…you want the model to forget safety training"
        },
        {
          "id": "d",
          "text": "…your data is under 10 examples"
        }
      ],
      "answer": "a",
      "explanation": "Start from the checkpoint closest to your target behavior. Base models suit research and heavy custom post-training; product fine-tunes start from instruct."
    }
  ],
  "llm-foundations": [
    {
      "id": "llm-x01",
      "type": "single",
      "prompt": "'Prefill' vs 'decode' in LLM inference: which statement is correct?",
      "options": [
        {
          "id": "a",
          "text": "Prefill ingests the whole prompt in parallel (fast per token); decode generates one token at a time sequentially (slow per token), which is why long OUTPUTS hurt latency more than long inputs"
        },
        {
          "id": "b",
          "text": "Both phases are equally sequential"
        },
        {
          "id": "c",
          "text": "Decode happens before prefill"
        },
        {
          "id": "d",
          "text": "Prefill only happens for cached prompts"
        }
      ],
      "answer": "a",
      "explanation": "The two-phase structure explains pricing and latency asymmetries, and why 'generate less' is the top optimization."
    },
    {
      "id": "llm-x02",
      "type": "single",
      "prompt": "You place critical instructions in the middle of a 100k-token context. The risk is…",
      "options": [
        {
          "id": "a",
          "text": "…the 'lost in the middle' effect: models attend most reliably to the start and end of long contexts, so mid-context instructions get skimmed"
        },
        {
          "id": "b",
          "text": "…the model will crash"
        },
        {
          "id": "c",
          "text": "…the instructions become training data"
        },
        {
          "id": "d",
          "text": "…nothing; position is irrelevant"
        }
      ],
      "answer": "a",
      "explanation": "Long-context recall is U-shaped. Put load-bearing instructions at the edges, and prefer curated context over stuffed context."
    },
    {
      "id": "llm-x03",
      "type": "single",
      "prompt": "'Logits' are…",
      "options": [
        {
          "id": "a",
          "text": "…the raw pre-softmax scores the model assigns each vocabulary token; softmax (with temperature) turns them into the sampling distribution"
        },
        {
          "id": "b",
          "text": "…the model's login credentials"
        },
        {
          "id": "c",
          "text": "…compressed embeddings"
        },
        {
          "id": "d",
          "text": "…the tokens themselves"
        }
      ],
      "answer": "a",
      "explanation": "Score → softmax → probability → sample. Every sampling dial you use operates on the logits."
    },
    {
      "id": "llm-x04",
      "type": "single",
      "prompt": "Preference-optimized models tend toward sycophancy, meaning engineers should…",
      "options": [
        {
          "id": "a",
          "text": "…verify externally rather than asking the model 'are you sure?': trained agreeableness can shade into endorsing the user's framing"
        },
        {
          "id": "b",
          "text": "…trust confirmations that sound confident"
        },
        {
          "id": "c",
          "text": "…always ask twice and accept two yeses"
        },
        {
          "id": "d",
          "text": "…disable post-training"
        }
      ],
      "answer": "a",
      "explanation": "Optimizing toward human approval creates a pull toward pleasing answers. Verification lives outside the model: evals, checks, systems of record."
    },
    {
      "id": "llm-x05",
      "type": "single",
      "prompt": "Scaling laws describe that…",
      "options": [
        {
          "id": "a",
          "text": "…loss falls smoothly and predictably as model size, data, and compute grow together: turning capability planning into budgeting rather than alchemy"
        },
        {
          "id": "b",
          "text": "…models double in size every month by law"
        },
        {
          "id": "c",
          "text": "…bigger models always memorize more and generalize less"
        },
        {
          "id": "d",
          "text": "…scaling stopped working in 2023"
        }
      ],
      "answer": "a",
      "explanation": "The empirical regularity behind modern model sizes: predictable returns justified the investments that produced today's frontier models."
    },
    {
      "id": "llm-x06",
      "type": "single",
      "prompt": "A prompt in English costs 500 tokens; its faithful Thai translation costs 1,400. The engineering consequences include…",
      "options": [
        {
          "id": "a",
          "text": "…higher cost, more context consumed, and effectively less room for documents: tokenizer efficiency varies by language and should inform budgets for multilingual products"
        },
        {
          "id": "b",
          "text": "…nothing; tokens are free for non-English text"
        },
        {
          "id": "c",
          "text": "…the Thai response will be three times smarter"
        },
        {
          "id": "d",
          "text": "…the model refuses long languages"
        }
      ],
      "answer": "a",
      "explanation": "BPE efficiency mirrors training-data distribution. Multilingual products must budget tokens per language, not per word count."
    }
  ],
  "llm-primitives": [
    {
      "id": "lp-x01",
      "type": "single",
      "prompt": "Instructions in the system role differ from user-message instructions because…",
      "options": [
        {
          "id": "a",
          "text": "…the system role carries the developer's standing authority and constraints, kept stable across requests (and cacheable): user turns are per-request content of lower authority"
        },
        {
          "id": "b",
          "text": "…the system role is secret and unreadable by the model"
        },
        {
          "id": "c",
          "text": "…user messages cannot contain instructions"
        },
        {
          "id": "d",
          "text": "…there is no difference at all"
        }
      ],
      "answer": "a",
      "explanation": "Role separation is both an authority signal to the model and an engineering convenience (stable prefix = cache hits). It is not, however, a security boundary: Module 15."
    },
    {
      "id": "lp-x02",
      "type": "single",
      "prompt": "A response arrives with stop reason 'refusal' on a legitimate business document. Production handling is…",
      "options": [
        {
          "id": "a",
          "text": "…treat it as a routable outcome: detect it, retry with adjusted framing if appropriate, else route to a human: never parse a refusal as if it were data"
        },
        {
          "id": "b",
          "text": "…crash the pipeline"
        },
        {
          "id": "c",
          "text": "…strip the refusal text into the database"
        },
        {
          "id": "d",
          "text": "…blacklist the customer"
        }
      ],
      "answer": "a",
      "explanation": "Safety training occasionally misfires on legitimate content. Plan for it as a normal branch, like timeouts, not an exception that corrupts output."
    },
    {
      "id": "lp-x03",
      "type": "single",
      "prompt": "Why does a reasoning model's 4,000-token 'thinking' improve hard-problem accuracy?",
      "options": [
        {
          "id": "a",
          "text": "Each thinking token is another sequential forward pass whose intermediate results condition the final answer: computation purchased at output-token prices"
        },
        {
          "id": "b",
          "text": "The thinking activates a secret larger network"
        },
        {
          "id": "c",
          "text": "It queries external databases"
        },
        {
          "id": "d",
          "text": "It doesn't; thinking is cosmetic"
        }
      ],
      "answer": "a",
      "explanation": "Test-time compute: decomposition, self-checks, and backtracking in the scratchpad give the final answer better inputs. Whether it's worth 25× tokens is an eval question."
    },
    {
      "id": "lp-x04",
      "type": "single",
      "prompt": "The production-correct division of labor between standard and reasoning models is…",
      "options": [
        {
          "id": "a",
          "text": "…fast standard models for the easy majority (extraction, classification, simple Q&A); escalate to reasoning models for genuinely multi-step problems, with the line drawn by your eval set"
        },
        {
          "id": "b",
          "text": "…reasoning models for everything, since accuracy is accuracy"
        },
        {
          "id": "c",
          "text": "…standard models for everything, since cost is cost"
        },
        {
          "id": "d",
          "text": "…random assignment for fairness"
        }
      ],
      "answer": "a",
      "explanation": "Tiered routing with escalation. 'Reasoning everywhere' is the new 'biggest model everywhere': same mistake, higher invoice."
    },
    {
      "id": "lp-x05",
      "type": "single",
      "prompt": "Why must business data never be parsed out of a reasoning model's thinking scratchpad?",
      "options": [
        {
          "id": "a",
          "text": "The scratchpad is unvalidated generated text: exploratory, sometimes wrong, and not schema-bound; the contract remains the validated final output"
        },
        {
          "id": "b",
          "text": "The scratchpad is encrypted"
        },
        {
          "id": "c",
          "text": "Parsing it is a copyright violation"
        },
        {
          "id": "d",
          "text": "It's fine to parse; thinking is more honest"
        }
      ],
      "answer": "a",
      "explanation": "Thinking is diagnostic (great in traces), not authoritative. Hypotheses considered and discarded mid-scratchpad would poison any parser reading them."
    },
    {
      "id": "lp-x06",
      "type": "single",
      "prompt": "Your few-shot examples all show clean, well-formed inputs. Production inputs are messy. The predictable result is…",
      "options": [
        {
          "id": "a",
          "text": "…degraded behavior on messy inputs: examples teach the distribution they show, so at least one demonstration should be a hard, messy case handled correctly"
        },
        {
          "id": "b",
          "text": "…no effect; examples only affect formatting"
        },
        {
          "id": "c",
          "text": "…improved robustness through contrast"
        },
        {
          "id": "d",
          "text": "…the model refuses messy inputs"
        }
      ],
      "answer": "a",
      "explanation": "Models imitate the demonstrated pattern, including its blind spots. Spend an example on your ugliest realistic case; it's the highest-leverage slot in the prompt."
    },
    {
      "id": "lp-x07",
      "type": "single",
      "prompt": "Temperature 0 plus identical input does not guarantee byte-identical outputs across time because…",
      "options": [
        {
          "id": "a",
          "text": "…provider-side factors (model updates, batching non-determinism, infrastructure) can vary, so idempotency and caching must key on your side, and evals must tolerate benign variation"
        },
        {
          "id": "b",
          "text": "…temperature 0 is actually random"
        },
        {
          "id": "c",
          "text": "…tokens expire"
        },
        {
          "id": "d",
          "text": "…it does guarantee it, always and forever"
        }
      ],
      "answer": "a",
      "explanation": "Treat determinism as strong-but-not-absolute: design result caching, dedup, and comparisons accordingly, and pin model versions where reproducibility matters."
    }
  ],
  "ml-foundations": [
    {
      "id": "ml-x01",
      "type": "single",
      "prompt": "K-fold cross-validation exists primarily to…",
      "options": [
        {
          "id": "a",
          "text": "…get a more reliable performance estimate from limited data by averaging over several train/validation splits"
        },
        {
          "id": "b",
          "text": "…train k different production models"
        },
        {
          "id": "c",
          "text": "…make training k times faster"
        },
        {
          "id": "d",
          "text": "…replace the test set entirely"
        }
      ],
      "answer": "a",
      "explanation": "One small validation split is a noisy estimate; k rotations average the noise. The untouched test set still delivers the final honest number."
    },
    {
      "id": "ml-x02",
      "type": "single",
      "prompt": "For a 1%-positive fraud dataset, which training-time measures address the imbalance? ",
      "options": [
        {
          "id": "a",
          "text": "Class weights or resampling so the minority class influences the loss, plus evaluation by precision/recall rather than accuracy"
        },
        {
          "id": "b",
          "text": "Deleting most negative examples from the test set too"
        },
        {
          "id": "c",
          "text": "Using accuracy but reporting it twice"
        },
        {
          "id": "d",
          "text": "Nothing; imbalance only affects deep learning"
        }
      ],
      "answer": "a",
      "explanation": "Weighting/resampling fixes the training signal; metric choice fixes the measurement. Touching the TEST distribution, however, would falsify the evaluation."
    },
    {
      "id": "ml-x03",
      "type": "single",
      "prompt": "You must pick one number to compare classifiers on an imbalanced task where both false alarms and misses matter. The standard choice is…",
      "options": [
        {
          "id": "a",
          "text": "F1: the harmonic mean of precision and recall, which punishes neglecting either"
        },
        {
          "id": "b",
          "text": "Accuracy"
        },
        {
          "id": "c",
          "text": "Training loss"
        },
        {
          "id": "d",
          "text": "Row count"
        }
      ],
      "answer": "a",
      "explanation": "The harmonic mean collapses to zero if either component does: you can't F1 your way past ignoring one error type. (With asymmetric costs, weighted variants or the raw pair are better still.)"
    },
    {
      "id": "ml-x04",
      "type": "single",
      "prompt": "A churn model uses 'support tickets in the 30 days after the prediction date' as a feature. The problem is…",
      "options": [
        {
          "id": "a",
          "text": "…temporal leakage: the feature isn't knowable at prediction time, so offline metrics inflate and production performance collapses"
        },
        {
          "id": "b",
          "text": "…support tickets are irrelevant to churn"
        },
        {
          "id": "c",
          "text": "…30 days is too short a window"
        },
        {
          "id": "d",
          "text": "…nothing; more features always help"
        }
      ],
      "answer": "a",
      "explanation": "Every feature must pass the 'knowable at prediction moment' test. Future-derived features are answer keys smuggled into training."
    },
    {
      "id": "ml-x05",
      "type": "single",
      "prompt": "How do you check whether a model's probability outputs are calibrated?",
      "options": [
        {
          "id": "a",
          "text": "Bucket predictions by stated probability and compare each bucket's actual outcome rate: the 80% bucket should come true about 80% of the time"
        },
        {
          "id": "b",
          "text": "Check that probabilities are all above 0.5"
        },
        {
          "id": "c",
          "text": "Verify the probabilities sum to the row count"
        },
        {
          "id": "d",
          "text": "Calibration cannot be measured"
        }
      ],
      "answer": "a",
      "explanation": "A reliability check per confidence bucket. Miscalibrated scores break every threshold and every human decision that consumes them."
    },
    {
      "id": "ml-x06",
      "type": "single",
      "prompt": "MAE versus RMSE: when does RMSE tell a usefully different story?",
      "options": [
        {
          "id": "a",
          "text": "When large individual errors matter disproportionately: RMSE squares errors, so a few big misses dominate it while MAE averages them away"
        },
        {
          "id": "b",
          "text": "Never; they are always equal"
        },
        {
          "id": "c",
          "text": "When the data contains categories"
        },
        {
          "id": "d",
          "text": "Only on GPU hardware"
        }
      ],
      "answer": "a",
      "explanation": "Choose the metric that mirrors the cost structure: forecast errors that occasionally ruin a day (not just nudge an average) argue for RMSE's outlier sensitivity."
    },
    {
      "id": "ml-x07",
      "type": "single",
      "prompt": "'Data drift' in a deployed model means…",
      "options": [
        {
          "id": "a",
          "text": "…the input distribution has shifted from what the model trained on (new formats, segments, behaviors), degrading performance even though the code is unchanged"
        },
        {
          "id": "b",
          "text": "…the database is physically moving"
        },
        {
          "id": "c",
          "text": "…the model's weights decay over time"
        },
        {
          "id": "d",
          "text": "…users forget how to use the product"
        }
      ],
      "answer": "a",
      "explanation": "The world moves; the model's snapshot doesn't. Monitoring input stats and quality proxies (correction rates) is the early-warning system."
    }
  ],
  "multimodal-ai": [
    {
      "id": "mm-x01",
      "type": "single",
      "prompt": "Two-column PDF text extracted row-by-row reads as interleaved nonsense. The missing extraction output is…",
      "options": [
        {
          "id": "a",
          "text": "…reading order: blocks need page, bounding box, and reading-order indexes: layout is meaning, not decoration"
        },
        {
          "id": "b",
          "text": "…higher OCR resolution"
        },
        {
          "id": "c",
          "text": "…a larger language model"
        },
        {
          "id": "d",
          "text": "…lower temperature"
        }
      ],
      "answer": "a",
      "explanation": "Character accuracy can be perfect while structure is destroyed. Reading order is a first-class output of document parsing, evaluated separately."
    },
    {
      "id": "mm-x02",
      "type": "single",
      "prompt": "When a PDF has trustworthy embedded text, running OCR anyway is…",
      "options": [
        {
          "id": "a",
          "text": "…a downgrade: native text is exact while OCR introduces recognition errors: detect text-vs-scanned per region and OCR only what needs it"
        },
        {
          "id": "b",
          "text": "…best practice for consistency"
        },
        {
          "id": "c",
          "text": "…required by PDF standards"
        },
        {
          "id": "d",
          "text": "…free of any quality difference"
        }
      ],
      "answer": "a",
      "explanation": "Use the highest-fidelity source available per region. OCR is the fallback for scans, not the default for everything."
    },
    {
      "id": "mm-x03",
      "type": "single",
      "prompt": "Extraction schemas for documents include an evidence region (page + bounding box) per field because…",
      "options": [
        {
          "id": "a",
          "text": "…evidence makes every value verifiable: reviewers jump straight to the source region, and missing evidence flags probable hallucination"
        },
        {
          "id": "b",
          "text": "…it makes the JSON larger and more impressive"
        },
        {
          "id": "c",
          "text": "…models require coordinates to function"
        },
        {
          "id": "d",
          "text": "…screens are rectangular"
        }
      ],
      "answer": "a",
      "explanation": "Evidence-linked extraction is the document version of RAG citations: checkable claims, faster review, and an automatic tripwire for invented values."
    },
    {
      "id": "mm-x04",
      "type": "single",
      "prompt": "A model reports 97% confidence on an extracted total, but line items don't sum to it. The document routes to…",
      "options": [
        {
          "id": "a",
          "text": "…human review: deterministic reconciliation outranks self-reported confidence, which measures fluency more than truth"
        },
        {
          "id": "b",
          "text": "…auto-processing; 97% is high"
        },
        {
          "id": "c",
          "text": "…deletion"
        },
        {
          "id": "d",
          "text": "…a retry with higher temperature"
        }
      ],
      "answer": "a",
      "explanation": "Arithmetic doesn't hallucinate. Deterministic cross-checks are the strongest signal in the confidence blend and always win conflicts."
    },
    {
      "id": "mm-x05",
      "type": "single",
      "prompt": "Document AI quality should be monitored by segment (vendor, layout, scan quality, language) because…",
      "options": [
        {
          "id": "a",
          "text": "…template drift and new layouts degrade specific segments first: aggregates hide the vendor whose new invoice format just broke extraction"
        },
        {
          "id": "b",
          "text": "…segments make dashboards prettier"
        },
        {
          "id": "c",
          "text": "…averages are mathematically invalid"
        },
        {
          "id": "d",
          "text": "…regulations require vendor tracking"
        }
      ],
      "answer": "a",
      "explanation": "Module 5's segment-analysis habit, applied to documents: failures cluster, and the cluster is the diagnosis."
    },
    {
      "id": "mm-x06",
      "type": "single",
      "prompt": "Uploaded documents are a prompt-injection vector because…",
      "options": [
        {
          "id": "a",
          "text": "…hidden text (white-on-white, metadata, embedded notes) reaches the model as readable tokens: document content is untrusted input, full Module 15 rules applied"
        },
        {
          "id": "b",
          "text": "…PDFs can execute Python on the server"
        },
        {
          "id": "c",
          "text": "…they can't be; images are safe by nature"
        },
        {
          "id": "d",
          "text": "…OCR always adds malicious text"
        }
      ],
      "answer": "a",
      "explanation": "The model reads what humans don't see. Least privilege and gated actions protect document pipelines exactly as they protect chat."
    },
    {
      "id": "mm-x07",
      "type": "single",
      "prompt": "For voice interfaces, the latency budget differs from text chat because…",
      "options": [
        {
          "id": "a",
          "text": "…conversation has a rhythm: sub-second response gaps read as natural while multi-second gaps read as broken: pushing designs toward streaming, smaller models, and incremental transcription"
        },
        {
          "id": "b",
          "text": "…audio files are smaller than text"
        },
        {
          "id": "c",
          "text": "…voice users are more patient"
        },
        {
          "id": "d",
          "text": "…latency is identical across modalities"
        }
      ],
      "answer": "a",
      "explanation": "Modality sets the budget; the budget picks the architecture (Module 16's discipline). Realtime voice is a p95 problem before it's a quality problem."
    },
    {
      "id": "mm-x08",
      "type": "single",
      "prompt": "An unfamiliar document layout arrives. The robust pipeline response is…",
      "options": [
        {
          "id": "a",
          "text": "…a 'new layout' route: flag, quarantine for review, and add to evaluation, rather than forcing it through the dominant template and hoping"
        },
        {
          "id": "b",
          "text": "…force it through the closest template"
        },
        {
          "id": "c",
          "text": "…reject the customer"
        },
        {
          "id": "d",
          "text": "…retry ten times"
        }
      ],
      "answer": "a",
      "explanation": "Unknown-unknowns get an explicit route. Reviewed new layouts become supported layouts; forced ones become silent errors."
    }
  ],
  "production-llmops": [
    {
      "id": "pr-x01",
      "type": "single",
      "prompt": "A blue/green deployment for an AI system means…",
      "options": [
        {
          "id": "a",
          "text": "…building the new version (config, index, or service) fully alongside the old, verifying it (evals + canary), then switching traffic with instant rollback available"
        },
        {
          "id": "b",
          "text": "…deploying only at night"
        },
        {
          "id": "c",
          "text": "…using two cloud providers"
        },
        {
          "id": "d",
          "text": "…coloring the dashboard"
        }
      ],
      "answer": "a",
      "explanation": "Full-parallel-then-switch converts risky migrations (model swaps, index rebuilds) into reversible ones. The old version IS the rollback plan."
    },
    {
      "id": "pr-x02",
      "type": "single",
      "prompt": "An error budget (the allowed slice of SLO failure) is useful because…",
      "options": [
        {
          "id": "a",
          "text": "…it converts reliability into a spendable resource: budget remaining → ship features; budget exhausted → stop and invest in reliability: an objective arbiter for the eternal argument"
        },
        {
          "id": "b",
          "text": "…it caps the number of bug reports"
        },
        {
          "id": "c",
          "text": "…it is a financial accounting term"
        },
        {
          "id": "d",
          "text": "…errors are free within budget so nobody looks at them"
        }
      ],
      "answer": "a",
      "explanation": "SLO + error budget turns 'how reliable is reliable enough' into policy, and stops both reliability perfectionism and feature-factory neglect."
    },
    {
      "id": "pr-x03",
      "type": "single",
      "prompt": "Cost dashboards should aggregate spend per FEATURE (not just per API key) because…",
      "options": [
        {
          "id": "a",
          "text": "…optimization and accountability happen at feature level: 'summarization costs €90/day, extraction €12/day' directs effort; one blended number directs nothing"
        },
        {
          "id": "b",
          "text": "…API keys are secret"
        },
        {
          "id": "c",
          "text": "…providers require it"
        },
        {
          "id": "d",
          "text": "…features are easier to spell"
        }
      ],
      "answer": "a",
      "explanation": "Tag every request with its feature. Per-feature unit economics is what makes cost engineering (and budget alerts) actionable."
    },
    {
      "id": "pr-x04",
      "type": "single",
      "prompt": "Under a traffic spike, a queue-backed AI pipeline exhibits 'backpressure' correctly by…",
      "options": [
        {
          "id": "a",
          "text": "…letting the queue lengthen (delaying non-urgent work) while workers process at sustainable rate: instead of overwhelming the model API into rate-limit storms"
        },
        {
          "id": "b",
          "text": "…dropping requests silently"
        },
        {
          "id": "c",
          "text": "…spawning unlimited workers instantly"
        },
        {
          "id": "d",
          "text": "…crashing early to shed load"
        }
      ],
      "answer": "a",
      "explanation": "Queues absorb bursts by design (Module 13). Monitoring queue depth and age tells you when 'absorbing' has become 'drowning': an alert, not a crash."
    },
    {
      "id": "pr-x05",
      "type": "single",
      "prompt": "A fallback chain 'primary model → smaller model → cached/static response' should itself be…",
      "options": [
        {
          "id": "a",
          "text": "…tested regularly (chaos-style): an unexercised fallback that fails during the real outage is two incidents stacked"
        },
        {
          "id": "b",
          "text": "…assumed to work by design"
        },
        {
          "id": "c",
          "text": "…secret from the team"
        },
        {
          "id": "d",
          "text": "…removed once the primary is stable"
        }
      ],
      "answer": "a",
      "explanation": "Degradation paths rot like manual fallbacks (Module 13) and runbooks. Inject failure deliberately and watch the chain actually catch."
    },
    {
      "id": "pr-x06",
      "type": "single",
      "prompt": "Pinning an exact model version in production (vs. auto-tracking 'latest') trades…",
      "options": [
        {
          "id": "a",
          "text": "…stability for staleness: pinned versions change only when YOU migrate (with evals), while 'latest' imports provider changes untested into production"
        },
        {
          "id": "b",
          "text": "…nothing; versions are cosmetic"
        },
        {
          "id": "c",
          "text": "…cost for speed only"
        },
        {
          "id": "d",
          "text": "…security for convenience"
        }
      ],
      "answer": "a",
      "explanation": "Model updates are behavior changes. Production wants controlled migrations on your schedule: pin, evaluate the new version, then switch."
    },
    {
      "id": "pr-x07",
      "type": "single",
      "prompt": "Which alert is MOST urgent for an AI feature: latency p95 +10%, cost/day +15%, or validation-failure rate 2% → 9%?",
      "options": [
        {
          "id": "a",
          "text": "Validation failures: a quality cliff usually means an upstream/provider/prompt change actively corrupting outputs; latency and cost drifts hurt slower"
        },
        {
          "id": "b",
          "text": "Latency, always"
        },
        {
          "id": "c",
          "text": "Cost, always"
        },
        {
          "id": "d",
          "text": "None; alerts are noise"
        }
      ],
      "answer": "a",
      "explanation": "Triage by user harm velocity. A 4.5× jump in schema failures is a correctness incident in progress; the others are trends to investigate."
    },
    {
      "id": "pr-x08",
      "type": "single",
      "prompt": "Rate-limit headroom planning means…",
      "options": [
        {
          "id": "a",
          "text": "…knowing your provider tier's requests+tokens/minute versus your peak usage, with alerting before the ceiling: hitting limits at peak IS an outage for the unlucky requests"
        },
        {
          "id": "b",
          "text": "…requesting unlimited quota preemptively"
        },
        {
          "id": "c",
          "text": "…ignoring limits until errors appear"
        },
        {
          "id": "d",
          "text": "…using one API key per user"
        }
      ],
      "answer": "a",
      "explanation": "Capacity planning applies to model APIs like any dependency: measure peak, keep margin, alert on approach, and know the upgrade path before you need it."
    }
  ],
  "rag": [
    {
      "id": "rag-x01",
      "type": "single",
      "prompt": "Chunk overlap (repeating a sentence or two between adjacent chunks) exists to…",
      "options": [
        {
          "id": "a",
          "text": "…keep answers that span a chunk boundary retrievable, without overlap, a fact split across the cut may match neither chunk well"
        },
        {
          "id": "b",
          "text": "…increase the index size for robustness"
        },
        {
          "id": "c",
          "text": "…confuse the reranker productively"
        },
        {
          "id": "d",
          "text": "…meet a vector-database requirement"
        }
      ],
      "answer": "a",
      "explanation": "Boundaries are arbitrary; meaning isn't. Modest overlap insures against the cut landing mid-answer, at a small storage cost."
    },
    {
      "id": "rag-x02",
      "type": "single",
      "prompt": "Adding a reranker improved answer quality but added 300ms. The correct evaluation frame is…",
      "options": [
        {
          "id": "a",
          "text": "…measure both: retrieval-metric gain (recall/MRR) and p95 latency cost, then decide against your latency budget: quality changes are never free-standing"
        },
        {
          "id": "b",
          "text": "…quality always wins; ship it"
        },
        {
          "id": "c",
          "text": "…latency always wins; remove it"
        },
        {
          "id": "d",
          "text": "…use the vendor's aggregate benchmark without measuring your workload"
        }
      ],
      "answer": "a",
      "explanation": "Every pipeline stage buys something and costs something. The budgets (Module 16) and the evals (Module 14) jointly make the call, not either alone."
    },
    {
      "id": "rag-x03",
      "type": "single",
      "prompt": "Why is the abstention response given an exact, fixed phrasing rather than letting the model improvise a refusal?",
      "options": [
        {
          "id": "a",
          "text": "Exact phrasing is detectable (by evals measuring abstention rates, by routing logic, and by UX) while improvised refusals are unmeasurable and unroutable"
        },
        {
          "id": "b",
          "text": "Models cannot improvise refusals"
        },
        {
          "id": "c",
          "text": "A fixed response improves the model's underlying factual knowledge"
        },
        {
          "id": "d",
          "text": "Variable refusals cannot be displayed in a user interface"
        }
      ],
      "answer": "a",
      "explanation": "Abstention is an engineered, instrumented behavior. If you can't detect it, you can't measure it; if you can't measure it, you can't maintain it."
    },
    {
      "id": "rag-x04",
      "type": "single",
      "prompt": "Retrieval evals report recall@5 = 95% but users still get wrong answers on recently-changed policies. The likely culprit is…",
      "options": [
        {
          "id": "a",
          "text": "…index staleness: retrieval correctly finds chunks from outdated documents; freshness through change detection, upserts, and deletion propagation is a separate quality axis"
        },
        {
          "id": "b",
          "text": "…the recall metric is broken"
        },
        {
          "id": "c",
          "text": "…users asking wrong questions"
        },
        {
          "id": "d",
          "text": "…the generation model forgot its training"
        }
      ],
      "answer": "a",
      "explanation": "An index is a derived cache of sources. Recall measures finding what's indexed, not whether what's indexed still reflects reality. Both need monitoring."
    },
    {
      "id": "rag-x05",
      "type": "single",
      "prompt": "Deleting a document from the source system must trigger…",
      "options": [
        {
          "id": "a",
          "text": "…deletion of its chunks from the index (via stable chunk IDs): otherwise the assistant confidently cites retracted content indefinitely"
        },
        {
          "id": "b",
          "text": "…nothing; indexes are append-only by design"
        },
        {
          "id": "c",
          "text": "…a full rebuild of all embeddings"
        },
        {
          "id": "d",
          "text": "…a lower temperature"
        }
      ],
      "answer": "a",
      "explanation": "Deletion propagation is the forgotten half of ingestion, and the compliance-relevant half, when the deleted document was retracted for a reason."
    },
    {
      "id": "rag-x06",
      "type": "single",
      "prompt": "In a multi-tenant RAG product, per-tenant isolation belongs…",
      "options": [
        {
          "id": "a",
          "text": "…in the data layer: separate collections or provably mandatory tenant filters, making a cross-tenant query impossible rather than merely avoided"
        },
        {
          "id": "b",
          "text": "…in the system prompt ('only discuss this tenant's documents')"
        },
        {
          "id": "c",
          "text": "…in the UI footer"
        },
        {
          "id": "d",
          "text": "…nowhere; embeddings anonymize content"
        }
      ],
      "answer": "a",
      "explanation": "One forgotten filter on a shared index is a cross-customer breach. Structure beats vigilance: make the wrong query unexpressible."
    },
    {
      "id": "rag-x07",
      "type": "single",
      "prompt": "Upgrading the embedding model requires re-embedding the whole corpus because…",
      "options": [
        {
          "id": "a",
          "text": "…different models define different vector spaces: similarity between old and new vectors is meaningless, so mixed indexes silently break retrieval"
        },
        {
          "id": "b",
          "text": "…old vectors expire legally"
        },
        {
          "id": "c",
          "text": "…new models output incompatible file formats"
        },
        {
          "id": "d",
          "text": "…it doesn't; vectors are interchangeable"
        }
      ],
      "answer": "a",
      "explanation": "Each model's geometry is its own ruler. Operationally: build the new index fully, verify recall on evals, blue/green swap with rollback ready."
    },
    {
      "id": "rag-x08",
      "type": "single",
      "prompt": "The metric 'time since last successful ingestion per source' with an alert threshold exists to catch…",
      "options": [
        {
          "id": "a",
          "text": "…silent pipeline death: the most common way RAG rots: nothing errors user-visibly, the index just quietly stops reflecting reality"
        },
        {
          "id": "b",
          "text": "…slow user queries"
        },
        {
          "id": "c",
          "text": "…expensive embeddings"
        },
        {
          "id": "d",
          "text": "…prompt injection"
        }
      ],
      "answer": "a",
      "explanation": "Staleness is invisible at query time: answers keep flowing, just increasingly wrong. A freshness metric makes the invisible failure page someone."
    }
  ],
  "safety-security": [
    {
      "id": "ss-x01",
      "type": "single",
      "prompt": "Tool results (API responses, file contents, web pages fetched by an agent) must be treated as untrusted because…",
      "options": [
        {
          "id": "a",
          "text": "…they carry third-party content into the context: a fetched webpage or poisoned database field is an indirect injection vector exactly like an uploaded document"
        },
        {
          "id": "b",
          "text": "…APIs are usually broken"
        },
        {
          "id": "c",
          "text": "…tools run on slower servers"
        },
        {
          "id": "d",
          "text": "…they aren't; tools are inside the trust boundary"
        }
      ],
      "answer": "a",
      "explanation": "The injection surface is 'any text the model reads', not 'any text the user types'. Retrieved chunks, tool outputs, and documents all qualify."
    },
    {
      "id": "ss-x02",
      "type": "single",
      "prompt": "Approval fatigue (humans rubber-stamping gates) is best mitigated by…",
      "options": [
        {
          "id": "a",
          "text": "…gating fewer, higher-stakes actions with rich context per request: reserving human attention for decisions that matter instead of diluting it across everything"
        },
        {
          "id": "b",
          "text": "…adding more approval steps"
        },
        {
          "id": "c",
          "text": "…removing approvals entirely"
        },
        {
          "id": "d",
          "text": "…punishing fast approvers"
        }
      ],
      "answer": "a",
      "explanation": "Attention is a budget. A gate on everything is a gate on nothing; calibrated scope plus decision-ready context keeps the human check real."
    },
    {
      "id": "ss-x03",
      "type": "single",
      "prompt": "Data minimization applies to traces and logs by…",
      "options": [
        {
          "id": "a",
          "text": "…redacting secrets and unneeded personal data at capture and setting retention limits: the observability store is part of the attack surface"
        },
        {
          "id": "b",
          "text": "…logging everything forever for completeness"
        },
        {
          "id": "c",
          "text": "…disabling logging entirely"
        },
        {
          "id": "d",
          "text": "…encrypting logs and never rotating keys"
        }
      ],
      "answer": "a",
      "explanation": "You cannot leak what you didn't keep. Minimization is a design constraint on every copy (prompts, traces, backups) not just the primary database."
    },
    {
      "id": "ss-x04",
      "type": "single",
      "prompt": "Model output flowing into a SQL query, shell command, or HTML page is dangerous because…",
      "options": [
        {
          "id": "a",
          "text": "…output is untrusted input to the next system: injection through the model becomes SQL injection, command injection, or XSS at the sink; parameterize, sandbox, or sanitize there"
        },
        {
          "id": "b",
          "text": "…models format SQL badly"
        },
        {
          "id": "c",
          "text": "…it's slow"
        },
        {
          "id": "d",
          "text": "…it isn't; model output is safe by construction"
        }
      ],
      "answer": "a",
      "explanation": "The sink defines the risk. Every classical injection defense applies at the boundary where model text meets an interpreter."
    },
    {
      "id": "ss-x05",
      "type": "single",
      "prompt": "Before sending regulated data to a model API, you must verify the provider's…",
      "options": [
        {
          "id": "a",
          "text": "…the provider's data-handling terms for retention, training use, residency, and available zero-retention or enterprise controls"
        },
        {
          "id": "b",
          "text": "…logo quality"
        },
        {
          "id": "c",
          "text": "…model parameter count"
        },
        {
          "id": "d",
          "text": "…nothing; APIs are all equivalent"
        }
      ],
      "answer": "a",
      "explanation": "Where data flows is a compliance question answered by the DPA and terms. For hard residency constraints, Module 17's self-hosting is the alternative."
    },
    {
      "id": "ss-x06",
      "type": "single",
      "prompt": "Ranking risks by 'blast radius' means prioritizing…",
      "options": [
        {
          "id": "a",
          "text": "…the worst reachable consequence (irreversible actions, mass data exposure) over the most likely small one: the send-all-contacts email outranks a typo in a summary"
        },
        {
          "id": "b",
          "text": "…the most frequent bug"
        },
        {
          "id": "c",
          "text": "…whatever was in the news"
        },
        {
          "id": "d",
          "text": "…alphabetical order"
        }
      ],
      "answer": "a",
      "explanation": "Threat models sort by consequence × reachability. The highest-blast-radius action gets the strongest walls (privilege, gates) first."
    },
    {
      "id": "ss-x07",
      "type": "single",
      "prompt": "Red-team findings become durable protection when…",
      "options": [
        {
          "id": "a",
          "text": "…each successful attack is added to the eval suite as a permanent regression case: defeated once means detected forever"
        },
        {
          "id": "b",
          "text": "…they're documented in a slide deck"
        },
        {
          "id": "c",
          "text": "…the red team is congratulated"
        },
        {
          "id": "d",
          "text": "…the report is marked confidential"
        }
      ],
      "answer": "a",
      "explanation": "The failure-museum loop applies to security: attacks that once worked become automated tests that gate every future release."
    },
    {
      "id": "ss-x08",
      "type": "single",
      "prompt": "Delimiting untrusted text (e.g., <document>…</document>) is necessary but insufficient because…",
      "options": [
        {
          "id": "a",
          "text": "…it's hygiene that helps the model separate data from instructions, but a determined injection can still steer the model: real boundaries constrain capabilities, not text"
        },
        {
          "id": "b",
          "text": "…XML tags cost too many tokens"
        },
        {
          "id": "c",
          "text": "…models can't see tags"
        },
        {
          "id": "d",
          "text": "…it is fully sufficient on its own"
        }
      ],
      "answer": "a",
      "explanation": "Layer one of defense in depth, never the whole defense. Least privilege and gated actions hold when the delimiter doesn't."
    }
  ]
};

const ROOT = path.join(process.cwd(), "content", "modules");
const readJson = (p) => JSON.parse(readFileSync(p, "utf8").replace(/^﻿/, ""));
let added = 0;
for (const [slug, questions] of Object.entries(NEW)) {
  const qf = path.join(ROOT, slug, "questions.json");
  const pool = readJson(qf);
  const existing = new Set(pool.map((q) => q.id));
  const fresh = questions.filter((q) => !existing.has(q.id));
  pool.push(...fresh);
  writeFileSync(qf, JSON.stringify(pool, null, 2) + "\n");
  added += fresh.length;

  const mj = path.join(ROOT, slug, "module.json");
  const mod = readJson(mj);
  if (pool.length >= 16 && mod.examCount < 10) {
    mod.examCount = 10;
    writeFileSync(mj, JSON.stringify(mod, null, 2) + "\n");
  }
  console.log(`${slug}: pool ${pool.length} (+${fresh.length}), examCount ${mod.examCount}`);
}
// Also bump the new onramp modules if pools qualify
for (const slug of ["python-foundations", "math-foundations", "getting-hired"]) {
  const qf = path.join(ROOT, slug, "questions.json");
  const pool = readJson(qf);
  const mj = path.join(ROOT, slug, "module.json");
  const mod = readJson(mj);
  if (pool.length >= 16 && mod.examCount < 10) {
    mod.examCount = 10;
    writeFileSync(mj, JSON.stringify(mod, null, 2) + "\n");
    console.log(`${slug}: examCount → 10 (pool ${pool.length})`);
  }
}
console.log(`\n${added} questions appended.`);
