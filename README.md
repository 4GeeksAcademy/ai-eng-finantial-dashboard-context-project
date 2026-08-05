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

## Required Project Features

This project includes three required features that connect the dashboard UI with the backend metrics API.

### 1. Date Range Filter

- Adds a start and end date filter to dashboard views.
- Dates use YYYY-MM-DD and both values are optional.
- Supports all combinations:
   - no dates: return all available data
   - start only: filter from start date forward
   - end only: filter up to end date
   - both dates: filter between start and end
- Uses backend date filters available on metrics endpoints such as /api/metrics, /api/metrics/summary, /api/metrics/categories/top, and /api/metrics/alerts.

### 2. Anomaly Alerts Table

- Displays anomaly alerts from /api/metrics/alerts.
- Uses threshold to control sensitivity (API default is 0.3 when omitted).
- Each alert row includes:
   - period
   - outcome_total
   - baseline_average
   - increase_ratio
- baseline_average represents the cumulative average of all previous periods, not only the last three periods.

### 3. B2B vs B2C Comparison View

- Compares income-focused results for business types B2B and B2C.
- Applies the same optional date range filters used in the rest of the dashboard.
- Shows top categories and totals for each business type.
- Uses backend endpoints /api/metrics/b2b and /api/metrics/b2c (with operation_type=income when needed for income-only comparisons).

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

---

This and many other projects are built by students as part of the [Career Programs](https://4geeksacademy.com/compare-programs) at [4Geeks Academy](https://4geeksacademy.com). By [@marcogonzalo](https://github.com/marcogonzalo) and [other contributors](https://github.com/4GeeksAcademy/ai-eng-financial-dashboard-context-project/graphs/contributors). Find out more about [AI Engineering](https://4geeksacademy.com/en/coding-bootcamps/ai-engineering), [Data Science & Machine Learning](https://4geeksacademy.com/en/coding-bootcamps/data-science-ml), [Cybersecurity](https://4geeksacademy.com/en/coding-bootcamps/cybersecurity) and [Full-Stack Software Developer with AI](https://4geeksacademy.com/en/coding-bootcamps/full-stack-developer).
