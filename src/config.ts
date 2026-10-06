export interface ServerConfig {
  apiKey: string;
  apiUrl: string;
  mode: "all" | "discovery" | "diligence" | "operations";
  compact: boolean;
  timeoutMs: number;
  maxRetries: number;
  version: string;
  serverName: string;
}

export function getConfig(): ServerConfig {
  const modeEnv = (process.env.FRANCHISE_MODE || "all").toLowerCase();
  const validModes: ServerConfig["mode"][] = ["all", "discovery", "diligence", "operations"];
  const mode = validModes.includes(modeEnv as ServerConfig["mode"])
    ? (modeEnv as ServerConfig["mode"])
    : "all";

  return {
    apiKey: process.env.FRANCHISE_API_KEY || "",
    apiUrl: process.env.FRANCHISE_API_URL || "https://franchisedata.io/api/mcp",
    mode,
    compact: process.env.FRANCHISE_COMPACT !== "false", // default: true
    timeoutMs: parseInt(process.env.FRANCHISE_TIMEOUT_MS || "30000", 10),
    maxRetries: parseInt(process.env.FRANCHISE_MAX_RETRIES || "3", 10),
    version: "1.1.0",
    serverName: "franchisedata.io",
  };
}
