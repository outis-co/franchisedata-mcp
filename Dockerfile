# Generated for MCP server execution (Glama / Firecracker / Smithery container runner)
FROM node:20-alpine

WORKDIR /app

# Copy package files and MCP runner script
COPY package.json index.js ./
COPY bin/ ./bin/

# Ensure executable permissions
RUN chmod +x bin/mcp.js

ENV NODE_ENV=production

ENTRYPOINT ["node", "bin/mcp.js"]
