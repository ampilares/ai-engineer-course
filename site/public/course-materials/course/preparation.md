# Preparation and entry tasks

Choose only the preparation you need. Owners can complete the core without writing application code; engineers should be comfortable changing and testing a small program.

## Shared preparation: 60-90 minutes

1. Open the Harbour sales CSV and identify a row, column, event ID, duplicate, and missing value.
2. Calculate 1,200 + 800 - 200 without an assistant. Explain why the result is 1,800.
3. Copy a ticket into an approved assistant and request a category, reason, and uncertainty. Check that it did not execute anything.
4. Open a cited source and locate the passage supporting one factual claim.
5. Write the inputs, output, reviewer, and finish condition for a process you know.

You are ready when you can separate the request, supplied evidence, model answer, and final business decision.

## Engineering preparation: 2-6 hours as needed

1. Install a compatible Node.js runtime and run the commands in [setup](../SETUP.md).
2. Read a ticket JSON object. Change its text in a disposable copy and validate that the JSON still parses.
3. Read the reporting function and explain the distinction between an exact duplicate and a conflicting duplicate.
4. Run the reference tests. Temporarily change an expected value in a copy, observe a failure, and restore it.
5. Inspect a Git diff and explain every line of a small change.
6. Explain an HTTP status, a timeout, an environment variable, and why an API key is not source code.

Use the retained [engineering foundations guide](../modules/01-engineering-foundations.md) for deeper practice if available in this checkout. On the learning site, the legacy Python, math, and engineering lessons remain accessible as optional references. Their historical numbering does not define the new core.

## Owner preparation: 1-2 hours as needed

Open the [review prototype](labs/review-prototype.html). Prepare a draft, edit it, approve the exact content, and record the simulated effect. Reload and observe that this teaching prototype loses in-memory state. Describe why a real queue needs persistence.

Choose a process owner and reviewer for your project. If they are the same person during the course, record who could cover an absence. Bring one normal case, one unclear case, and one unacceptable action to Week 1.
