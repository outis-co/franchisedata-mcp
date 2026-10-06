import { z } from "zod";
import { ToolDefinition } from "./types.js";

export const intelligenceTools: ToolDefinition[] = [
  {
    name: "detect_tech_stack",
    category: "intelligence",
    title: "Detect In-Store POS and Kitchen Tech Stack",
    description:
      "Fingerprint store-level technology deployments for a specific franchise location. Identifies point-of-sale hardware (Toast, NCR Aloha, Brink, ParTech, Oracle MICROS), kitchen display systems (KDS), digital payment terminals, drive-thru timer systems, and online ordering integrations. Debits 0.005 USD per call. Rate limit: 60 req/min. WHEN TO USE: Use during technology vendor competitive intelligence, B2B restaurant tech sales prospecting, or enterprise system rollout tracking. WHEN NOT TO USE: Do not use for financial performance (use 'get_fdd_item19') or multi-unit operator queries (use 'get_operator_intelligence'). ALTERNATIVES: Use 'get_operator_intelligence' to evaluate the franchisee controlling the store; use 'get_weekly_scorecard' for store operating health.",
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
      openWorldHint: false,
    },
    inputSchema: {
      brand: z
        .string()
        .describe("Canonical brand slug (e.g. 'chickfila', 'sweetgreen', 'subway', 'mcdonalds')"),
      store_id: z
        .string()
        .describe("Unique store number or store ID (e.g. 'loc_subway_1001')"),
    },
    outputSchema: {
      tech_stack: z.any().describe("Detected POS, KDS, hardware, and payment processor details"),
      balance_remaining_usd: z.number().optional().describe("Remaining balance in USD"),
    },
  },
  {
    name: "get_local_share_of_choice",
    category: "intelligence",
    title: "Hyperlocal Digital Shelf Share of Choice",
    description:
      "Inspect hyperlocal delivery marketplace competitive dynamics (DoorDash, UberEats, first-party web) for a specific store. Returns observational market share of consumer choice, focal delivered basket price vs top rival, active competitor promo badges, and cross-daypart visibility. Debits 0.005 USD per call. Rate limit: 60 req/min. WHEN TO USE: Use to identify local delivery margin leaks, aggressive aggregator discounting by rivals, or digital shelf displacement. WHEN NOT TO USE: Do not use for broad catalog queries (use 'search_brands') or physical GPS search (use 'franchise_search_near'). ALTERNATIVES: Use 'get_weekly_scorecard' for weekly unit operating health; use 'recommend_local_action' for automated corrective pricing actions.",
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
      openWorldHint: false,
    },
    inputSchema: {
      store_id: z.string().describe("Target store ID (e.g. 'loc_mcdonalds_1001')"),
      platform: z
        .enum(["doordash", "ubereats", "first_party"])
        .optional()
        .describe("Optional delivery platform filter: 'doordash', 'ubereats', or 'first_party'"),
      daypart: z
        .enum(["lunch", "dinner", "late_night"])
        .optional()
        .describe("Optional daypart filter: 'lunch', 'dinner', or 'late_night'"),
    },
    outputSchema: {
      store_id: z.string().describe("Target store identifier"),
      total_observations: z.number().describe("Total market observations sampled"),
      focal_delivered_total_usd: z.number().describe("Focal store delivered basket price"),
      top_rival_delivered_total_usd: z.number().describe("Top rival delivered basket price"),
      rival_brand: z.string().describe("Dominant competing brand in trade area"),
      rival_promo_badge: z.string().optional().describe("Active promotional badge displayed by rival"),
      observations: z.array(z.any()).describe("List of granular observation points"),
      balance_remaining_usd: z.number().optional().describe("Remaining balance in USD"),
    },
  },
  {
    name: "get_weekly_scorecard",
    category: "intelligence",
    title: "Weekly Operating Review Store Scorecard",
    description:
      "Retrieve a structured store operating scorecard answering the 6 core executive questions: (1) What changed, (2) Why did it change, (3) Competitor moves, (4) Fact vs inference audit, (5) Recommended action, (6) Holdout evaluation. Evaluates weekly unit volume, customer friction, aggregator commission drag, and labor cost ratios. Debits 0.005 USD per call. Rate limit: 60 req/min. WHEN TO USE: Use during weekly executive franchise operating reviews or automated store management reporting. WHEN NOT TO USE: Do not use for long-term historical FDD trends (use 'get_fdd_item19') or brand-wide expansion tracking (use 'track_brand_changes'). ALTERNATIVES: Use 'recommend_local_action' to immediately execute an intervention; use 'get_local_share_of_choice' for marketplace share.",
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
      openWorldHint: false,
    },
    inputSchema: {
      store_id: z.string().describe("Target store ID or store number (e.g. 'loc_mcdonalds_1001')"),
      week: z
        .string()
        .optional()
        .describe(
          "Optional week identifier in ISO format (e.g. '2026-W36'). If omitted, defaults to the most recent week."
        ),
    },
    outputSchema: {
      store_id: z.string().describe("Store identifier"),
      week: z.string().describe("Operating week evaluated"),
      question_1_what_changed: z.string().describe("Summary of week-over-week performance delta"),
      question_2_why_did_it_change: z.string().describe("Root cause diagnosis"),
      question_3_competitor_moves: z.string().describe("Observed local competitor activity"),
      question_4_fact_vs_inference: z.string().describe("Epistemic audit separating verified data from estimates"),
      question_5_recommended_action: z.string().describe("Specific operational or pricing intervention"),
      question_6_holdout_evaluation: z.string().describe("A/B holdout test framework to measure lift"),
      balance_remaining_usd: z.number().optional().describe("Remaining balance in USD"),
    },
  },
  {
    name: "recommend_local_action",
    category: "intelligence",
    title: "Recommend Margin-Guardrailed Local Action",
    description:
      "Generate an automated, margin-guardrailed tactical intervention for a specific franchise unit based on real-time competitor pricing and digital shelf visibility. Actions include dynamic surge pricing offsets, aggregator ad boost toggles, promo match overrides, or labor reallocation. Guarantees that recommended actions do not violate store gross margin thresholds. Debits 0.005 USD per call. Rate limit: 60 req/min. WHEN TO USE: Use when an autonomous agent needs to make an automated operational or pricing decision for a restaurant unit. WHEN NOT TO USE: Do not use for read-only status checks (use 'get_weekly_scorecard'). ALTERNATIVES: Use 'get_weekly_scorecard' for broader diagnostic context; use 'get_local_share_of_choice' for marketplace raw data.",
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
      openWorldHint: false,
    },
    inputSchema: {
      store_id: z
        .string()
        .describe("Target store ID to evaluate tactical recommendations for (e.g. 'loc_mcdonalds_1001')"),
    },
    outputSchema: {
      store_id: z.string().describe("Evaluated store ID"),
      status: z.string().describe("Status of recommendation engine ('action_recommended' or 'hold')"),
      recommended_action: z.any().describe("Concrete tactical intervention details and expected margin impact"),
      epistemic_foundation: z.any().describe("Audit trail of inputs justifying the action"),
      balance_remaining_usd: z.number().optional().describe("Remaining balance in USD"),
    },
  },
];
