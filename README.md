# @outis-co/franchisedata-mcp

[![npm version](https://img.shields.io/badge/npm-v1.0.0-blue)](https://www.npmjs.com/package/@outis-co/franchisedata-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP Tools](https://img.shields.io/badge/MCP-17%20Tools-purple)](https://franchisedata.io/api/mcp)
[![Chains](https://img.shields.io/badge/Chains-500%20US%20Chains-emerald)](https://franchisedata.io/brands)
[![Locations](https://img.shields.io/badge/Locations-210%2C484%20Verified-blue)](https://franchisedata.io)

Official **Model Context Protocol (MCP)** server for [franchisedata.io](https://franchisedata.io) — the commercial intelligence gateway for restaurant franchise location data, in-store POS hardware fingerprints, statutory FDD Item 19 unit economics, and multi-unit franchisee ownership trees.

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
        "FRANCHISE_API_KEY": "fc_live_optional_pro_key"
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

## 🛠️ Registered MCP Tools (17 Tools)

| Tool Name | Type | Description |
| :--- | :--- | :--- |
| `search_brands` | FREE | Search all 500 indexed chains by category and pricing. |
| `describe_endpoint` | FREE | Schema and parameter documentation for any endpoint. |
| `check_balance` | FREE | Check remaining credit balance on an API key. |
| `topup_credits` | FREE | Mint a new API key or top up prepaid credits. |
| `mcdonalds_locations` | PAID ($0.003) | Fast lookup of McDonald's stores with drive-thru filters. |
| `starbucks_store_status` | PAID ($0.002) | Real-time operating hours and open/closed status. |
| `franchise_search_near` | PAID ($0.005) | Radial cross-brand search for open restaurant locations. |
| `detect_tech_stack` | PAID ($0.003) | Fingerprint POS (Toast, Aloha, Brink), KDS, and ordering gateways. |
| `get_operator_intelligence`| PAID ($0.005) | Multi-unit franchisee holding LLCs, executives, and unit counts. |
| `get_fdd_item19` | PAID ($0.010) | Statutory Item 19 AUV quartiles, royalty fee %, and investment. |
| `get_menu_pricing` | PAID ($0.003) | Local item pricing, national benchmarks, and price variance. |
| `track_brand_changes` | PAID ($0.003) | Real-time store openings, closures, and fleet relocations. |
| `get_local_share_of_choice`| PAID ($0.005) | Hyperlocal digital shelf observations (DoorDash, Uber Eats). |
| `get_weekly_scorecard` | PAID ($0.010) | 6-Question Weekly Operating Review Scorecard for a store. |
| `recommend_local_action` | PAID ($0.005) | Margin-guardrailed tactical local actions with matched holdout. |
| `semantic_vector_search` | PAID ($0.005) | pgvector semantic embeddings search across operators and menus. |
| `fetch_franchise_data` | Universal | Universal runner calling any REST endpoint with typed parameters. |

---

## 🔑 Authentication & Free Usage

* Free tools (`search_brands`, `describe_endpoint`, `check_balance`, `topup_credits`) require **no API key**.
* For paid data unmasking, mint a prepaid API key starting at \$1.00 at [https://franchisedata.io/topup](https://franchisedata.io/topup) or provide `FRANCHISE_API_KEY=fc_live_...`.

---

## 📄 License

MIT © [Outis Co](https://franchisedata.io)
