import { describe, it, expect } from "vitest";
import { FranchiseClient } from "../src/client.js";

describe("FranchiseClient", () => {
  it("provides sandbox mock fallbacks when offline", async () => {
    // Force invalid local port to simulate network failure in sandboxed runner
    const client = new FranchiseClient({
      apiUrl: "http://127.0.0.1:59999/api/mcp",
      timeoutMs: 500,
      maxRetries: 0,
    });

    const res = await client.callTool("search_brands", { query: "taco" });
    expect(res).toBeDefined();
    expect(res.structuredContent).toBeDefined();
    expect(res.structuredContent.total).toBe(1);
    expect(res.structuredContent.brands[0].slug).toBe("tacobell");
  });

  it("handles describe_endpoint offline mock", async () => {
    const client = new FranchiseClient({
      apiUrl: "http://127.0.0.1:59999/api/mcp",
      timeoutMs: 500,
      maxRetries: 0,
    });

    const res = await client.callTool("describe_endpoint", { endpoint: "/api/brands/mcdonalds" });
    expect(res.structuredContent.endpoint).toBe("/api/brands/mcdonalds");
    expect(res.structuredContent.supported_methods).toContain("GET");
  });
});
