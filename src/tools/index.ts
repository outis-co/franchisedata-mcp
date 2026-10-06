import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { FranchiseClient } from "../client.js";
import { ServerConfig } from "../config.js";
import { ToolDefinition } from "./types.js";
import { catalogTools } from "./catalog.js";
import { financialsTools } from "./financials.js";
import { locationsTools } from "./locations.js";
import { intelligenceTools } from "./intelligence.js";

export const allTools: ToolDefinition[] = [
  ...catalogTools,
  ...financialsTools,
  ...locationsTools,
  ...intelligenceTools,
];

/**
 * Filters the active tools according to the configured FRANCHISE_MODE.
 */
export function getActiveTools(mode: ServerConfig["mode"]): ToolDefinition[] {
  switch (mode) {
    case "discovery":
      return catalogTools;
    case "diligence":
      return [...catalogTools, ...financialsTools];
    case "operations":
      return [...catalogTools, ...locationsTools, ...intelligenceTools];
    case "all":
    default:
      return allTools;
  }
}

/**
 * Registers active tools with the McpServer instance.
 */
export function registerAllTools(server: McpServer, client: FranchiseClient, mode: ServerConfig["mode"]): void {
  const tools = getActiveTools(mode);

  for (const tool of tools) {
    server.registerTool(
      tool.name,
      {
        title: tool.title,
        description: tool.description,
        annotations: tool.annotations,
        inputSchema: tool.inputSchema,
        outputSchema: tool.outputSchema,
      },
      async (args: Record<string, unknown>) => {
        const result = await client.callTool(tool.name, args);
        return {
          content: result.content,
          structuredContent: result.structuredContent,
        };
      }
    );
  }
}
