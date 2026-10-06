import { z } from "zod";
import { ToolDefinition } from "./types.js";

export const locationsTools: ToolDefinition[] = [
  {
    name: "mcdonalds_locations",
    category: "locations",
    title: "Query McDonald's Store Locations",
    description:
      "Query verified physical McDonald's restaurants in the United States. Filter by city, two-letter state postal code, five-digit ZIP code, and drive-thru availability. Returns store coordinates, address, phone number, operational features (PlayPlace, McCafé, 24/7 hours), and ownership flag. Debits 0.003 USD per call. Rate limit: 60 req/min. WHEN TO USE: Use for McDonald's physical fleet mapping, competitive site selection, or trade area demographic analysis. WHEN NOT TO USE: Do not use for cross-brand proximity search (use 'franchise_search_near') or real-time Starbucks status (use 'starbucks_store_status'). ALTERNATIVES: Use 'franchise_search_near' for radial search across multiple brands simultaneously.",
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
      openWorldHint: false,
    },
    inputSchema: {
      city: z.string().optional().describe("City name to filter stores by (e.g. 'Chicago', 'Dallas')"),
      state: z.string().optional().describe("Two-letter US state postal code (e.g. 'IL', 'TX', 'CA')"),
      zip: z.string().optional().describe("Five-digit US postal ZIP code (e.g. '60601')"),
      drive_thru: z.boolean().optional().describe("Filter exclusively for stores with verified drive-thru lanes"),
      limit: z
        .number()
        .int()
        .min(1)
        .max(50)
        .optional()
        .default(25)
        .describe("Maximum number of store records to return (default 25, max 50)"),
    },
    outputSchema: {
      brand: z.string().describe("Brand identifier"),
      count: z.number().describe("Number of matching locations returned"),
      locations: z.array(z.any()).describe("List of matching store records"),
      balance_remaining_usd: z.number().optional().describe("Remaining balance in USD"),
    },
  },
  {
    name: "starbucks_store_status",
    category: "locations",
    title: "Real-Time Starbucks Operating Status",
    description:
      "Inspect real-time operational status for a Starbucks store. Returns live open/closed state, current day operating hours, drive-thru status, mobile order & pay availability, and localized features. If store_id is omitted, defaults to the primary indexed flagship unit. Debits 0.003 USD per call. Rate limit: 60 req/min. WHEN TO USE: Use when assessing live operational disruptions, mobile order availability, or verifying store hours. WHEN NOT TO USE: Do not use for general McDonald's queries (use 'mcdonalds_locations') or multi-brand radial search (use 'franchise_search_near'). ALTERNATIVES: Use 'franchise_search_near' for spatial discovery; use 'detect_tech_stack' to inspect in-store ordering systems.",
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
      openWorldHint: false,
    },
    inputSchema: {
      store_id: z
        .string()
        .optional()
        .describe(
          "Optional Starbucks store identifier or store number (e.g. '1033083', 'loc_starbucks_1033083'). If omitted, inspects the first indexed store."
        ),
    },
    outputSchema: {
      store_number: z.string().describe("Starbucks store number"),
      name: z.string().describe("Store common name"),
      address: z.string().describe("Street address"),
      city: z.string().describe("City"),
      state: z.string().describe("Two-letter state postal code"),
      status: z.string().describe("Current operating status (e.g. 'open', 'closed')"),
      hours: z.any().optional().describe("Operating schedule"),
      balance_remaining_usd: z.number().optional().describe("Remaining balance in USD"),
    },
  },
  {
    name: "franchise_search_near",
    category: "locations",
    title: "Radial Cross-Brand Location Proximity Search",
    description:
      "Search for indexed franchise units within a radial distance from geographic GPS coordinates (latitude, longitude). Filterable by category (e.g. 'Burger', 'Coffee', 'Pizza', 'Chicken'). Returns distance in miles, address, brand name, and operating features. Debits 0.005 USD per call. Rate limit: 60 req/min. WHEN TO USE: Use for trade area competitive mapping, co-tenancy analysis, and territory overlap verification. WHEN NOT TO USE: Do not use for non-spatial brand searches (use 'search_brands') or single-brand nationwide queries (use 'mcdonalds_locations'). ALTERNATIVES: Use 'mcdonalds_locations' for McDonald's queries by city/state; use 'search_brands' to discover category concepts.",
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
      openWorldHint: false,
    },
    inputSchema: {
      lat: z.number().describe("Center latitude coordinate in decimal degrees (e.g. 41.8781)"),
      lng: z.number().describe("Center longitude coordinate in decimal degrees (e.g. -87.6298)"),
      radius_miles: z
        .number()
        .min(0.5)
        .max(50)
        .optional()
        .default(10)
        .describe("Search radius in statute miles (default 10, max 50)"),
      category: z
        .string()
        .optional()
        .describe("Optional category filter (e.g. 'Burger', 'Coffee', 'Pizza', 'Chicken')"),
    },
    outputSchema: {
      center: z.any().describe("Center query coordinates and radius"),
      results: z.array(z.any()).describe("List of nearby franchise units sorted by distance"),
      balance_remaining_usd: z.number().optional().describe("Remaining balance in USD"),
    },
  },
];
