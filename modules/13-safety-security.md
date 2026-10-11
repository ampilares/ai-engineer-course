# Module 13: Safety, security, privacy, and governance

**Time:** 1 week

**Outcome:** Threat-model an AI workflow, demonstrate attacks, and implement layered controls.

## Learn

- Trust boundaries across user input, retrieved content, models, tools, code, storage, logs, and downstream systems.
- Direct/indirect prompt injection, sensitive-data disclosure, insecure output handling, supply-chain risk, poisoning, denial of wallet/service, and excessive agency.
- Least privilege, allowlists, argument validation, sandboxing, tenant isolation, egress controls, secret management, and approvals.
- Data minimization, purpose limitation, retention/deletion, consent, provenance, and provider terms.
- Harm assessment, bias, accessibility, transparency, human oversight, and appeal/escalation.
- Risk registers, model/system cards, audit logs, incident response, and governance ownership.

## Core resources

- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/resource/owasp-top-10-for-llm-applications-2025/): primary application-security checklist.
- [OWASP LLM Security Verification Standard](https://owasp.org/www-project-llm-verification-standard/): deeper verification requirements.
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework): govern, map, measure, and manage.
- [NIST Generative AI Profile](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf): GenAI-specific risk actions.
- [MITRE ATLAS](https://atlas.mitre.org/): adversarial threat knowledge base for AI systems.

## Labs

1. Draw a data-flow diagram and mark assets, actors, trust boundaries, and high-impact actions.
2. Create attacks: direct injection, malicious retrieved document, tool-argument manipulation, data exfiltration request, and resource exhaustion.
3. Add defenses outside the prompt: permission checks, scoped tools, schema validation, quotas, approval, and output encoding.
4. Prove one compromised component cannot directly perform the most damaging action.
5. Write detection, containment, notification, rollback, and evidence-preservation steps for one incident.

## Project acceptance

- the threat model ranks likelihood and impact rather than listing generic risks;
- controls map to threats and have tests;
- authorization is enforced by application/downstream systems;
- untrusted model output never becomes executable code/SQL/HTML without controls;
- sensitive data does not enter inappropriate providers, prompts, or logs;
- high-impact actions require informed human approval;
- residual risk and accountable owner are explicit.

## Important principle

Prompts can guide behavior but are not security boundaries. Apply controls in code, permissions, infrastructure, and the downstream system of record.
