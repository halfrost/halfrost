#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";

const outDir = new URL(".", import.meta.url).pathname;

const openAiAppIcon = "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/chatgpt-icon.svg";
const powerAutomateLogo = "https://upload.wikimedia.org/wikipedia/commons/4/4d/Microsoft_Power_Automate.svg";

const entries = [
  ["llm/openai-gpt", "OpenAI GPT", ["asset:ChatGPT app icon|https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/chatgpt-icon.svg", "iconify:logos:openai-icon", "site:https://openai.com"]],
  ["llm/anthropic-claude", "Anthropic Claude", ["iconify:logos:claude-icon", "iconify:logos:anthropic-icon", "site:https://claude.ai", "site:https://www.anthropic.com"]],
  ["llm/google-gemini", "Google Gemini", ["iconify:logos:google-gemini", "site:https://gemini.google.com"]],
  ["llm/meta-llama", "Meta Llama", ["iconify:logos:meta-icon", "site:https://www.llama.com", "site:https://ai.meta.com/llama"]],
  ["llm/mistral-ai", "Mistral AI", ["iconify:logos:mistral-ai-icon", "site:https://mistral.ai"]],
  ["llm/cohere", "Cohere", ["asset:Cohere official nav icon|https://cohere.com/nav_icon.svg", "asset:Cohere official wordmark|https://cohere.com/logo.svg", "site:https://cohere.com"]],
  ["llm/hugging-face", "Hugging Face", ["iconify:logos:hugging-face-icon", "site:https://huggingface.co"]],
  ["llm/ollama", "Ollama", ["iconify:devicon:ollama", "site:https://ollama.com"]],
  ["llm/vllm", "vLLM", ["asset:vLLM official docs logo|https://docs.vllm.ai/en/latest/assets/logos/vllm-logo-text-light.png", "site:https://docs.vllm.ai", "site:https://vllm.ai"]],

  ["agentic-ai/langgraph", "LangGraph", ["asset:LangGraph official SVG|https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/698b2b268612e91affecd414_Frame%202147254720.svg", "site:https://www.langchain.com/langgraph", "site:https://langchain-ai.github.io/langgraph"]],
  ["agentic-ai/crewai", "CrewAI", ["asset:CrewAI logo image|https://upload.wikimedia.org/wikipedia/en/3/37/CrewAI_logo.png", "site:https://www.crewai.com"]],
  ["agentic-ai/microsoft-autogen", "Microsoft AutoGen", ["asset:Microsoft AutoGen official docs logo|https://microsoft.github.io/autogen/stable/_static/logo.svg", "site:https://microsoft.github.io/autogen/stable", "iconify:logos:microsoft-icon"]],
  ["agentic-ai/microsoft-agent-framework", "Microsoft Agent Framework", ["iconify:logos:microsoft-icon", "site:https://learn.microsoft.com/en-us/agent-framework"]],
  ["agentic-ai/llamaindex-workflows", "LlamaIndex Workflows", ["site:https://www.llamaindex.ai"]],
  ["agentic-ai/aws-strands-agents", "AWS Strands Agents", ["site:https://strandsagents.com", "iconify:logos:aws"]],
  ["agentic-ai/camel", "CAMEL", ["asset:CAMEL official logo|https://www.camel-ai.org/logo/camel.png", "site:https://www.camel-ai.org", "iconify:logos:apache-camel"]],
  ["agentic-ai/agno", "Agno", ["asset:Agno official logo|https://cdn.prod.website-files.com/6796d350b8c706e4533e7e32/6796d350b8c706e4533e8011_Agno%20Logo.png", "site:https://www.agno.com"]],

  ["rag/langchain", "LangChain", ["asset:LangChain official SVG|https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/698b2b26acc19233c104b1cd_logo.svg", "site:https://www.langchain.com"]],
  ["rag/llamaindex", "LlamaIndex", ["site:https://www.llamaindex.ai"]],
  ["rag/haystack", "Haystack", ["asset:Haystack official docs SVG|https://raw.githubusercontent.com/deepset-ai/haystack/main/docs-website/static/img/logo.svg", "asset:Haystack official logo|https://haystack.deepset.ai/images/logos/haystack.png", "site:https://haystack.deepset.ai", "site:https://www.deepset.ai"]],
  ["rag/dspy", "DSPy", ["asset:DSPy official SVG|https://dspy.ai/static/dspy-logo.svg", "site:https://dspy.ai"]],
  ["rag/ragflow", "RAGFlow", ["site:https://ragflow.io"]],
  ["rag/graphrag", "GraphRAG", ["iconify:logos:microsoft-icon", "site:https://microsoft.github.io/graphrag"]],
  ["rag/unstructured", "Unstructured", ["asset:Unstructured official repo logo|https://raw.githubusercontent.com/Unstructured-IO/unstructured/main/img/unstructured_logo.png", "site:https://unstructured.io"]],
  ["rag/embedchain", "EmbedChain", ["asset:EmbedChain official site favicon|https://framerusercontent.com/images/8dbfJC1gGsafWsBmX5emgbJvEIE.png", "asset:EmbedChain official site wordmark (white)|https://framerusercontent.com/images/kTZfBxX59gtMr9hWjfNjMUb5PU.png", "site:https://embedchain.ai", "site:https://mem0.ai"]],

  ["embedding/openai-embeddings", "OpenAI Embeddings", [`asset:ChatGPT app icon|${openAiAppIcon}`, "iconify:logos:openai-icon", "site:https://openai.com"]],
  ["embedding/cohere-embed", "Cohere Embed", ["asset:Cohere official nav icon|https://cohere.com/nav_icon.svg", "asset:Cohere official wordmark|https://cohere.com/logo.svg", "site:https://cohere.com"]],
  ["embedding/voyage-ai", "Voyage AI", ["site:https://www.voyageai.com"]],
  ["embedding/sentence-transformers", "Sentence Transformers", ["asset:Sentence Transformers official logo|https://sbert.net/_static/logo.png", "site:https://sbert.net"]],
  ["embedding/bge", "BGE", ["asset:BGE official repo logo|https://raw.githubusercontent.com/FlagOpen/FlagEmbedding/master/imgs/bge_logo.jpg", "site:https://www.baai.ac.cn", "site:https://bge-model.com"]],
  ["embedding/google-vertex-ai-embeddings", "Google Vertex AI Embeddings", ["iconify:logos:google-cloud", "site:https://cloud.google.com/vertex-ai"]],
  ["embedding/azure-openai-embeddings", "Azure OpenAI Embeddings", ["iconify:logos:microsoft-azure", "site:https://azure.microsoft.com"]],

  ["mcp/mcp-sdk", "MCP SDK", ["asset:MCP official favicon SVG|https://raw.githubusercontent.com/modelcontextprotocol/modelcontextprotocol/main/docs/favicon.svg", "asset:MCP official light SVG|https://raw.githubusercontent.com/modelcontextprotocol/modelcontextprotocol/main/docs/logo/light.svg", "site:https://modelcontextprotocol.io"]],
  ["mcp/fastmcp", "FastMCP", ["asset:FastMCP official SVG icon|https://raw.githubusercontent.com/PrefectHQ/fastmcp/main/docs/assets/brand/favicon-light.svg", "site:https://gofastmcp.com"]],
  ["mcp/mcp-registry", "MCP Registry", ["asset:MCP official favicon SVG|https://raw.githubusercontent.com/modelcontextprotocol/modelcontextprotocol/main/docs/favicon.svg", "asset:MCP official light SVG|https://raw.githubusercontent.com/modelcontextprotocol/modelcontextprotocol/main/docs/logo/light.svg", "site:https://modelcontextprotocol.io"]],
  ["mcp/github-mcp-server", "GitHub MCP Server", ["iconify:logos:github-icon", "site:https://github.com"]],
  ["mcp/slack-mcp-server", "Slack MCP Server", ["iconify:logos:slack-icon", "site:https://slack.com"]],
  ["mcp/postgresql-mcp-server", "PostgreSQL MCP Server", ["iconify:logos:postgresql", "site:https://www.postgresql.org"]],
  ["mcp/google-drive-mcp-server", "Google Drive MCP Server", ["iconify:logos:google-drive", "site:https://drive.google.com"]],
  ["mcp/filesystem-mcp-server", "Filesystem MCP Server", ["asset:MCP official favicon SVG|https://raw.githubusercontent.com/modelcontextprotocol/modelcontextprotocol/main/docs/favicon.svg", "asset:MCP official light SVG|https://raw.githubusercontent.com/modelcontextprotocol/modelcontextprotocol/main/docs/logo/light.svg", "site:https://modelcontextprotocol.io"]],

  ["ai-security/nvidia-nemo-guardrails", "NVIDIA NeMo Guardrails", ["iconify:logos:nvidia", "site:https://www.nvidia.com"]],
  ["ai-security/guardrails-ai", "Guardrails AI", ["asset:Guardrails AI official SVG|https://raw.githubusercontent.com/guardrails-ai/guardrails/main/docs/assets/Guardrails-ai-logo-for-white-bg.svg", "asset:Guardrails AI official mark|https://raw.githubusercontent.com/guardrails-ai/guardrails/main/docs/assets/logo.svg", "site:https://www.guardrailsai.com"]],
  ["ai-security/microsoft-presidio", "Microsoft Presidio", ["iconify:logos:microsoft-icon", "site:https://microsoft.github.io/presidio"]],
  ["ai-security/lakera-guard", "Lakera Guard", ["asset:Lakera official black symbol|https://cdn.prod.website-files.com/65080baa3f9a607985451de3/6526f98447db0b4b7b22493e_Lakera-Symbol-Black-256.png", "asset:Lakera official SVG icon (white)|https://cdn.prod.website-files.com/65080baa3f9a607985451de3/6629151b183092ad09978db1_lakera%20logo%20icon.svg", "site:https://www.lakera.ai"]],
  ["ai-security/prompt-security", "Prompt Security", ["asset:Prompt Security official repo SVG icon|https://raw.githubusercontent.com/prompt-security/ps-fuzz/main/resources/prompt-icon.svg", "site:https://www.prompt.security"]],
  ["ai-security/protect-ai", "Protect AI", ["asset:Protect AI official wordmark|https://protectai.com/hs-fs/hubfs/unnamed-2.png?width=510&name=unnamed-2.png", "asset:Protect AI official lockup SVG|https://protectai.com/hubfs/Palo%20Alto%20Networks%20x%20Protect%20AI-logo%20lockup-full%20color-dark.svg", "site:https://protectai.com"]],
  ["ai-security/azure-ai-content-safety", "Azure AI Content Safety", ["iconify:logos:microsoft-azure", "site:https://azure.microsoft.com"]],
  ["ai-security/aws-bedrock-guardrails", "AWS Bedrock Guardrails", ["iconify:logos:aws", "site:https://aws.amazon.com/bedrock"]],

  ["observability/langsmith", "LangSmith", ["asset:LangSmith official SVG|https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/698afeb61612bb3b1af6e9ee_Frame%202147254707.svg", "site:https://www.langchain.com/langsmith", "site:https://smith.langchain.com"]],
  ["observability/langfuse", "Langfuse", ["asset:Langfuse official wordart SVG|https://langfuse.com/langfuse-wordart.svg", "site:https://langfuse.com"]],
  ["observability/arize-phoenix", "Arize Phoenix", ["asset:Phoenix official repo logo|https://raw.githubusercontent.com/Arize-ai/phoenix/main/docs/logo/dark.png", "site:https://phoenix.arize.com", "site:https://arize.com"]],
  ["observability/weights-biases-weave", "Weights & Biases Weave", ["asset:Weights & Biases official SVG|https://site.wandb.ai/wp-content/uploads/2023/05/wb-cw.svg", "site:https://wandb.ai"]],
  ["observability/trulens", "TruLens", ["site:https://www.trulens.org"]],
  ["observability/ragas", "Ragas", ["asset:Ragas official docs SVG|https://raw.githubusercontent.com/vibrantlabsai/ragas/main/docs/_static/imgs/logo-black.svg", "asset:Ragas official docs PNG|https://raw.githubusercontent.com/vibrantlabsai/ragas/main/docs/_static/imgs/ragas-logo.png", "site:https://www.ragas.io", "site:https://docs.ragas.io"]],
  ["observability/promptfoo", "Promptfoo", ["asset:Promptfoo official panda logo|https://www.promptfoo.dev/img/logo-panda.svg", "site:https://www.promptfoo.dev"]],
  ["observability/helicone", "Helicone", ["site:https://www.helicone.ai"]],

  ["memory/mem0", "Mem0", ["site:https://mem0.ai"]],
  ["memory/zep", "Zep", ["asset:Zep official SVG icon|https://raw.githubusercontent.com/getzep/zep/main/assets/zep-logo-icon-gradient-rgb.svg", "asset:Zep official lockup SVG|https://www.getzep.com/zep-logo-lockup-daisy-bush-rgb.svg", "site:https://www.getzep.com"]],
  ["memory/letta", "Letta", ["asset:Letta official repo logo|https://raw.githubusercontent.com/letta-ai/letta/main/assets/Letta-logo-RGB_GreyonTransparent_cropped_small.png", "site:https://www.letta.com"]],
  ["memory/langgraph-memory", "LangGraph Memory", ["asset:LangGraph official SVG|https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/698b2b268612e91affecd414_Frame%202147254720.svg", "site:https://www.langchain.com/langgraph", "site:https://langchain-ai.github.io/langgraph"]],
  ["memory/redis", "Redis", ["iconify:logos:redis", "site:https://redis.io"]],
  ["memory/postgresql", "PostgreSQL", ["iconify:logos:postgresql", "site:https://www.postgresql.org"]],
  ["memory/neo4j", "Neo4j", ["iconify:logos:neo4j", "site:https://neo4j.com"]],
  ["memory/chroma", "Chroma", ["iconify:logos:chroma", "site:https://www.trychroma.com"]],

  ["ai-agent/openai-agents-sdk", "OpenAI Agents SDK", [`asset:ChatGPT app icon|${openAiAppIcon}`, "iconify:logos:openai-icon", "site:https://openai.com"]],
  ["ai-agent/langchain-agents", "LangChain Agents", ["asset:LangChain official SVG|https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/698b2b26acc19233c104b1cd_logo.svg", "site:https://www.langchain.com"]],
  ["ai-agent/pydantic-ai", "PydanticAI", ["asset:PydanticAI official light-background SVG|https://raw.githubusercontent.com/pydantic/pydantic-ai/main/docs/img/pydantic-ai-light.svg", "asset:PydanticAI official dark-background SVG|https://raw.githubusercontent.com/pydantic/pydantic-ai/main/docs/img/pydantic-ai-dark.svg", "site:https://ai.pydantic.dev", "site:https://pydantic.dev"]],
  ["ai-agent/semantic-kernel", "Semantic Kernel", ["iconify:logos:microsoft-icon", "site:https://learn.microsoft.com/en-us/semantic-kernel"]],
  ["ai-agent/google-adk", "Google ADK", ["iconify:logos:google-icon", "site:https://google.github.io/adk-docs"]],
  ["ai-agent/aws-bedrock-agents", "AWS Bedrock Agents", ["iconify:logos:aws", "site:https://aws.amazon.com/bedrock"]],
  ["ai-agent/azure-ai-foundry-agent-service", "Azure AI Foundry Agent Service", ["iconify:logos:microsoft-azure", "site:https://ai.azure.com"]],

  ["automation/n8n", "n8n", ["iconify:devicon:n8n-wordmark", "site:https://n8n.io"]],
  ["automation/zapier", "Zapier", ["iconify:logos:zapier", "site:https://zapier.com"]],
  ["automation/make", "Make", ["asset:Make primary logo from official brand guidelines|https://upload.wikimedia.org/wikipedia/commons/e/ec/Make_Logo.png", "asset:Make official apple-touch icon|https://www.make.com/apple-touch-icon.png", "site:https://www.make.com"]],
  ["automation/microsoft-power-automate", "Microsoft Power Automate", [`asset:Microsoft Power Automate SVG|${powerAutomateLogo}`, "site:https://powerautomate.microsoft.com"]],
  ["automation/temporal", "Temporal", ["site:https://temporal.io"]],
  ["automation/apache-airflow", "Apache Airflow", ["iconify:logos:airflow-icon", "iconify:devicon:apacheairflow", "site:https://airflow.apache.org"]],
  ["automation/prefect", "Prefect", ["asset:Prefect official SVG mark|https://raw.githubusercontent.com/PrefectHQ/prefect/main/ui/src/assets/logos/prefect-logo-mark-gradient.svg", "asset:Prefect official wordmark SVG|https://raw.githubusercontent.com/PrefectHQ/prefect/main/docs/logos/logo-wordmark-dark.svg", "asset:Prefect official favicon|https://www.prefect.io/favicon.ico", "site:https://www.prefect.io"]],
  ["automation/kestra", "Kestra", ["site:https://kestra.io"]],
  ["automation/pipedream", "Pipedream", ["iconify:logos:pipedream", "site:https://pipedream.com"]],

  ["vector-database/pinecone", "Pinecone", ["iconify:logos:pinecone-icon", "asset:Pinecone official site logo|https://www.pinecone.io/images/Pinecone-Logo-Black.png", "site:https://www.pinecone.io"]],
  ["vector-database/weaviate", "Weaviate", ["asset:Weaviate official 2026 logo|https://weaviate.io/img/site/2026/weaviate-logo-2-colours-dark-green.svg", "site:https://weaviate.io"]],
  ["vector-database/qdrant", "Qdrant", ["iconify:logos:qdrant-icon", "site:https://qdrant.tech"]],
  ["vector-database/milvus", "Milvus", ["iconify:logos:milvus-icon", "site:https://milvus.io"]],
  ["vector-database/chroma", "Chroma", ["iconify:logos:chroma", "site:https://www.trychroma.com"]],
  ["vector-database/pgvector", "pgvector", ["iconify:logos:postgresql", "site:https://pgvector.org"]],
  ["vector-database/elasticsearch", "Elasticsearch", ["iconify:logos:elasticsearch", "site:https://www.elastic.co/elasticsearch"]],
  ["vector-database/redis", "Redis", ["iconify:logos:redis", "site:https://redis.io"]],
  ["vector-database/mongodb-atlas-vector-search", "MongoDB Atlas Vector Search", ["iconify:logos:mongodb-icon", "site:https://www.mongodb.com/products/platform/atlas-vector-search"]],
];

const contentTypeExt = new Map([
  ["image/svg+xml", ".svg"],
  ["image/png", ".png"],
  ["image/jpeg", ".jpg"],
  ["image/webp", ".webp"],
  ["image/x-icon", ".ico"],
  ["image/vnd.microsoft.icon", ".ico"],
]);

function parseCandidate(candidate) {
  if (candidate.startsWith("iconify:")) {
    const [, prefix, name] = candidate.match(/^iconify:([^:]+):(.+)$/) ?? [];
    return {
      kind: "Iconify color SVG",
      source: `${prefix}:${name}`,
      url: `https://api.iconify.design/${prefix}:${name}.svg`,
      ext: ".svg",
    };
  }

  if (candidate.startsWith("asset:")) {
    const rest = candidate.slice("asset:".length);
    const splitAt = rest.indexOf("|");
    return {
      kind: "Official/direct asset",
      source: rest.slice(0, splitAt),
      url: rest.slice(splitAt + 1),
    };
  }

  if (candidate.startsWith("google-favicon:")) {
    const site = candidate.slice("google-favicon:".length);
    return {
      kind: "Google favicon from official domain",
      source: site,
      url: `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(site)}&sz=512`,
      ext: ".png",
    };
  }

  if (candidate.startsWith("site:")) {
    const site = candidate.slice("site:".length);
    return {
      kind: "Official site icon",
      source: site,
      site,
    };
  }

  throw new Error(`Unknown candidate: ${candidate}`);
}

async function fetchBuffer(url) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: { "user-agent": "halfrost-ai-color-logo-refresh/2.0" },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 128) {
    throw new Error(`too small (${buffer.length} bytes)`);
  }
  return { response, buffer };
}

function extensionFor(url, contentType, buffer, forcedExt) {
  if (forcedExt) return forcedExt;
  const isSvg = buffer.subarray(0, 1024).toString("utf8").includes("<svg");
  const urlExt = extname(new URL(url).pathname);
  return contentTypeExt.get(contentType) || (isSvg ? ".svg" : "") || urlExt || ".png";
}

function assertImage(contentType, buffer) {
  const head = buffer.subarray(0, 1024).toString("utf8");
  const isSvg = head.includes("<svg");
  if (!isSvg && !contentType?.startsWith("image/")) {
    throw new Error(`not an image (${contentType ?? "unknown content type"})`);
  }
}

function iconScore(icon) {
  let score = 0;
  const rel = icon.rel.toLowerCase();
  const href = icon.href.toLowerCase();
  if (href.endsWith(".svg")) score += 10000;
  if (rel.includes("apple-touch")) score += 800;
  if (rel.includes("mask-icon")) score -= 5000;
  if (href.includes("favicon")) score += 200;
  if (href.includes("logo")) score += 400;
  const sizes = [...icon.raw.matchAll(/(\d+)x(\d+)/gi)]
    .map((match) => Number(match[1]) * Number(match[2]))
    .sort((a, b) => b - a);
  score += Math.min(sizes[0] ?? 0, 512 * 512) / 100;
  if (href.endsWith(".ico")) score -= 100;
  return score;
}

async function discoverSiteIcon(site) {
  const { response, buffer } = await fetchBuffer(site);
  const html = buffer.toString("utf8");
  const base = response.url;
  const icons = [];
  const linkRegex = /<link\b[^>]*>/gi;
  const attrRegex = /\b([a-zA-Z:-]+)\s*=\s*["']([^"']+)["']/g;

  for (const [raw] of html.matchAll(linkRegex)) {
    const attrs = {};
    for (const [, name, value] of raw.matchAll(attrRegex)) {
      attrs[name.toLowerCase()] = value;
    }
    const rel = attrs.rel ?? "";
    const href = attrs.href ?? "";
    if (!href || !/icon|apple-touch/i.test(rel)) continue;
    if (/manifest|shortcut/i.test(href)) continue;
    icons.push({ rel, href: new URL(href, base).toString(), raw });
  }

  icons.push({ rel: "favicon", href: new URL("/favicon.ico", base).toString(), raw: "favicon.ico" });
  icons.sort((a, b) => iconScore(b) - iconScore(a));

  const errors = [];
  for (const icon of icons.slice(0, 8)) {
    try {
      const downloaded = await downloadUrl(icon.href, "Official site icon", site);
      return { ...downloaded, source: `${site} (${icon.rel})` };
    } catch (error) {
      errors.push(`${icon.href}: ${error.message}`);
    }
  }

  try {
    return await downloadUrl(
      `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(site)}&sz=512`,
      "Google favicon from official domain",
      site,
      ".png",
    );
  } catch (error) {
    errors.push(`google favicon: ${error.message}`);
  }

  throw new Error(errors.join(" | ") || "no site icon found");
}

async function downloadUrl(url, kind, source, forcedExt) {
  const { response, buffer } = await fetchBuffer(url);
  const contentType = response.headers.get("content-type")?.split(";")[0].trim();
  assertImage(contentType, buffer);
  const ext = extensionFor(response.url, contentType, buffer, forcedExt);
  return {
    kind,
    source,
    url,
    finalUrl: response.url,
    ext,
    buffer,
    bytes: buffer.length,
    contentType,
  };
}

async function download(candidate) {
  const item = parseCandidate(candidate);
  if (item.site) {
    return discoverSiteIcon(item.site);
  }
  return downloadUrl(item.url, item.kind, item.source, item.ext);
}

async function main() {
  const manifest = [];
  let ok = 0;
  let failed = 0;

  for (const [pathBase, label, candidates] of entries) {
    let result;
    const errors = [];

    for (const candidate of candidates) {
      try {
        result = await download(candidate);
        break;
      } catch (error) {
        errors.push(`${candidate}: ${error.message}`);
      }
    }

    if (!result) {
      failed += 1;
      manifest.push({ label, path: "", status: "missing", errors });
      console.error(`MISS ${label}: ${errors.join(" | ")}`);
      continue;
    }

    const filePath = join(outDir, `${pathBase}${result.ext}`);
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, result.buffer);
    ok += 1;
    manifest.push({
      label,
      path: `${pathBase}${result.ext}`,
      status: "downloaded",
      source: result.source,
      kind: result.kind,
      url: result.url,
      finalUrl: result.finalUrl,
      bytes: result.bytes,
      contentType: result.contentType,
    });
    console.log(`OK   ${label} -> ${pathBase}${result.ext} (${result.kind}: ${result.source})`);
  }

  const lines = [
    "# AI Ecosystem Color Logos",
    "",
    "Downloaded as color product/logo assets wherever available. The downloader avoids GitHub avatars and avoids monochrome Simple Icons as primary sources; fallback site icons are discovered from each project's official domain.",
    "",
    `Total entries: ${entries.length}`,
    `Downloaded: ${ok}`,
    `Missing: ${failed}`,
    "",
    "| Label | File | Source | Type | Bytes |",
    "| --- | --- | --- | --- | ---: |",
    ...manifest.map((item) => {
      if (item.status !== "downloaded") {
        return `| ${item.label} | missing | ${item.errors.join("<br>")} | missing | 0 |`;
      }
      return `| ${item.label} | \`${item.path}\` | ${item.source} | ${item.kind} | ${item.bytes} |`;
    }),
    "",
  ];
  await writeFile(join(outDir, "MANIFEST.md"), lines.join("\n"));
  await writeFile(join(outDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
