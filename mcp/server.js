import http from 'http';
import { URL } from 'url';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const manifestPath = path.join(__dirname, 'manifest.json');
const port = Number(process.env.MCP_PORT || 4000);

function sendJson(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(body, null, 2));
}

function sendText(res, status, text) {
  res.writeHead(status, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(text);
}

function safeFilePath(relativePath) {
  const candidate = path.resolve(rootDir, relativePath);
  if (!candidate.startsWith(rootDir)) {
    throw new Error('Unsafe path access');
  }
  return candidate;
}

async function handleRequest(req, res, manifest) {
  const url = new URL(req.url || '', `http://localhost:${port}`);
  const route = url.pathname.replace(/\/+$/, '');

  if (route === '' || route === '/mcp') {
    return sendJson(res, 200, {
      name: manifest.name,
      version: manifest.version,
      description: manifest.description,
      manifestUrl: '/mcp/manifest',
      healthUrl: '/mcp/ping',
      toolsUrl: '/mcp/tools',
      resourcesUrl: '/mcp/resources',
      promptsUrl: '/mcp/prompts',
      tasksUrl: '/mcp/tasks',
      readFileUrl: '/mcp/read-file?path=workflow/study-notes-inputs.json',
    });
  }

  if (route === '/mcp/manifest') {
    return sendJson(res, 200, manifest);
  }

  if (route === '/mcp/tools') {
    return sendJson(res, 200, manifest.tools);
  }

  if (route === '/mcp/search') {
    const query = url.searchParams.get('q')?.trim();
    if (!query) {
      return sendJson(res, 400, { error: 'Missing required query parameter: q' });
    }
    const files = ['README.md', 'docs/assignments/WORKFLOW.md', 'docs/assignments/STUDY_NOTES_PROMPTS.md', 'workflow/README.md'];
    const results = [];
    for (const file of files) {
      const filePath = safeFilePath(file);
      const content = await fs.readFile(filePath, 'utf8');
      const lower = content.toLowerCase();
      const lowerQuery = query.toLowerCase();
      if (lower.includes(lowerQuery)) {
        results.push({ file, snippet: content.substring(lower.indexOf(lowerQuery), lower.indexOf(lowerQuery) + 200).replace(/\n/g, ' ') });
      }
    }
    return sendJson(res, 200, { query, results });
  }

  if (route === '/mcp/resources') {
    return sendJson(res, 200, manifest.resources);
  }

  if (route === '/mcp/prompts') {
    return sendJson(res, 200, manifest.prompts);
  }

  if (route === '/mcp/tasks') {
    return sendJson(res, 200, manifest.tasks);
  }

  if (route === '/mcp/ping') {
    return sendJson(res, 200, { status: 'ok', port, uptimeSeconds: process.uptime() });
  }

  if (route === '/mcp/read-file') {
    const requested = url.searchParams.get('path');
    if (!requested) {
      return sendJson(res, 400, { error: 'Missing required query parameter: path' });
    }
    try {
      const filePath = safeFilePath(requested);
      const content = await fs.readFile(filePath, 'utf8');
      return sendJson(res, 200, { path: requested, content });
    } catch (error) {
      return sendJson(res, 404, { error: `Unable to read path: ${requested}`, message: error.message });
    }
  }

  return sendJson(res, 404, { error: 'Route not found', route: url.pathname });
}

async function main() {
  const rawManifest = await fs.readFile(manifestPath, 'utf8');
  const manifest = JSON.parse(rawManifest);

  if (process.argv.includes('--check')) {
    console.log('MCP server check passed');
    console.log(`Manifest name: ${manifest.name}`);
    console.log(`Available tools: ${manifest.tools.map((tool) => tool.id).join(', ')}`);
    return;
  }

  const server = http.createServer((req, res) => {
    handleRequest(req, res, manifest).catch((error) => {
      sendJson(res, 500, { error: 'Internal MCP server error', message: error.message });
    });
  });

  server.listen(port, () => {
    console.log(`MCP server running at http://localhost:${port}/mcp`);
    console.log('Manifest endpoint: http://localhost:' + port + '/mcp/manifest');
    console.log('Health endpoint: http://localhost:' + port + '/mcp/ping');
  });
}

main().catch((error) => {
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});
