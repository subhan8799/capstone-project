# CLAUDE.md

## Project Context

This repository is a capstone project scaffold.
Current phase focuses on setup quality, commit hygiene, and documentation-first workflow.

## Stack

- Node.js LTS
- npm
- GitHub
- VS Code

## Coding Conventions

- Follow Conventional Commits for all commits.
- Prefer small, focused changes.
- Keep README and setup docs up to date.
- Use descriptive naming for files, variables, and scripts.

## Terminal Conventions

- Use `npm` scripts for repeatable tasks.
- Add scripts to `package.json` as features are introduced.

## AI Assistant Expectations

- Propose minimal, reversible changes.
- Explain why changes are needed.
- Keep code and docs aligned.

## Lessons & Workflow Rules

- Forms: All forms must use `react-hook-form` paired with `zod` schemas; uncontrolled standard HTML inputs are prohibited.
- Accessibility: Every input element must have an associated `<label>` element, and active validation errors must toggle `aria-invalid="true"` and set `aria-describedby`.
- Verification: Every newly created UI component must include a corresponding unit test file covering primary user interaction and error states before merging.
