import { z } from "zod";
import { ToolDefinition } from "./types.js";

export const catalogTools: ToolDefinition[] = [
  {
    name: "search_brands",
    category: "catalog",
    title: "Search Franchise Brands Catalog",
    description:
      "FREE. Search and discover indexed restaurant brands across the 500 US franchise database by name, concept, sector, or category. Returns matching chains with total unit counts, category classification, and per-call endpoint pricing. Read-only operation requiring no API key or balance. Rate limit: 60 req/min. WHEN TO USE: Use first when discovering brand slugs or verifying if a chain is indexed in the catalog. WHEN NOT TO USE: Do not use for physical store locations (use 'franchise_search_near' or 'mcdonalds_locations'), corporate filings (use 'get_fdd_item19'), or natural language vector searches (use 'semantic_vector_search'). ALTERNATIVES: Use 'semantic_vector_search' for conceptual similarity; use 'describe_endpoint' to inspect route pricing.",
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
      openWorldHint: false,
    },
    inputSchema: {
      query: z
        .string()
        .optional()
        .describe(
          "Case-insensitive search query matching brand name, category, or slug (e.g. 'burger', 'coffee', 'taco', 'subway'). If omitted, returns top brands ordered by fleet size."
        ),
      response_format: z
        .enum(["compact", "full"])
        .optional()
        .default("compact")
        .describe("Output format: 'compact' (default, strips nulls/empty fields) or 'full'."),
    },
    outputSchema: {
      total: z.number().describe("Total matching brands found"),
      brands: z.array(z.any()).describe("List of matching brand summaries with fleet size and API prices"),
    },
  },
  {
    name: "describe_endpoint",
    category: "catalog",
    title: "Describe Endpoint Schema and Pricing",
    description:
      "FREE. Inspect technical documentation, supported query parameters, authentication methods, and per-call pricing for any REST API route on franchisedata.io. Read-only operation requiring no API key or balance. Rate limit: 60 req/min. Returns 404 if the endpoint route is unrecognized. WHEN TO USE: Use before calling 'fetch_franchise_data' to verify required query parameters, authentication headers, and per-request prices. WHEN NOT TO USE: Do not use to fetch actual brand data records; use 'fetch_franchise_data' or specialized shortcut tools instead. ALTERNATIVES: Use 'search_brands' to discover brand slugs; use 'fetch_franchise_data' to execute the request.",
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
      openWorldHint: false,
    },
    inputSchema: {
      endpoint: z
        .string()
        .describe(
          "Target REST API path to inspect (e.g. '/api/brands/mcdonalds/locations', '/api/brands/tacobell/operators')."
        ),
    },
    outputSchema: {
      endpoint: z.string().describe("Requested endpoint path"),
      formats: z.array(z.string()).optional().describe("Supported response formats"),
      supported_methods: z.array(z.string()).describe("Supported HTTP methods"),
      authentication: z.array(z.string()).optional().describe("Accepted authentication headers"),
      pricing: z.string().describe("Per-request pricing description"),
    },
  },
  {
    name: "check_balance",
    category: "catalog",
    title: "Check API Credit Balance",
    description:
      "FREE. Query the remaining prepaid credit balance (in USD and micro-USD) and active status for a FranchiseData Pro API key. Read-only operation requiring an API key passed via 'api_key' argument or 'Authorization: Bearer fc_live_...' header. Returns 400 if key is omitted, or 401 if key is invalid. WHEN TO USE: Use before executing batch paid queries to verify sufficient funds remain. WHEN NOT TO USE: Do not use for minting new keys or topping up funds; use 'topup_credits' instead. ALTERNATIVES: Use 'topup_credits' to deposit credits or create new credentials.",
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
      openWorldHint: false,
    },
    inputSchema: {
      api_key: z
        .string()
        .optional()
        .describe("Optional if Authorization HTTP header is set. The 'fc_live_...' API key to inspect."),
    },
    outputSchema: {
      key_prefix: z.string().optional().describe("First 12 characters of the API key"),
      balance_usd: z.number().describe("Remaining balance in USD"),
      balance_micro: z.number().optional().describe("Remaining balance in micro-USD"),
      is_active: z.boolean().describe("Whether key is active and authorized for queries"),
    },
  },
  {
    name: "topup_credits",
    category: "catalog",
    title: "Mint API Key or Top Up Prepaid Credits",
    description:
      "PAID OPERATION (Test Mode). Mint a new 'fc_live_...' API key with initial prepaid balance, or top up an existing key. Rate limit: 10 req/min. In the current test mode, this credits test USD directly without a live Stripe charge. Stores the API key in the response; save the returned 'fc_live_...' key immediately. WHEN TO USE: Use when setting up a new agent session requiring paid tools, or when 'check_balance' indicates insufficient funds. WHEN NOT TO USE: Do not use to simply check existing balance (use 'check_balance'). ALTERNATIVES: Use 'check_balance' for non-mutating balance queries.",
    annotations: {
      readOnlyHint: false,
      idempotentHint: false,
      openWorldHint: false,
    },
    inputSchema: {
      amount_usd: z
        .number()
        .describe("Amount to deposit in USD (minimum 1.00, maximum 500.00, e.g. 5.00)."),
      api_key: z
        .string()
        .optional()
        .describe(
          "Optional existing 'fc_live_...' key to top up. If omitted, mints and returns a fresh API key."
        ),
    },
    outputSchema: {
      key: z.string().describe("The active 'fc_live_...' API key"),
      success: z.boolean().describe("Whether topup or creation succeeded"),
      message: z.string().describe("Confirmation message"),
      balance_usd: z.number().describe("Updated total balance in USD"),
    },
  },
  {
    name: "fetch_franchise_data",
    category: "catalog",
    title: "Universal Franchise REST Endpoint Runner",
    description:
      "Execute any FranchiseData REST endpoint by path. Inspect endpoints with 'describe_endpoint' first. Automatically checks key balance, debits the per-call price, and returns live JSON records. Requires a valid API key with sufficient funds for paid routes. Free endpoints (such as /api/brands catalog) can be called with no balance. Rate limit: 60 req/min. WHEN TO USE: Use for arbitrary API routes or when a dedicated shortcut tool does not exist. WHEN NOT TO USE: Do not use for McDonald's locations (use 'mcdonalds_locations'), Starbucks status (use 'starbucks_store_status'), or FDD financials (use 'get_fdd_item19'). ALTERNATIVES: Use 'mcdonalds_locations', 'get_fdd_item19', or other specialized tools for faster responses.",
    annotations: {
      readOnlyHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    inputSchema: {
      path: z
        .string()
        .describe(
          "API endpoint route path (e.g. '/api/brands/mcdonalds/locations', '/api/brands/wendys/store/101/status')."
        ),
      params: z
        .record(z.any())
        .optional()
        .describe(
          "Key-value map of URL query parameters (e.g. { 'state': 'CA', 'drive_thru': 'true', 'limit': 10 })."
        ),
      api_key: z
        .string()
        .optional()
        .describe("Optional if Authorization header is set. Your 'fc_live_...' API key."),
    },
    outputSchema: {
      endpoint: z.string().describe("Called API path"),
      data: z.any().describe("Endpoint response payload"),
      balance_remaining_usd: z.number().optional().describe("Remaining balance in USD after debit"),
    },
  },
  {
    name: "semantic_vector_search",
    category: "catalog",
    title: "pgvector Semantic Embeddings Search",
    description:
      "Perform high-dimensional cosine similarity vector search over multi-unit operator entities or canonical menu item descriptions. Powered by pgvector 1536-dimensional OpenAI text-embedding-3-small embeddings. Debits 0.005 USD per query. WHEN TO USE: Use when searching for operators by unstructured profile keywords, multi-brand ownership concepts, or when matching food items conceptually. WHEN NOT TO USE: Do not use for exact brand name or slug lookups (use 'search_brands'). ALTERNATIVES: Use 'search_brands' for exact keyword match; use 'get_operator_intelligence' for direct entity lookups.",
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
      openWorldHint: false,
    },
    inputSchema: {
      query: z
        .string()
        .describe(
          "Natural language query describing desired operator profile or menu concept (e.g. 'Flynn Restaurant Group Applebees', 'spicy chicken sandwich')"
        ),
      type: z
        .enum(["operators", "menu"])
        .optional()
        .default("operators")
        .describe("Vector index target: 'operators' for ownership entities (default) or 'menu' for food items"),
      brand: z
        .string()
        .optional()
        .describe(
          "Optional canonical brand slug to constrain menu search (e.g. 'mcdonalds', 'chickfila'). Only used when type is 'menu'."
        ),
      limit: z
        .number()
        .int()
        .min(1)
        .max(20)
        .optional()
        .default(5)
        .describe("Maximum number of nearest-neighbor results to return (default 5, max 20)"),
    },
    outputSchema: {
      query: z.string().describe("Input search query"),
      type: z.string().describe("Target index queried"),
      brand: z.string().optional().describe("Brand filter applied"),
      results: z.array(z.any()).describe("Matching items ordered by vector similarity"),
      balance_remaining_usd: z.number().optional().describe("Remaining balance in USD"),
    },
  },
];
