import { z } from "zod";
import { ToolDefinition } from "./types.js";

export const financialsTools: ToolDefinition[] = [
  {
    name: "get_fdd_item19",
    category: "financials",
    title: "Statutory FDD Item 19 Unit Economics",
    description:
      "Query statutory Franchise Disclosure Document (FDD) Item 19 financial performance representations for any indexed brand. Returns audited historical unit economics including median AUV (Average Unit Volume), top/bottom quartile breakdowns, franchisee EBITDA margins, initial franchise fees, ongoing royalty rates, and advertising fund contributions. Debits 0.005 USD per call. Rate limit: 60 req/min. WHEN TO USE: Use during commercial due diligence, underwriting, investment analysis, or competitive benchmarking. WHEN NOT TO USE: Do not use for physical store locations (use 'franchise_search_near') or operator entity lookups (use 'get_operator_intelligence'). ALTERNATIVES: Use 'get_operator_intelligence' to evaluate franchisee holding companies; use 'track_brand_changes' for net unit growth trends.",
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
      openWorldHint: false,
    },
    inputSchema: {
      brand: z
        .string()
        .describe("Canonical brand slug (e.g. 'chickfila', 'mcdonalds', 'wendys', 'culvers', 'popeyes')"),
      response_format: z
        .enum(["compact", "full"])
        .optional()
        .default("compact")
        .describe("Output format: 'compact' (default, strips nulls/empty fields) or 'full'."),
    },
    outputSchema: {
      brand: z.string().describe("Canonical brand slug"),
      fdd_item19: z.any().describe("Audited Item 19 financial tables, AUV, and fees"),
      balance_remaining_usd: z.number().optional().describe("Remaining balance in USD"),
    },
  },
  {
    name: "get_operator_intelligence",
    category: "financials",
    title: "Multi-Unit Franchisee Ownership Intelligence",
    description:
      "Query multi-unit franchisee ownership portfolios, holding company entities, private equity backing, and operational scale. Supports direct lookup by operator ID (e.g. 'op_flynn_group') or discovery by brand and store. Reveals whether a location is corporate-owned or franchised, the controlling operator's total multi-brand unit count, and portfolio diversification. Debits 0.005 USD per call. Rate limit: 60 req/min. WHEN TO USE: Use when analyzing franchisee consolidation, identifying private equity rollup targets, or evaluating counterparty risk for commercial real estate leasing. WHEN NOT TO USE: Do not use for menu pricing (use 'get_menu_pricing') or tech stack audits (use 'detect_tech_stack'). ALTERNATIVES: Use 'detect_tech_stack' to inspect store-level hardware; use 'get_fdd_item19' for brand-wide statutory financials.",
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
      openWorldHint: false,
    },
    inputSchema: {
      operator_id: z
        .string()
        .optional()
        .describe(
          "Direct operator entity ID (e.g. 'op_flynn_group'). Provide this OR provide both 'brand' and 'store_id'."
        ),
      brand: z
        .string()
        .optional()
        .describe(
          "Canonical brand slug (e.g. 'tacobell', 'applebees', 'wendys'). Used when querying by store."
        ),
      store_id: z
        .string()
        .optional()
        .describe("Store ID (e.g. 'loc_tacobell_1001') to look up controlling franchisee."),
    },
    outputSchema: {
      operator: z.any().optional().describe("Operator profile when queried by operator_id"),
      operators: z.array(z.any()).optional().describe("List of matching operators"),
      balance_remaining_usd: z.number().optional().describe("Remaining balance in USD"),
    },
  },
  {
    name: "track_brand_changes",
    category: "financials",
    title: "Track Fleet Openings, Closures, and Relocations",
    description:
      "Monitor brand expansion and contraction velocity across the US. Returns chronological log of recent store openings, permanent closures, relocations, and net fleet change metrics over trailing 30, 90, and 365-day windows. Debits 0.004 USD per call. Rate limit: 60 req/min. WHEN TO USE: Use to track franchise system health, early warning signs of distress (accelerating closures), or aggressive regional rollout campaigns. WHEN NOT TO USE: Do not use for static store location lists (use 'franchise_search_near' or 'mcdonalds_locations'). ALTERNATIVES: Use 'get_weekly_scorecard' for single-store weekly operational trends; use 'get_fdd_item19' for statutory 3-year turnover tables.",
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
      openWorldHint: false,
    },
    inputSchema: {
      brand: z
        .string()
        .describe("Canonical brand slug (e.g. 'subway', 'boston-market', 'hardees', 'starbucks')"),
      event_type: z
        .enum(["opening", "closure", "relocation"])
        .optional()
        .describe("Optional event filter: 'opening', 'closure', or 'relocation'"),
    },
    outputSchema: {
      brand: z.string().describe("Canonical brand slug"),
      changes: z.array(z.any()).describe("Chronological event log of store openings, closures, and relocations"),
      balance_remaining_usd: z.number().optional().describe("Remaining balance in USD"),
    },
  },
  {
    name: "get_menu_pricing",
    category: "financials",
    title: "Retrieve Store Menu Pricing and Price Variance",
    description:
      "Inspect localized menu item pricing, combo meal options, calorie counts, and premium tier price variations for a specific franchise location. Useful for analyzing franchisee pricing freedom, local price elasticity, and market-level inflation variance. Debits 0.003 USD per call. Rate limit: 60 req/min. WHEN TO USE: Use for localized price intelligence, competitive menu comparisons, or margin compression analysis. WHEN NOT TO USE: Do not use for broad catalog queries (use 'search_brands'). ALTERNATIVES: Use 'get_fdd_item19' for statutory system-wide sales representations; use 'get_local_share_of_choice' for delivery marketplace pricing.",
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
      openWorldHint: false,
    },
    inputSchema: {
      brand: z
        .string()
        .describe("Canonical brand slug (e.g. 'mcdonalds', 'chipotle', 'subway')"),
      store_id: z
        .string()
        .describe("Store ID or store number to query localized prices for (e.g. 'loc_mcdonalds_1001')"),
    },
    outputSchema: {
      store_id: z.string().describe("Store identifier"),
      brand: z.string().describe("Canonical brand slug"),
      items: z.array(z.any()).describe("List of menu items with localized prices and calories"),
      balance_remaining_usd: z.number().optional().describe("Remaining balance in USD"),
    },
  },
];
