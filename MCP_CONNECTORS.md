# GiftConcierge MCP Connector

GiftConcierge includes a stdio Model Context Protocol server at `mcp-server.js`.
Use it from ChatGPT-compatible MCP clients, Gemini/agent clients that support MCP,
Claude Desktop, Cursor, Codex, or any tool that can launch a local stdio MCP server.

## Prerequisites

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- Node.js available on PATH
- A GiftConcierge JWT for tools that read private recipients, occasions, or create orders

## Launch Command

```bash
node D:/corporategifting/mcp-server.js
```

## Environment

```bash
GIFTCONCIERGE_API_URL=http://localhost:8080/api
GIFTCONCIERGE_APP_URL=http://localhost:3000
GIFTCONCIERGE_MCP_KEY=change-this-for-shared-environments
```

## Client Config Example

```json
{
  "mcpServers": {
    "giftconcierge": {
      "command": "node",
      "args": ["D:/corporategifting/mcp-server.js"],
      "env": {
        "GIFTCONCIERGE_API_URL": "http://localhost:8080/api",
        "GIFTCONCIERGE_APP_URL": "http://localhost:3000",
        "GIFTCONCIERGE_MCP_KEY": "change-this-for-shared-environments"
      }
    }
  }
}
```

## Exposed Tools

- `list_gifts`: search catalog by keyword, category, max price, or emotion tag.
- `get_recipients`: list authenticated user recipients.
- `get_occasions`: list authenticated user occasions.
- `get_recommendations`: call the GiftConcierge recommendation engine.
- `place_order`: create a pending order for admin payment verification.

## Exposed Resources

- `giftconcierge://app`: app/backend URLs and connector metadata.
- `giftconcierge://catalog`: live catalog JSON from the backend.
