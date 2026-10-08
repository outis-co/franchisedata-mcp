/**
 * franchisedata-mcp
 * Enterprise-grade Model Context Protocol (MCP) server for franchisedata.io
 * 
 * Powered by @modelcontextprotocol/sdk, TypeScript, and Zod.
 * Features automatic token compaction, exponential backoff resilience,
 * and dynamic tool scoping for Claude Desktop, Cursor, and autonomous AI agents.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getConfig } from "./config.js";
import { FranchiseClient } from "./client.js";
import { registerAllTools, getActiveTools } from "./tools/index.js";

async function main() {
  const config = getConfig();

  if (process.argv.includes("--version") || process.argv.includes("-v")) {
    console.log(`franchisedata-mcp v${config.version}`);
    process.exit(0);
  }

  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    const active = getActiveTools(config.mode);
    console.log(`
franchisedata-mcp v${config.version}
Model Context Protocol (MCP) server for franchisedata.io commercial intelligence.

USAGE:
  npx franchisedata-mcp

ENVIRONMENT VARIABLES:
  FRANCHISE_API_KEY     Optional 'fc_live_...' API key for Pro tier unmasking
  FRANCHISE_API_URL     Custom endpoint (default: https://franchisedata.io/api/mcp)
  FRANCHISE_MODE        Tool scoping: 'all' (default), 'discovery', 'diligence', 'operations'
  FRANCHISE_COMPACT     Token optimizer: 'true' (default, saves 40-60% tokens) or 'false'
  FRANCHISE_TIMEOUT_MS  Request timeout in ms (default: 30000)
  FRANCHISE_MAX_RETRIES Max exponential backoff retry attempts (default: 3)

ACTIVE TOOLS (${active.length} loaded in '${config.mode}' mode):
${active.map((t) => `  - ${t.name}: ${t.title}`).join("\n")}

CLIENT CONFIGURATION:
  Claude Desktop (~/Library/Application Support/Claude/claude_desktop_config.json):
  {
    "mcpServers": {
      "franchisedata": {
        "command": "npx",
        "args": ["-y", "franchisedata-mcp"],
        "env": {
          "FRANCHISE_API_KEY": "fc_live_your_key_here",
          "FRANCHISE_MODE": "all"
        }
      }
    }
  }
`);
    process.exit(0);
  }

  const server = new McpServer(
    {
      name: config.serverName,
      version: config.version,
    },
    {
      capabilities: {
        tools: {
          listChanged: false,
        },
      },
    }
  );

  const client = new FranchiseClient(config);
  registerAllTools(server, client, config.mode);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Handle termination signals
  const cleanup = async () => {
    try {
      await server.close();
    } catch {
      // Ignore closing errors on shutdown
    }
    process.exit(0);
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
}

main().catch((error) => {
  console.error("Fatal franchisedata-mcp error:", error);
  process.exit(1);
});
