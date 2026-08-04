# Capstone Project

A compact React + TypeScript workspace centered on a validated, accessible user settings form.

## Overview

The current project focus is a production-ready form workflow: schema validation, accessible error handling, safe async submission, and test-backed UI behavior.

## Tech Stack

- React 18
- TypeScript
- react-hook-form
- zod
- Vitest
- React Testing Library

## Project Structure

```text
capstone-project/
|-- docs/
|   `-- WORKFLOW.md
|-- src/
|   |-- components/
|   |   |-- __tests__/
|   |   |   `-- UserSettingsForm.test.tsx
|   |   `-- UserSettingsForm.tsx
|   `-- test/
|       `-- setup.ts
|-- CLAUDE.md
|-- package.json
|-- tsconfig.json
`-- vitest.config.ts
```

## Getting Started

### Prerequisites

- Node.js LTS
- npm

### Install

```bash
npm install
```

### Test

```bash
npm test
```

## Notes

- Form validation is defined with `zod` and wired through `react-hook-form`.
- UI behavior is verified with Vitest and React Testing Library.
- Project workflow rules live in `CLAUDE.md`.
