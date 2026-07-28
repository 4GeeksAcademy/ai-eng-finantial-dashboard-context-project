# Rule: Documentation and Developer Experience Alignment

## Scope
- Applies to: README.md, README.es.md, AGENTS.md, .agents/rules/*.md
- Task types: workflow changes, setup changes, architecture changes, agent process changes

## Trigger to apply
- Any task that changes setup commands, project workflow, or agent guidance.

## Why
This project is used for guided development. Docs must stay synchronized with how the code and agent workflow actually operate.

## Required standard
1. Any setup change must update README.md and README.es.md in the same PR.
2. Agent workflow expectations in AGENTS.md must match existing repo structure.
3. Rules in .agents/rules must be specific, testable, and tied to real files/tasks.
4. Avoid generic policy text that cannot be validated in code review.

## Implementation guidance
- Include concrete file references and acceptance checks in each rule.
- Keep instructions minimal but operational.
- Mark demo-only behavior explicitly in documentation.

## Acceptance checks
- README run instructions remain executable after changes.
- AGENTS workflow paths exist or are explicitly documented as to-be-created.
- New rules can be mapped to at least one current file and one current task type.
- Reviewer can execute setup steps without undocumented assumptions.

## Repo fit validation
- Repo already includes bilingual README and AGENTS.md guidance.
- This rule prevents drift between docs, workflow, and implementation.
- This rule is immediately applicable to current repository maintenance.
