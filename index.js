/**
 * @outis-co/franchisedata-mcp
 * Commercial intelligence gateway for 500 US restaurant franchise chains.
 */

const tools = require("./lib/tools.json");

module.exports = {
  version: "1.0.2",
  endpoint: "https://franchisedata.io/api/mcp",
  tools: tools.map((t) => t.name),
  toolDefinitions: tools,
};
