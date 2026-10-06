import { z } from "zod";

export type ToolCategory = "catalog" | "financials" | "locations" | "intelligence";

export interface ToolDefinition {
  name: string;
  category: ToolCategory;
  title: string;
  description: string;
  annotations: {
    readOnlyHint?: boolean;
    idempotentHint?: boolean;
    openWorldHint?: boolean;
  };
  inputSchema: Record<string, z.ZodTypeAny>;
  outputSchema?: Record<string, z.ZodTypeAny>;
}
