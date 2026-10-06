import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: {
      mcp: "src/index.ts",
    },
    format: ["esm"],
    target: "node18",
    outDir: "bin",
    banner: {
      js: "#!/usr/bin/env node",
    },
    clean: false,
    sourcemap: false,
    noExternal: ["@modelcontextprotocol/sdk", "zod"],
  },
  {
    entry: ["src/index.ts", "src/client.ts", "src/transformer.ts"],
    format: ["esm"],
    target: "node18",
    outDir: "dist",
    dts: false,
    clean: false,
  },
]);
