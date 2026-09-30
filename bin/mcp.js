#!/usr/bin/env node

/**
 * franchisedata-mcp
 * Zero-setup stdio Model Context Protocol (MCP) server for franchisedata.io
 * Compatible with Claude Desktop, Cursor, Cline, and autonomous AI agents.
 */

const readline = require("readline");

const API_ENDPOINT = process.env.FRANCHISE_API_URL || "https://franchisedata.io/api/mcp";
const API_KEY = process.env.FRANCHISE_API_KEY || "";

if (process.argv.includes("--version") || process.argv.includes("-v")) {
  console.log("franchisedata-mcp v1.0.0");
  process.exit(0);
}

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(`
franchisedata-mcp - Model Context Protocol (MCP) stdio runner

USAGE:
  npx @outis-co/franchisedata-mcp

ENVIRONMENT VARIABLES:
  FRANCHISE_API_KEY   Optional fc_live_... API key for Pro tier unmasking
  FRANCHISE_API_URL   Custom endpoint (default: https://franchisedata.io/api/mcp)

EXAMPLES:
  # In claude_desktop_config.json:
  {
    "mcpServers": {
      "franchisedata": {
        "command": "npx",
        "args": ["-y", "@outis-co/franchisedata-mcp"],
        "env": {
          "FRANCHISE_API_KEY": "fc_live_your_key_here"
        }
      }
    }
  }
`);
  process.exit(0);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on("line", async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  try {
    const jsonRpcRequest = JSON.parse(trimmed);

    const headers = {
      "Content-Type": "application/json",
      "User-Agent": "franchisedata-mcp/1.0.0",
    };
    if (API_KEY) {
      headers["Authorization"] = `Bearer ${API_KEY}`;
    }

    const res = await fetch(API_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify(jsonRpcRequest),
    });

    const data = await res.json();
    process.stdout.write(JSON.stringify(data) + "\n");
  } catch (err) {
    const errorResponse = {
      jsonrpc: "2.0",
      id: null,
      error: {
        code: -32603,
        message: "Internal franchisedata-mcp bridge error: " + (err?.message || String(err)),
      },
    };
    process.stdout.write(JSON.stringify(errorResponse) + "\n");
  }
});
