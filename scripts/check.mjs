import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const NAME = "api-stock";
const ENDPOINT = "https://api.api-stock.com/mcp";
const ORGANIZATION = "APIStock";

const root = new URL("../", import.meta.url);
const read = (path) => JSON.parse(readFileSync(new URL(path, root), "utf8"));
const marketplace = read(".claude-plugin/marketplace.json");
assert.equal(marketplace.name, NAME);
assert.deepEqual(
  marketplace.plugins.map((plugin) => plugin.name),
  [NAME],
);
for (const entry of marketplace.plugins) {
  assert.equal(entry.source, `./plugins/${entry.name}`);
  const manifest = read(`plugins/${entry.name}/.claude-plugin/plugin.json`);
  const server = read(`registry/${entry.name}/server.json`);
  assert.equal(manifest.name, entry.name);
  assert.equal(manifest.version, entry.version);
  assert.equal(server.version, manifest.version);
  assert.deepEqual(manifest.mcpServers, {
    [entry.name]: { type: "http", url: ENDPOINT },
  });
  assert.deepEqual(server.remotes, [
    { type: "streamable-http", url: ENDPOINT },
  ]);
  // The registry namespace belongs to this brand's GitHub organization.
  assert.equal(server.name, `io.github.${ORGANIZATION}/${entry.name}`);
  assert.equal(server.websiteUrl, manifest.homepage);
  assert.deepEqual(server.icons, [
    {
      src: "https://api-stock.com/brand/api-stock/icon.svg",
      mimeType: "image/svg+xml",
      sizes: ["any"],
    },
    {
      src: "https://api-stock.com/brand/api-stock/icon-32.png",
      mimeType: "image/png",
      sizes: ["32x32"],
    },
  ]);
  assert.ok(server.description.length <= 100);
  // This public bundle is configuration only: no headers, credentials or executable hooks.
  assert.deepEqual(
    Object.keys(manifest).sort(),
    [
      "author",
      "description",
      "homepage",
      "keywords",
      "license",
      "mcpServers",
      "name",
      "version",
    ].sort(),
  );
}

console.log(`MCP plugin and registry contracts passed for ${NAME}`);
