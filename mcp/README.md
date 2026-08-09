# MCP Server for MiniFlix FL-04

This repository now includes a minimal local MCP integration.

## What this does

- Serves a local manifest at `http://localhost:4000/mcp/manifest`
- Exposes a simple tool set for repository-aware tasks
- Publishes assignment resources and sample prompts
- Supports a lightweight `--check` mode to verify the manifest and server startup

## How to run

From the project root:

```bash
npm run mcp:start
```

Or run directly:

```bash
node mcp/server.js
```

The MCP server listens on port `4000` by default. Use `MCP_PORT=5000 npm run mcp:start` to override.

## Endpoints

- `GET /mcp` — manifest summary and endpoint list
- `GET /mcp/manifest` — full manifest JSON
- `GET /mcp/tools` — available tool definitions
- `GET /mcp/resources` — declared resources
- `GET /mcp/prompts` — sample prompt recipes
- `GET /mcp/tasks` — documented MCP tasks
- `GET /mcp/ping` — health check
- `GET /mcp/read-file?path=relative/path` — read a safe file under project root

## Notes

- This server is intentionally small and local. No secrets or third-party API keys are included.
- The manifest is stored in `mcp/manifest.json`.
- The server supports `--check` mode for quick validation:

```bash
npm run mcp:check
```
