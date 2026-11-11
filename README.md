# API Stock MCP server

Generate AI video, images and music from Claude Code, Codex and any
other MCP client. One prepaid balance covers every model in the
[API Stock catalog](https://api-stock.com/models) — Veo, Kling, Seedance,
Seedream, GPT Image, Suno and more.

The server is hosted; there is nothing to install or run. You sign in with
your API Stock account through OAuth in the browser, so no API key ever goes
into a config file.

Tool discovery is public: clients can initialize the connection and list tool
descriptions and input schemas before signing in. Every tool call, including
model browsing, requires OAuth. Clients can start sign-in when a tool call
returns an HTTP 401 challenge, or you can authenticate explicitly during setup.

- Endpoint: `https://api.api-stock.com/mcp` (Streamable HTTP)
- Docs: <https://docs.api-stock.com/docs/mcp>
- Official MCP Registry: `io.github.APIStock/api-stock`

## Connect

### Claude Code

```sh
claude mcp add --transport http api-stock https://api.api-stock.com/mcp
```

Then run `/mcp` inside Claude Code and authenticate in the browser.

Or install it as a plugin from this repository:

```sh
/plugin marketplace add APIStock/api-stock-mcp
/plugin install api-stock@api-stock
```

### Codex

```sh
codex mcp add api-stock --url https://api.api-stock.com/mcp
codex mcp login api-stock
```

`codex mcp login` opens the browser sign-in; run it again whenever Codex
reports the server as unauthenticated.

### Other clients

Compatible clients — remote MCP over Streamable HTTP with OAuth, a loopback
or `https` redirect — connect to `https://api.api-stock.com/mcp`. The server
advertises its authorization server through
`/.well-known/oauth-protected-resource/mcp`. Cursor does not connect yet: its
redirect address uses a custom scheme the authorization server does not
accept.

## Tools

| Tool                | What it does                                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `list_models`       | Browse video, image and music models with their starting price                                                                       |
| `get_model`         | Description, full price table, parameters and an example request                                                                     |
| `estimate_cost`     | Exact price of a request for your account before you run it                                                                          |
| `create_generation` | Start a generation and charge its price to your prepaid balance; optional `maxCostUsd` cap and idempotency key                       |
| `create_upload_url` | Get a signed PUT URL for a reference file; upload the bytes with HTTP PUT, then pass the returned `publicUrl` to `create_generation` |
| `get_task`          | Status and result links; can wait up to 30 seconds for completion                                                                    |
| `list_generations`  | Your recent generations                                                                                                              |
| `get_account`       | Current balance and a top-up link                                                                                                    |

Read-only tools need the `mcp:read` scope; `create_generation` and
`create_upload_url` ask for `mcp:generate`, which lets the client spend your
balance — set `maxCostUsd` to cap a single request. You can revoke a client at any
time in the API Stock dashboard.

## Example

> Make a 5-second vertical video of a paper boat sailing down a rainy street.
> Use the cheapest model that supports 9:16 and keep it under $0.50.

The agent lists models, estimates the cost, starts the generation with a
`maxCostUsd` cap and returns the video link when the task finishes.

## This repository

Configuration only: the Claude Code plugin manifests, the marketplace file
and the MCP Registry records. There is no executable code and no credential.

```sh
node scripts/check.mjs
claude plugin validate --strict .
```

License: MIT.
