#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { inflateRawSync } from "node:zlib";

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
  ["agentic-ai/deep-agents", "Deep Agents", ["asset:LangChain official SVG for Deep Agents|https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/698b2b26acc19233c104b1cd_logo.svg", "site:https://docs.langchain.com/oss/python/deepagents/overview", "site:https://www.langchain.com"]],
  ["agentic-ai/smolagents", "Hugging Face smolagents", ["iconify:logos:hugging-face-icon", "site:https://huggingface.co/docs/smolagents"]],
  ["agentic-ai/ag2", "AG2", ["site:https://docs.ag2.ai", "site:https://ag2.ai"]],
  ["agentic-ai/claude-agent-sdk", "Claude Agent SDK", ["iconify:logos:claude-icon", "site:https://docs.anthropic.com"]],
  ["agentic-ai/openhands", "OpenHands", ["site:https://www.all-hands.dev", "site:https://docs.all-hands.dev"]],

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

  ["ml-framework/pytorch", "PyTorch", ["iconify:logos:pytorch-icon", "site:https://pytorch.org"]],
  ["ml-framework/tensorflow", "TensorFlow", ["iconify:logos:tensorflow", "site:https://www.tensorflow.org"]],
  ["ml-framework/jax", "JAX", ["asset:JAX SVG logo sourced from official JAX repo|https://upload.wikimedia.org/wikipedia/commons/8/86/Google_JAX_logo.svg", "asset:JAX official repo PNG|https://raw.githubusercontent.com/jax-ml/jax/main/images/jax_logo_250px.png", "site:https://jax.dev"]],
  ["ml-framework/keras", "Keras", ["asset:Keras official site logo|https://keras.io/img/logo.png", "asset:Keras SVG logo|https://upload.wikimedia.org/wikipedia/commons/a/ae/Keras_logo.svg", "site:https://keras.io"]],
  ["ml-framework/onnx-runtime", "ONNX Runtime", ["asset:ONNX Runtime official SVG logo|https://onnxruntime.ai/images/ONNX-Runtime-logo.svg", "asset:ONNX Runtime official PNG logo|https://onnxruntime.ai/images/ONNX-Runtime-logo.png", "site:https://onnxruntime.ai"]],

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
  ["ai-security/llama-guard", "Llama Guard", ["iconify:logos:meta-icon", "site:https://www.llama.com/docs/model-cards-and-prompt-formats/llama-guard-4"]],
  ["ai-security/llm-guard", "LLM Guard", ["asset:LLM Guard dashboard asset|https://raw.githubusercontent.com/BerriAI/litellm/main/ui/litellm-dashboard/public/assets/logos/llm_guard.png", "site:https://protectai.com/llm-guard", "site:https://github.com/protectai/llm-guard"]],
  ["ai-security/rebuff", "Rebuff", ["asset:Rebuff archived official repo logo|https://raw.githubusercontent.com/protectai/rebuff/main/server/public/logo.png", "asset:Rebuff archived official repo apple-touch icon|https://raw.githubusercontent.com/protectai/rebuff/main/server/public/apple-touch-icon.png"]],

  ["observability/langsmith", "LangSmith", ["asset:LangSmith official SVG|https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/698afeb61612bb3b1af6e9ee_Frame%202147254707.svg", "site:https://www.langchain.com/langsmith", "site:https://smith.langchain.com"]],
  ["observability/langfuse", "Langfuse", ["asset:Langfuse official wordart SVG|https://langfuse.com/langfuse-wordart.svg", "site:https://langfuse.com"]],
  ["observability/mlflow", "MLflow", ["asset:MLflow official black SVG|https://mlflow.org/img/mlflow-black.svg", "site:https://mlflow.org"]],
  ["observability/arize-phoenix", "Arize Phoenix", ["asset:Phoenix official repo logo|https://raw.githubusercontent.com/Arize-ai/phoenix/main/docs/logo/dark.png", "site:https://phoenix.arize.com", "site:https://arize.com"]],
  ["observability/weights-biases", "Weights & Biases", ["asset:Weights & Biases official SVG|https://site.wandb.ai/wp-content/uploads/2023/05/wb-cw.svg", "site:https://wandb.ai/site/brand-identity", "site:https://site.wandb.ai"]],
  ["observability/weights-biases-weave", "Weights & Biases Weave", ["asset:Weights & Biases official SVG|https://site.wandb.ai/wp-content/uploads/2023/05/wb-cw.svg", "site:https://wandb.ai"]],
  ["observability/trulens", "TruLens", ["site:https://www.trulens.org"]],
  ["observability/ragas", "Ragas", ["asset:Ragas official docs SVG|https://raw.githubusercontent.com/vibrantlabsai/ragas/main/docs/_static/imgs/logo-black.svg", "asset:Ragas official docs PNG|https://raw.githubusercontent.com/vibrantlabsai/ragas/main/docs/_static/imgs/ragas-logo.png", "site:https://www.ragas.io", "site:https://docs.ragas.io"]],
  ["observability/promptfoo", "Promptfoo", ["asset:Promptfoo official panda logo|https://www.promptfoo.dev/img/logo-panda.svg", "site:https://www.promptfoo.dev"]],
  ["observability/braintrust", "Braintrust", ["asset:Braintrust official SVG logo|https://www.braintrust.dev/braintrust-logo.svg", "asset:Braintrust official 512 icon|https://www.braintrust.dev/icon512.png", "site:https://www.braintrust.dev"]],
  ["observability/portkey", "Portkey", ["site:https://portkey.ai", "site:https://portkey.ai/docs"]],
  ["observability/maxim-ai", "Maxim AI", ["site:https://www.getmaxim.ai", "site:https://getmaxim.ai"]],
  ["observability/galileo", "Galileo", ["site:https://www.galileo.ai", "site:https://rungalileo.io"]],
  ["observability/promptlayer", "PromptLayer", ["site:https://www.promptlayer.com", "site:https://promptlayer.com"]],
  ["observability/posthog-llm-analytics", "PostHog LLM Analytics", ["iconify:logos:posthog-icon", "site:https://posthog.com"]],
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

  ["ai-tools/openwebui", "OpenWebUI", ["asset:Open WebUI official logo PNG|https://openwebui.com/logo.png", "asset:Open WebUI official SVG favicon|https://openwebui.com/favicon.svg", "site:https://openwebui.com"]],
  ["ai-tools/comfyui", "ComfyUI", ["asset:ComfyUI official SVG logo|https://comfy.org/icons/logo.svg", "asset:ComfyUI official SVG logomark|https://comfy.org/icons/logomark.svg", "site:https://www.comfy.org"]],
  ["ai-tools/dify", "Dify", ["asset:Dify official SVG logo|https://dify.ai/assets/dify-logo.svg", "site:https://dify.ai"]],
  ["ai-tools/flowise", "Flowise", ["asset:Flowise official repo logo|https://raw.githubusercontent.com/FlowiseAI/Flowise/main/packages/ui/src/assets/images/flowise_logo.png", "asset:Flowise official repo 512 icon|https://raw.githubusercontent.com/FlowiseAI/Flowise/main/packages/ui/public/logo512.png", "site:https://flowiseai.com"]],
  ["ai-tools/langflow", "Langflow", ["asset:Langflow official site logo|https://www.langflow.org/images/logo.png", "asset:Langflow dashboard SVG logo|https://raw.githubusercontent.com/BerriAI/litellm/main/ui/litellm-dashboard/public/assets/logos/langflow.svg", "site:https://www.langflow.org"]],
  ["ai-tools/litellm", "LiteLLM", ["asset:LiteLLM official site icon|https://framerusercontent.com/images/GtfMdzyrMj6FQY6lGLqI6bh2LYM.png", "asset:LiteLLM official repo logo|https://raw.githubusercontent.com/BerriAI/litellm/main/ui/litellm-dashboard/public/assets/logos/litellm_logo.jpg", "site:https://www.litellm.ai"]],
  ["ai-tools/gradio", "Gradio", ["iconify:logos:gradio", "site:https://www.gradio.app"]],
  ["ai-tools/streamlit", "Streamlit", ["iconify:logos:streamlit", "site:https://streamlit.io"]],
  ["ai-tools/mastra", "Mastra", ["asset:Mastra official brand wordmark|https://mastra.ai/brand/mastra-logo-wordmark.png", "asset:Mastra official SVG icon|https://mastra.ai/favicon/new-brand/icon.svg", "site:https://mastra.ai"]],
  ["ai-tools/vercel-ai-sdk", "Vercel AI SDK", ["asset:Vercel AI SDK official SVG logo|https://ai-sdk.dev/_next/static/media/ai-sdk-light.0-.nn6z_67.-e.svg", "site:https://ai-sdk.dev"]],
  ["ai-tools/unsloth", "Unsloth", ["asset:Unsloth official logo PNG|https://unsloth.ai/cgi/image/unsloth_new_wb_logo_vnrA8AASj-jN5wy8UIYE-.png?format=raw", "site:https://unsloth.ai"]],
  ["ai-tools/openrouter", "OpenRouter", ["asset:OpenRouter official dark SVG logo|https://openrouter.ai/brand/v2/openrouter-dark.svg", "asset:OpenRouter official light SVG logo|https://openrouter.ai/brand/v2/openrouter-light.svg", "site:https://openrouter.ai"]],
  ["ai-tools/cursor", "Cursor", ["asset:Cursor dashboard SVG logo|https://raw.githubusercontent.com/BerriAI/litellm/main/ui/litellm-dashboard/public/assets/logos/cursor.svg", "site:https://cursor.com"]],
  ["ai-tools/windsurf", "Windsurf", ["site:https://windsurf.com", "site:https://codeium.com/windsurf"]],
  ["ai-tools/cline", "Cline", ["site:https://cline.bot", "site:https://docs.cline.bot"]],
  ["ai-tools/continue", "Continue", ["site:https://www.continue.dev", "site:https://continue.dev"]],
  ["ai-tools/label-studio", "Label Studio", ["site:https://labelstud.io", "site:https://humansignal.com"]],
  ["ai-tools/docling", "Docling", ["site:https://docling-project.github.io/docling", "site:https://ds4sd.github.io/docling"]],
  ["ai-tools/jina-ai", "Jina AI", ["site:https://jina.ai"]],
  ["ai-infra/modal", "Modal", ["asset:Modal official SVG logotype|https://modal.com/_app/immutable/assets/logotype.CAx-nu9G.svg", "asset:Modal official favicon SVG|https://modal.com/assets/favicon.svg", "site:https://modal.com"]],
  ["ai-infra/fireworks-ai", "Fireworks AI", ["asset:Fireworks AI official SVG wordmark|https://cdn.sanity.io/images/pv37i0yn/production/902311c0246831a4baf8f97f37a0709b7668d55f-2048x407.svg", "asset:Fireworks AI official SVG icon|https://fireworks.ai/icon0.svg", "site:https://fireworks.ai"]],
  ["ai-infra/together-ai", "Together AI", ["zip-asset:Together AI official 2026 SVG horizontal lockup|https://cdn.prod.website-files.com/69654e88dce9154b5f1206dd/69a6dad66e8b98c718262888_together-ai-logo-suite.zip|Together AI Logo Suite/SVG/Color+Black/TogetherAI_Logo_021026_Horizontal Lockup.svg|.svg", "asset:Together AI official site logo PNG|https://cdn.prod.website-files.com/69654e88dce9154b5f1206dd/69aaa5310313790ada6393ec_together-ai-logo.png", "site:https://www.together.ai"]],
  ["ai-infra/sglang", "SGLang", ["asset:SGLang official site logo|https://www.sglang.io/images/logo.png", "site:https://www.sglang.ai", "site:https://www.sglang.io"]],
  ["ai-infra/ray-serve", "Ray Serve", ["asset:Ray official SVG favicon|https://www.ray.io/favicon.svg", "site:https://www.ray.io"]],
  ["ai-infra/bentoml", "BentoML", ["asset:BentoML official SVG logo|https://www.bentoml.com/bentoml-logo.svg", "site:https://www.bentoml.com", "site:https://docs.bentoml.com"]],
  ["ai-infra/llama-cpp", "llama.cpp", ["site:https://github.com/ggml-org/llama.cpp", "iconify:logos:meta-icon"]],
  ["ai-infra/hugging-face-tgi", "Hugging Face TGI", ["iconify:logos:hugging-face-icon", "site:https://huggingface.co/docs/text-generation-inference"]],
  ["ai-infra/tensorrt-llm", "TensorRT-LLM", ["iconify:logos:nvidia", "site:https://developer.nvidia.com/tensorrt"]],
  ["ai-infra/nvidia-triton", "NVIDIA Triton", ["asset:NVIDIA Triton dashboard asset|https://raw.githubusercontent.com/BerriAI/litellm/main/ui/litellm-dashboard/public/assets/logos/nvidia_triton.png", "iconify:logos:nvidia", "site:https://developer.nvidia.com/triton-inference-server"]],
  ["ai-infra/kserve", "KServe", ["site:https://kserve.github.io/website", "site:https://kserve.github.io"]],
  ["ai-infra/baseten", "Baseten", ["asset:Baseten dashboard SVG logo|https://raw.githubusercontent.com/BerriAI/litellm/main/ui/litellm-dashboard/public/assets/logos/baseten.svg", "site:https://www.baseten.co"]],
  ["ai-infra/replicate", "Replicate", ["asset:Replicate dashboard SVG logo|https://raw.githubusercontent.com/BerriAI/litellm/main/ui/litellm-dashboard/public/assets/logos/replicate.svg", "site:https://replicate.com"]],
  ["ai-infra/runpod", "Runpod", ["site:https://www.runpod.io", "site:https://runpod.io"]],

  ["training/hugging-face-accelerate", "Hugging Face Accelerate", ["iconify:logos:hugging-face-icon", "site:https://huggingface.co/docs/accelerate"]],
  ["training/hugging-face-trl", "Hugging Face TRL", ["iconify:logos:hugging-face-icon", "site:https://huggingface.co/docs/trl"]],
  ["training/hugging-face-peft", "Hugging Face PEFT", ["iconify:logos:hugging-face-icon", "site:https://huggingface.co/docs/peft"]],
  ["training/axolotl", "Axolotl", ["site:https://axolotl.ai", "site:https://docs.axolotl.ai"]],
  ["training/deepspeed", "DeepSpeed", ["site:https://www.deepspeed.ai", "iconify:logos:microsoft-icon"]],
  ["training/pytorch-lightning", "PyTorch Lightning", ["site:https://lightning.ai", "iconify:logos:pytorch-icon"]],

  ["vector-database/pinecone", "Pinecone", ["iconify:logos:pinecone-icon", "asset:Pinecone official site logo|https://www.pinecone.io/images/Pinecone-Logo-Black.png", "site:https://www.pinecone.io"]],
  ["vector-database/lancedb", "LanceDB", ["asset:LanceDB official SVG logo|https://cdn.prod.website-files.com/69a866b324926425eccc4cf5/69ab0db86188576e86d098f7_89e64c892e91417e1a9ff9ecbda3545f_lanceDB_logo.svg", "site:https://lancedb.com"]],
  ["vector-database/faiss", "FAISS", ["iconify:logos:meta-icon", "site:https://faiss.ai"]],
  ["vector-database/opensearch", "OpenSearch", ["iconify:logos:opensearch", "site:https://opensearch.org"]],
  ["vector-database/meilisearch", "Meilisearch", ["iconify:logos:meilisearch", "site:https://www.meilisearch.com"]],
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

  if (candidate.startsWith("zip-asset:")) {
    const [source, url, entry, ext] = candidate.slice("zip-asset:".length).split("|");
    return {
      kind: "Official/brand-package asset",
      source,
      url,
      zipEntry: entry,
      ext,
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
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return ".png";
  if (buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return ".jpg";
  if (buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP") return ".webp";
  if (buffer.subarray(0, 4).equals(Buffer.from([0x00, 0x00, 0x01, 0x00]))) return ".ico";
  const isSvg = buffer.subarray(0, 1024).toString("utf8").includes("<svg");
  if (isSvg) return ".svg";
  const urlExt = extname(new URL(url).pathname);
  return contentTypeExt.get(contentType) || urlExt || ".png";
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

function extractZipEntry(zipBuffer, wantedEntry) {
  for (let eocdOffset = zipBuffer.length - 22; eocdOffset >= Math.max(0, zipBuffer.length - 65557); eocdOffset -= 1) {
    if (zipBuffer.readUInt32LE(eocdOffset) !== 0x06054b50) continue;

    const totalEntries = zipBuffer.readUInt16LE(eocdOffset + 10);
    let centralOffset = zipBuffer.readUInt32LE(eocdOffset + 16);

    for (let entryIndex = 0; entryIndex < totalEntries; entryIndex += 1) {
      if (zipBuffer.readUInt32LE(centralOffset) !== 0x02014b50) break;

      const method = zipBuffer.readUInt16LE(centralOffset + 10);
      const compressedSize = zipBuffer.readUInt32LE(centralOffset + 20);
      const fileNameLength = zipBuffer.readUInt16LE(centralOffset + 28);
      const extraLength = zipBuffer.readUInt16LE(centralOffset + 30);
      const commentLength = zipBuffer.readUInt16LE(centralOffset + 32);
      const localOffset = zipBuffer.readUInt32LE(centralOffset + 42);
      const nameStart = centralOffset + 46;
      const nameEnd = nameStart + fileNameLength;
      const fileName = zipBuffer.subarray(nameStart, nameEnd).toString("utf8");

      if (fileName === wantedEntry) {
        if (zipBuffer.readUInt32LE(localOffset) !== 0x04034b50) {
          throw new Error(`invalid zip local header for ${fileName}`);
        }

        const localFileNameLength = zipBuffer.readUInt16LE(localOffset + 26);
        const localExtraLength = zipBuffer.readUInt16LE(localOffset + 28);
        const dataStart = localOffset + 30 + localFileNameLength + localExtraLength;
        const dataEnd = dataStart + compressedSize;
        if (dataEnd > zipBuffer.length) {
          throw new Error(`zip entry extends past end: ${fileName}`);
        }

        const compressed = zipBuffer.subarray(dataStart, dataEnd);
        if (method === 0) return compressed;
        if (method === 8) return inflateRawSync(compressed);
        throw new Error(`unsupported zip compression method ${method}`);
      }

      centralOffset = nameEnd + extraLength + commentLength;
    }

    break;
  }

  let offset = 0;

  while (offset + 30 <= zipBuffer.length) {
    const signature = zipBuffer.readUInt32LE(offset);
    if (signature === 0x02014b50 || signature === 0x06054b50) break;
    if (signature !== 0x04034b50) {
      throw new Error(`invalid zip local header at ${offset}`);
    }

    const method = zipBuffer.readUInt16LE(offset + 8);
    const compressedSize = zipBuffer.readUInt32LE(offset + 18);
    const fileNameLength = zipBuffer.readUInt16LE(offset + 26);
    const extraLength = zipBuffer.readUInt16LE(offset + 28);
    const nameStart = offset + 30;
    const nameEnd = nameStart + fileNameLength;
    const fileName = zipBuffer.subarray(nameStart, nameEnd).toString("utf8");
    const dataStart = nameEnd + extraLength;
    const dataEnd = dataStart + compressedSize;

    if (dataEnd > zipBuffer.length) {
      throw new Error(`zip entry extends past end: ${fileName}`);
    }

    if (fileName === wantedEntry) {
      const compressed = zipBuffer.subarray(dataStart, dataEnd);
      if (method === 0) return compressed;
      if (method === 8) return inflateRawSync(compressed);
      throw new Error(`unsupported zip compression method ${method}`);
    }

    offset = dataEnd;
  }

  throw new Error(`zip entry not found: ${wantedEntry}`);
}

async function downloadZipAsset(url, zipEntry, kind, source, forcedExt) {
  const { response, buffer: zipBuffer } = await fetchBuffer(url);
  const buffer = extractZipEntry(zipBuffer, zipEntry);
  const contentType = forcedExt === ".svg" ? "image/svg+xml" : undefined;
  assertImage(contentType, buffer);
  const ext = extensionFor(zipEntry, contentType, buffer, forcedExt);
  return {
    kind,
    source,
    url,
    finalUrl: `${response.url}#${zipEntry}`,
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
  if (item.zipEntry) {
    return downloadZipAsset(item.url, item.zipEntry, item.kind, item.source, item.ext);
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
