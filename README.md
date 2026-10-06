# @outis-co/franchisedata-mcp

[![npm version](https://img.shields.io/badge/npm-v1.1.0-blue)](https://www.npmjs.com/package/@outis-co/franchisedata-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Glama](https://glama.ai/mcp/servers/outis-co/franchisedata-mcp/badges/score.svg)](https://glama.ai/mcp/servers/outis-co/franchisedata-mcp)
[![MCP Tools](https://img.shields.io/badge/MCP-17%20Tools-purple)](https://franchisedata.io/api/mcp)
[![Chains](https://img.shields.io/badge/Chains-500%20US%20Chains-emerald)](https://franchisedata.io/brands)
[![Locations](https://img.shields.io/badge/Locations-210%2C484%20Verified-blue)](https://franchisedata.io)

Official **Model Context Protocol (MCP)** server for [franchisedata.io](https://franchisedata.io) — the commercial intelligence gateway for restaurant franchise location data, in-store POS hardware fingerprints, statutory FDD Item 19 unit economics, and multi-unit franchisee ownership trees.

Powered by the official `@modelcontextprotocol/sdk` (TypeScript + Zod) with built-in **token compaction**, **dynamic tool scoping**, and **exponential backoff resilience**.

Compatible with **Claude Desktop**, **Cursor**, **Zed**, **Cline**, and autonomous AI agent runtimes.

---

## 🚀 Quick Install

### 1. Claude Desktop (via Smithery)
```bash
npx -y @smithery/cli install @outis-co/franchisedata-mcp --client claude
```

### 2. Claude Desktop (`claude_desktop_config.json`)

#### Remote Streamable HTTP (Zero Local Dependencies)
```json
{
  "mcpServers": {
    "franchisedata": {
      "url": "https://franchisedata.io/mcp",
      "headers": {
        "Authorization": "Bearer fc_live_optional_pro_key"
      }
    }
  }
}
```

#### Local CLI Runner (via npx)
```json
{
  "mcpServers": {
    "franchisedata": {
      "command": "npx",
      "args": ["-y", "@outis-co/franchisedata-mcp"],
      "env": {
        "FRANCHISE_API_KEY": "fc_live_optional_pro_key",
        "FRANCHISE_MODE": "all"
      }
    }
  }
}
```

### 3. Cursor
In Cursor Settings -> Features -> MCP Servers -> Add New MCP Server:
* **Name**: `franchisedata`
* **Type**: `command`
* **Command**: `npx -y @outis-co/franchisedata-mcp`

---

## ⚡ Agent Experience (AX) & Token Optimization

### Dynamic Tool Scoping (`FRANCHISE_MODE`)
Prevent LLM context window bloat by loading only the tools relevant to your agent's current objective:

| Mode | Tools Loaded | Best For |
| :--- | :--- | :--- |
| `FRANCHISE_MODE=discovery` | 6 tools | Brand discovery, catalog lookups, and endpoint exploration. Minimal token footprint (~1,200 tokens). |
| `FRANCHISE_MODE=diligence` | 10 tools | Underwriting, commercial due diligence, FDD Item 19 analysis, and operator portfolios. |
| `FRANCHISE_MODE=operations`| 13 tools | Store-level operations, POS hardware fingerprints, aggregator visibility, and live status. |
| `FRANCHISE_MODE=all` *(default)* | 17 tools | Full comprehensive franchise commercial intelligence suite. |

### Automatic Response Compaction
By default (`FRANCHISE_COMPACT=true`), responses recursively prune `null` attributes, empty arrays, and extraneous internal SQLite keys, saving **40% to 60% of agent context tokens** while preserving 100% of financial figures, unit counts, coordinates, and operational facts.

### Network Resilience
Built-in exponential backoff retry (1s, 2s, 4s with random jitter) on HTTP 429 rate limits or 5xx server errors, backed by a 30-second abort timeout.

---

## 🛠️ Registered MCP Tools (17 Grade A Tools)

Every tool provides strict Zod input validation, typed `outputSchema`, MCP behavioral annotations (`readOnlyHint`, `idempotentHint`), and explicit disambiguation boundaries (`WHEN TO USE` / `WHEN NOT TO USE` / `ALTERNATIVES`).

| Tool Name | Type | Category | Description |
| :--- | :--- | :--- | :--- |
| `search_brands` | FREE | Catalog | Search all 500 indexed chains by concept, sector, or category. |
| `describe_endpoint` | FREE | Catalog | Inspect schema, parameters, and pricing for any REST API endpoint. |
| `check_balance` | FREE | Catalog | Read-only check of remaining credit balance in USD. |
| `topup_credits` | State-Mutating | Catalog | Mint a new API key ($1.00 min) or top up prepaid credits. |
| `fetch_franchise_data` | Universal | Catalog | Parameterized runner calling any REST endpoint when dedicated tool is not present. |
| `semantic_vector_search` | PAID ($0.005) | Catalog | pgvector cosine similarity search across multi-unit operators and menu items. |
| `get_fdd_item19` | PAID ($0.010) | Financials | Statutory Item 19 AUV quartiles, royalty fee %, and EBITDA benchmarks. |
| `get_operator_intelligence`| PAID ($0.005) | Financials | Multi-unit franchisee holding LLCs, PE backing, and store fleet counts. |
| `track_brand_changes` | PAID ($0.003) | Financials | Real-time audit log of store openings, permanent closures, and fleet relocations. |
| `get_menu_pricing` | PAID ($0.003) | Financials | Localized menu item pricing, national benchmarks, and price variance analysis. |
| `mcdonalds_locations` | PAID ($0.003) | Locations | Fast lookup of McDonald's stores with drive-thru, 24h, and PlayPlace filters. |
| `starbucks_store_status` | PAID ($0.002) | Locations | Real-time operating hours, active open/closed status, and store features. |
| `franchise_search_near` | PAID ($0.005) | Locations | Radial cross-brand coordinate search (up to 50 miles) for open restaurant locations. |
| `detect_tech_stack` | PAID ($0.003) | Intelligence | Fingerprint POS (Toast, Aloha, Brink), KDS, and online ordering gateways. |
| `get_local_share_of_choice`| PAID ($0.005) | Intelligence | Hyperlocal digital shelf observations across DoorDash, Uber Eats, and 1P web. |
| `get_weekly_scorecard` | PAID ($0.010) | Intelligence | Standardized 6-Question Weekly Operating Review Scorecard for store diagnostics. |
| `recommend_local_action` | PAID ($0.005) | Intelligence | Margin-guardrailed tactical interventions with holdout test design. |

---

## ⚙️ Environment Variables

| Variable | Default | Description |
| :--- | :--- | :--- |
| `FRANCHISE_API_KEY` | `""` | Optional `fc_live_...` API key for Pro tier unmasking. Get one at [franchisedata.io/topup](https://franchisedata.io/topup). |
| `FRANCHISE_API_URL` | `https://franchisedata.io/api/mcp` | Upstream JSON-RPC endpoint. |
| `FRANCHISE_MODE` | `all` | Scoping mode: `all`, `discovery`, `diligence`, `operations`. |
| `FRANCHISE_COMPACT` | `true` | Toggles automatic null-pruning and token reduction. |
| `FRANCHISE_TIMEOUT_MS`| `30000` | HTTP request timeout in milliseconds. |
| `FRANCHISE_MAX_RETRIES`| `3` | Maximum exponential backoff retry attempts. |

---

## 📄 License

MIT © [Outis Co](https://franchisedata.io)
