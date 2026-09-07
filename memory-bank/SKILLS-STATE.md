# Skills state and ecosystem memory

Date: 2026-09-07

## Installed project skills

Source of truth:
- [skills-lock.json](../skills-lock.json)
- [.agents/skills](../.agents/skills)

Installed skills in the project:
- accessibility
- frontend-design
- seo
- vercel-react-best-practices
- webapp-testing

## Ecosystem sources chosen

Installed skills currently come from:
- addyosmani/web-quality-skills
- anthropics/skills
- vercel-labs/agent-skills

## Local skill copies and inner project assets

Project-local copies used by agents:
- [.agents/skills/accessibility/SKILL.md](../.agents/skills/accessibility/SKILL.md)
- [skills/frontend-design/SKILL.md](../skills/frontend-design/SKILL.md)
- [.agents/skills/seo/SKILL.md](../.agents/skills/seo/SKILL.md)
- [.agents/skills/vercel-react-best-practices/SKILL.md](../.agents/skills/vercel-react-best-practices/SKILL.md)
- [.agents/skills/webapp-testing/SKILL.md](../.agents/skills/webapp-testing/SKILL.md)

Inner project rule system:
- [.agents/rules](../.agents/rules)

## Changes and decisions tracked

Skill and governance updates recorded in this repository:
- Installed accessibility, seo, vercel-react-best-practices, and webapp-testing as project skills.
- Created skill-gap analysis for missing workflow coverage in commits, deployment, CI/CD, and QA.

Gap analysis reference:
- [.skills/skills-gap-audit.md](../.skills/skills-gap-audit.md)

## Recommended next installs from the gap audit

- github/awesome-copilot@conventional-commit
- addyosmani/agent-skills@ci-cd-and-automation
- wshobson/agents@deployment-pipeline-design
- mattpocock/skills@qa
