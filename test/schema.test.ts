import { describe, it, expect } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { allTools, getActiveTools, registerAllTools } from "../src/tools/index.js";
import { FranchiseClient } from "../src/client.js";

describe("Tool Definitions & TDQS Quality Standards", () => {
  it("defines exactly 17 tools in total", () => {
    expect(allTools.length).toBe(17);
  });

  it("filters correctly by FRANCHISE_MODE", () => {
    expect(getActiveTools("discovery").length).toBe(6);
    expect(getActiveTools("diligence").length).toBe(10);
    expect(getActiveTools("operations").length).toBe(13);
    expect(getActiveTools("all").length).toBe(17);
  });

  it("satisfies strict Glama TDQS documentation requirements for every tool", () => {
    for (const tool of allTools) {
      expect(tool.name).toMatch(/^[a-z0-9_]+$/);
      expect(tool.title).toBeDefined();
      expect(tool.title.length).toBeGreaterThan(5);

      // TDQS requires clear WHEN TO USE / WHEN NOT TO USE / ALTERNATIVES
      expect(tool.description).toContain("WHEN TO USE:");
      expect(tool.description).toContain("WHEN NOT TO USE:");
      expect(tool.description).toContain("ALTERNATIVES:");

      // Annotations
      expect(tool.annotations).toBeDefined();
      expect(typeof tool.annotations.readOnlyHint).toBe("boolean");
      expect(typeof tool.annotations.idempotentHint).toBe("boolean");
      expect(typeof tool.annotations.openWorldHint).toBe("boolean");

      // Input and output schema
      expect(tool.inputSchema).toBeDefined();
      expect(tool.outputSchema).toBeDefined();
    }
  });

  it("serializes valid JSON Schema across all tools in MCP tools/list", async () => {
    const server = new McpServer({ name: "franchisedata.io", version: "1.1.0" });
    const client = new FranchiseClient({ maxRetries: 0 });
    registerAllTools(server, client, "all");

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await server.connect(serverTransport);

    const mcpClient = new Client({ name: "test-client", version: "1.0.0" });
    await mcpClient.connect(clientTransport);

    const list = await mcpClient.listTools();
    expect(list.tools.length).toBe(17);

    for (const tool of list.tools) {
      expect(tool.inputSchema).toBeDefined();
      expect(tool.inputSchema.type).toBe("object");
      expect(tool.outputSchema).toBeDefined();
      expect(tool.outputSchema?.type).toBe("object");
      expect(tool.annotations).toBeDefined();
    }

    await mcpClient.close();
    await server.close();
  });
});
