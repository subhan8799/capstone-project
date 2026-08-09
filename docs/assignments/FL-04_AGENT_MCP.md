# FL-04 Agent & MCP Assignment Documentation

## Current repository status: workflow, not agent

This FL-04 repository is currently structured as a workflow rather than a runtime agent. The evidence is clear:

- The repository contains `docs/assignments` and `workflow/` artifacts that document how to run study-note generation and prompt iteration.
- There is a helper script (`workflow/generate-study-notes-run.js`) and placeholder input data (`workflow/study-notes-inputs.json`) for generating templates.
- There is no existing MCP manifest, no tool server, and no runtime agent entrypoint before this change.

That means the project is already a documented workflow: it guides a person or a tool through steps, but it does not yet expose a live agent interface with tool/resource access.

## Why FL-04 is a workflow

A workflow is a documented sequence of tasks, tools, and handoffs.

This repository already describes a workflow in the form of:

- prompt templates for study notes (`docs/assignments/STUDY_NOTES_PROMPTS.md`)
- a workflow narrative and lessons learned (`docs/assignments/WORKFLOW.md`)
- a script to scaffold study-note runs (`workflow/generate-study-notes-run.js`)
- checklist-style guidance in `workflow/README.md`

Those artifacts make FL-04 a process-focused submission. It is not yet an agent because there is no connected tool runtime that an MCP-enabled model can query and use dynamically.

## What was added

To move FL-04 toward agent capability with minimal risk, this repository now includes:

- `mcp/server.js`: a lightweight local MCP server
- `mcp/manifest.json`: a manifest describing tools, resources, prompts, and tasks
- `mcp/README.md`: documentation for the MCP server and endpoints
- new package scripts:
  - `npm run mcp:start`
  - `npm run mcp:check`
  - `npm run workflow:study-notes`
- root README updates with MCP and agent guidance
- a dedicated assignment document for FL-04 agent/MCP reasoning and checklist

## Agent, workflow, and MCP — a 700+ word explainer

Agents, workflows, and MCP are related but distinct concepts.

A workflow is a deliberate set of steps designed to solve a problem. In this repository, the workflow is the set of study-note prompts, helper scripts, and documentation that tell a human or an LLM how to proceed. The current repo workflow is explicit, with several files dedicated to instructions, prompt patterns, and artifact generation.

An agent is a piece of software that can act autonomously or semi-autonomously in service of a task. Agents usually have a reasoning layer (often a language model), plus a collection of tools that let them inspect code, run commands, or update files. In the context of a repository, an agent is the runtime participant that `does` the work rather than just describing it.

The Model Context Protocol (MCP) is a way to describe that runtime capability. It is a manifest format and a set of conventions that tell the agent:

- what tools are available
- what resources exist
- what prompts or instructions to use
- how tasks should be broken down

Adding MCP support means giving the agent a reliable way to discover the repository's capabilities and safely access files or services.

For FL-04, the transition from workflow to agent begins with a local server that exposes a manifest and a small, concrete toolset. That server does not need to be full-featured to count as MCP integration: it simply needs to let a model know what it can do, what docs are available, and how to reach them.

In practical terms, the new `mcp` integration in this repository does that by exposing:

- `repo_file_reader`: a tool that can safely read repository files under the project root
- `repo_search`: a query-style tool for discovering docs and configuration references
- `server_health`: a simple health-check tool so the agent knows the server is alive
- assignment documentation resources, including `docs/assignments` and `README.md`
- prompt skeletons that show how to ask the agent to inspect the repo and generate updates

This combination is the minimal agent runtime needed to make FL-04 more than a static workflow. The current repo still contains the workflow artifacts, but the new MCP server makes those artifacts discoverable to a model at runtime.

Turning FL-04 fully into an agent would involve one more step: connecting the MCP manifest and tool server to a model execution environment. In this repository, that could mean using a compatible agent runner or a hosted platform that understands the MCP manifest and calls the `/mcp/read-file` endpoint when the model asks to inspect a file.

Once the agent can use those tools, the repository could support tasks like "audit the login form for accessibility issues," "generate a release-ready README," or "update the workflow docs after a code change." That is a different mode than the existing workflow, because the agent can now act on the repository directly rather than only describing what to do.

The distinction is important:

- A workflow is a plan.
- An agent is a capable actor.
- MCP is the contract between the actor and the repository.

In the case of FL-04, this repository was already a good workflow. The new MCP files mean it is now also an agent-capable repo by providing a manifest, a server, and tool/resource declarations.

## One concrete agent upgrade proposal for FL-04

Proposal: build a `MiniFlix Code Steward` agent that uses the local MCP manifest and server to do three things:

1. Audit the codebase for missing validation and accessibility issues in form components.
2. Run `npm run lint` and `npm run typecheck` and summarize any findings.
3. Update `README.md` and `docs/assignments/FL-04_AGENT_MCP.md` with the exact commands, evidence checklist, and task status.

This agent would use the `repo_file_reader` tool for reading relevant files, the `repo_search` resource for locating docs and workflow files, and the `server_health` tool to verify connectivity before it starts.

A first agent release would not write code automatically. Instead, it would produce a patch plan and identify the exact files to edit. A later upgrade could add a safe file-write tool and a test runner tool.

## Three real MCP tasks for this assignment

### 1. Repository state audit

Task: Confirm whether FL-04 is currently a workflow, an agent, or both.

Tool access needed:

- `repo_file_reader` to inspect `package.json`, `README.md`, and `docs/assignments/WORKFLOW.md`
- `repo_search` to find existing prompt templates and workflow artifacts
- `assignment_docs` resource for context on project structure

### 2. README and setup update

Task: Add MCP instructions to the root README and document how to start the server.

Tool access needed:

- `repo_file_reader` to read current README sections
- `repo_search` for terms like `npm run dev`, `npm run typecheck`, and `workflow:study-notes`
- `workflow_helper` resource to confirm the script path and output behavior

### 3. Evidence checklist and agent proposal

Task: Produce a checklist for manual verification, including screenshot items and manual assignment steps.

Tool access needed:

- `repo_file_reader` to inspect the new `mcp/README.md` and `docs/assignments/FL-04_AGENT_MCP.md`
- `assignment_docs` resource to align the checklist with existing docs and the assignment rubric
- `server_health` tool to verify the MCP endpoint is reachable

## Setup instructions and status

1. Install dependencies:

```bash
npm install --legacy-peer-deps
```

2. Start the app:

```bash
npm run dev
```

3. Start the MCP server:

```bash
npm run mcp:start
```

4. Validate the MCP manifest:

```bash
npm run mcp:check
```

5. Generate a study-notes workflow template if needed:

```bash
npm run workflow:study-notes
```

## Screenshot / evidence checklist

- [ ] Capture the running app at `http://localhost:5173` or the Vite dev URL
- [ ] Capture the MCP server health endpoint at `http://localhost:4000/mcp/ping`
- [ ] Capture the manifest endpoint at `http://localhost:4000/mcp/manifest`
- [ ] Capture `README.md` with the new MCP section visible
- [ ] Capture `docs/assignments/FL-04_AGENT_MCP.md` or `mcp/README.md` as supporting evidence

## Remaining manual steps

- Add actual TMDB and Firebase values to `.env` for local app testing
- Optionally run a compatible agent platform against `http://localhost:4000/mcp/manifest`
- Capture the screenshots listed in the evidence checklist
