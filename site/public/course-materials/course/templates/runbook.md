# Operating runbook template

Complete this with the actual commands and controls for the chosen environment. An operator must be able to follow it without the builder's private chat history.

## Service and ownership

Record purpose, allowed users, process owner, technical owner, review owner, support hours, version, environment, data locations, and permitted actions.

## Start and verify

Record prerequisites, configuration location, secret-store reference, start command, health check, and one known test case. Include the expected output and where failures appear. Do not place secret values in this file.

## Observe work

List the queue and trace locations, oldest-waiting threshold, quality checks, cost budget, review duty, and alert destination. Define how an operator finds a case by ID.

## Stop and reconcile

List the exact controls to pause triggers, stop active work, revoke tool access, and inspect unfinished effects. Distinguish cancelled work from an action already completed externally. Reconcile ambiguous outcomes before retrying.

## Recover

Record the last approved version, backup/restore procedure, action-key handling, replay procedure, and manual fallback. Include a successful rehearsal date and evidence. State what the procedure cannot automatically recover.

## Change and retire

Name who approves prompt, skill, model, permission, and source changes. Rerun relevant evaluations after changes. To retire the lab, stop schedules, revoke credentials, remove integrations, and apply the agreed retention policy to source copies, indexes, memory, and logs.
