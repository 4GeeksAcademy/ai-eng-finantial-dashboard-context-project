# Financial Metrics Dashboard

<!-- hide -->

By [@marcogonzalo](https://github.com/marcogonzalo) and [other contributors](https://github.com/4GeeksAcademy/ai-eng-financial-dashboard-context-project/graphs/contributors) at [4Geeks Academy](https://4geeksacademy.com/)

[![build by developers](https://img.shields.io/badge/build_by-Developers-blue)](https://4geeks.com)
[![4Geeks Academy](https://img.shields.io/twitter/follow/4geeksacademy?style=social&logo=x)](https://x.com/4geeksacademy)

_Estas instrucciones están [disponibles en español](./README.es.md)._

**Before you start**: 📗 [Read the instructions](https://4geeks.com/lesson/how-to-start-a-project) on how to start a coding project.

<!-- endhide -->

---

_Financial metrics dashboard with a React + TypeScript frontend and a FastAPI backend._

## Recommended steps

1. Fork this repository to your account.
2. Open your fork in GitHub Codespaces or clone it and run it in your local environment.
3. Run your AI agent to inspect both frontend and backend.
4. Document the proposed rules and memory bank in your fork.
5. Refine and validate the rules until they fit the project's real workflow.

## Expected agents directory structure

```text
./.agents
└─ /rules
   └─ <rule-name>.md
└─ /skills
   └─ /<skill-name>
      └─ /SKILL.md
```

## How to run locally

```bash
docker compose up --build
```

The frontend uses the Vite proxy for `/api` by default, so no extra environment variables are required in local development or Codespaces.
If you need to target a different backend origin, copy `frontend/.env.example` to `.env` and set `VITE_API_BASE_URL`.

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API documentation: http://localhost:8000/docs

## Repository handover (this fork)

This fork completes the "Building context from an existing project" exercise. The full deliverable is organized as follows:

- **`docs/project-summary.md`** — AI-generated project summary, verified against the actual codebase (Phase 1).
- **`docs/good-bad-practices.md`** — 5 good practices and 5 risks/bad practices found in this repo, with concrete code evidence (Phase 2).
- **`.agents/rules/`** — 5 project-specific rules derived directly from the findings above, each validated against a real task in this repo (Phase 3).
- **`memory-bank/`** — `product-overview.md`, `tech-stack.md`, and `current-status.md`, documenting the project's current state for future contributors or AI agents (Phase 4).

Commit history reflects each phase separately — see `git log` for the full trail.

---

This and many other projects are built by students as part of the [Career Programs](https://4geeksacademy.com/compare-programs) at [4Geeks Academy](https://4geeksacademy.com). By [@marcogonzalo](https://github.com/marcogonzalo) and [other contributors](https://github.com/4GeeksAcademy/ai-eng-financial-dashboard-context-project/graphs/contributors). Find out more about [AI Engineering](https://4geeksacademy.com/en/coding-bootcamps/ai-engineering), [Data Science & Machine Learning](https://4geeksacademy.com/en/coding-bootcamps/data-science-ml), [Cybersecurity](https://4geeksacademy.com/en/coding-bootcamps/cybersecurity) and [Full-Stack Software Developer with AI](https://4geeksacademy.com/en/coding-bootcamps/full-stack-developer).