# Contributing

Thanks for helping improve Mister DJ! This guide explains how to prepare your environment, run quality checks, and craft commits that fit the repository workflow.

## Local environment

### Node.js workspaces

The project uses separate Node.js packages for the frontend (`frontend/`) and the legacy Express backend (`backend/`). Install dependencies for both packages from the repository root:

```bash
npm install
npm --prefix frontend install
npm --prefix backend install
```

### Python services

The FastAPI code under `backend/app/` plus the supporting packages in `packages/` rely on Python 3.11. Install the development dependencies into a virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements-dev.txt
```

The `requirements-dev.txt` file includes the standard runtime dependencies plus tooling such as Ruff and pre-commit.

## Formatting and linting

All pull requests must pass the blocking CI job that runs these commands:

```bash
npm run fmt
npm run lint
ruff format --check .
ruff check .
```

Before opening a PR, run the same commands locally. A few helpful variants are available:

- `npm run fmt:fix` fixes formatting issues with Prettier.
- `npm --prefix frontend run lint -- --fix` applies ESLint autofixes for the Next.js app.
- `npm --prefix backend run lint -- --fix` applies ESLint autofixes for the Express services.
- `ruff format .` and `ruff check . --fix` will reformat and lint the Python codebase.

### Ignored paths

The automated checks intentionally skip generated or placeholder sources such as `backend/app/api/routes/API*_backend_*.py` and `backend/tests/TEST*_testing_*.py`. If you migrate real code into these locations, remove the patterns from `ruff.toml` so that the files participate in linting.

## Commit conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. Each commit message should use the `type(scope): summary` structure, for example:

```
feat(auth): add DJ availability endpoint
fix(frontend): handle missing testimonials copy
chore(ci): bump vitest
```

The summary line should be written in the imperative mood and kept under 72 characters. Include additional detail in the body when necessary.

## Pre-commit hooks (optional)

You can install automated hooks so that the core quality checks run before every commit:

```bash
pip install pre-commit
pre-commit install
```

The bundled `.pre-commit-config.yaml` enables Ruff linting/formatting for Python files and Prettier for JavaScript, TypeScript, CSS, JSON, and Markdown files. Hooks run only on the files you staged for the commit, which keeps feedback fast.

If you prefer Husky for Node-based workflows, feel free to configure it locally. Make sure that any shared hook configuration mirrors the commands listed above so the CI job and developer environments stay aligned.

## Pull request checklist

- [ ] Update or add tests when behaviour changes.
- [ ] Run `npm run fmt`, `npm run lint`, `ruff format --check .`, and `ruff check .`.
- [ ] Confirm that Cypress, unit, and integration suites pass when your change affects runtime logic.
- [ ] Provide screenshots for user-visible UI updates.

Happy shipping! 🎧
