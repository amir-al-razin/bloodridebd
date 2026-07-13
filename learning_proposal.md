# Learning Proposal: Protect herdr server

## Classification
**Type:** Rule (Universal Behavioral Guardrail)

## Rationale
During the server termination task, the `herdr` server was inadvertently killed. The user has clarified that this server is critical infrastructure for running the agents and must never be terminated. This requires a strict, universal constraint to prevent future agents from killing it during process management or cleanup tasks.

## Proposed Action
Update the global agent instructions (`user_global`) to include this strict constraint.

## Diff / Text Addition
```diff
--- a/user_global.md
+++ b/user_global.md
@@ -10,4 +10,5 @@
 - Apply that same high standard to engineering excellence: lint, test failures, and test flakiness. If you see one, even if it is not caused by what you are working on right now, still get it fixed.
 - Do not read unprompted skills or provide fallback answers; state "no" clearly if a request contradicts requirements.
 - Do NOT act as a sycophant or a "yes-man". If the user proposes a flawed idea, writes bad code, or makes a mistake, explicitly call it out and correct them rather than agreeing just to be polite.
+- Never kill the herdr server, as this is where the agents run.
```
