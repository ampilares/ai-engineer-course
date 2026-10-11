"""Read-only classroom MCP example; no authentication or production identity service.

Install the official `mcp` Python SDK in an isolated environment and record its version.
Launch with that environment's Python executable through an MCP client using stdio.
Reference: https://github.com/modelcontextprotocol/python-sdk
"""
import json
import re
from pathlib import Path
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Harbour approved analyst policy")
CORPUS = Path(__file__).resolve().parent.parent / "case-study" / "knowledge.json"
AS_OF = "2026-10-08"


@mcp.tool()
def search_policy(query: str) -> str:
    """Search policy effective on the fixed classroom date with analyst access only."""
    if not query.strip() or len(query) > 500:
        return json.dumps({"error": "Provide a query between 1 and 500 characters"})
    terms = set(re.findall(r"[a-z0-9]+", query.lower()))
    documents = json.loads(CORPUS.read_text(encoding="utf-8"))
    results = []
    for doc in documents:
        if "analyst" not in doc["roles"] or doc["status"] not in ("approved", "retired"):
            continue
        if doc["effective_from"] > AS_OF or (doc["effective_to"] and doc["effective_to"] < AS_OF):
            continue
        score = sum(term in (doc["title"] + " " + doc["text"]).lower() for term in terms)
        if score:
            results.append({"id": doc["id"], "text": doc["text"], "score": score})
    results.sort(key=lambda item: (-item["score"], item["id"]))
    return json.dumps({"as_of": AS_OF, "results": results[:3]})


if __name__ == "__main__":
    mcp.run(transport="stdio")
