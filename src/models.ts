import { AIBERM_PRICING_API } from "./constants.js";

const DEFAULT_COST = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };

// Model interface from Aiberm API
interface AibermModel {
  model_name: string;
  original_model_name?: string;
  quota_type: number;
  model_ratio: number;
  model_price: number;
  owner_by: string;
  completion_ratio: number;
  enable_groups: string[];
  supported_endpoint_types: string[];
}

interface AibermPricingResponse {
  data: AibermModel[];
  success: boolean;
}

// Parsed model for OpenClaw
export interface ParsedModel {
  id: string;
  name: string;
  reasoning: boolean;
  input: readonly string[];
  cost: { input: number; output: number; cacheRead: number; cacheWrite: number };
  contextWindow: number;
  maxTokens: number;
}

// Generate display name from model ID
function generateDisplayName(modelName: string): string {
  // Remove provider prefix if exists
  let name = modelName;
  const prefixes = ["openai/", "anthropic/", "google/", "deepseek/", "x-ai/", "minimax/", "xiaomi/"];
  for (const prefix of prefixes) {
    if (name.startsWith(prefix)) {
      name = name.slice(prefix.length);
      break;
    }
  }
  
  // Convert to title case and format
  return name
    .split("-")
    .map((part) => {
      // Handle version numbers and special cases
      if (/^\d/.test(part)) return part;
      if (part.toLowerCase() === "gpt") return "GPT";
      if (part.toLowerCase() === "claude") return "Claude";
      if (part.toLowerCase() === "gemini") return "Gemini";
      if (part.toLowerCase() === "deepseek") return "DeepSeek";
      if (part.toLowerCase() === "grok") return "Grok";
      if (part.toLowerCase() === "mini") return "Mini";
      if (part.toLowerCase() === "nano") return "Nano";
      if (part.toLowerCase() === "pro") return "Pro";
      if (part.toLowerCase() === "flash") return "Flash";
      if (part.toLowerCase() === "opus") return "Opus";
      if (part.toLowerCase() === "sonnet") return "Sonnet";
      if (part.toLowerCase() === "haiku") return "Haiku";
      if (part.toLowerCase() === "codex") return "Codex";
      if (part.toLowerCase() === "thinking") return "(Thinking)";
      if (part.toLowerCase() === "preview") return "Preview";
      if (part.toLowerCase() === "exp") return "Exp";
      if (part.toLowerCase() === "chat") return "Chat";
      if (part.toLowerCase() === "image") return "Image";
      if (part.toLowerCase() === "fast") return "Fast";
      if (part.toLowerCase() === "code") return "Code";
      if (part.toLowerCase() === "max") return "Max";
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ")
    .replace(/:thinking/gi, " (Thinking)")
    .replace(/\s+/g, " ")
    .trim();
}

// Determine if model supports reasoning (thinking)
function isReasoningModel(modelName: string): boolean {
  return modelName.includes("thinking") || modelName.includes(":thinking");
}

// Determine input types based on model
function getInputTypes(modelName: string, endpointTypes: string[]): readonly string[] {
  if (endpointTypes.includes("image-generation")) {
    return ["text"] as const;
  }
  // Most modern models support both text and image
  if (modelName.includes("image") || endpointTypes.includes("image-generation")) {
    return ["text"] as const;
  }
  return ["text", "image"] as const;
}

// Get context window based on model
function getContextWindow(modelName: string): number {
  if (modelName.includes("gemini")) return 1048576;
  if (modelName.includes("gpt-5")) return 400000;
  if (modelName.includes("gpt-4.1")) return 1000000;
  if (modelName.includes("gpt-4o")) return 128000;
  if (modelName.includes("claude")) return 200000;
  if (modelName.includes("deepseek")) return 128000;
  if (modelName.includes("grok")) return 131072;
  return 128000;
}

// Get max tokens based on model
function getMaxTokens(modelName: string): number {
  if (modelName.includes("gemini")) return 65536;
  if (modelName.includes("gpt-5")) return 128000;
  if (modelName.includes("gpt-4.1")) return 32768;
  if (modelName.includes("gpt-4o")) return 16384;
  if (modelName.includes("claude")) return 64000;
  if (modelName.includes("deepseek")) return 32768;
  if (modelName.includes("grok")) return 32768;
  return 32768;
}

// Parse API response to model list
function parseModels(data: AibermModel[]): ParsedModel[] {
  return data
    .filter((model) => {
      // Filter out image generation models for chat providers
      // They can still be used but through different endpoints
      return model.supported_endpoint_types.some((t) => 
        ["openai", "anthropic", "gemini"].includes(t)
      );
    })
    .map((model) => ({
      id: model.model_name,
      name: generateDisplayName(model.model_name),
      reasoning: isReasoningModel(model.model_name),
      input: getInputTypes(model.model_name, model.supported_endpoint_types),
      cost: DEFAULT_COST,
      contextWindow: getContextWindow(model.model_name),
      maxTokens: getMaxTokens(model.model_name),
    }));
}

// Fetch models from Aiberm API
export async function fetchModelsFromAPI(): Promise<ParsedModel[]> {
  try {
    const response = await fetch(AIBERM_PRICING_API);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: AibermPricingResponse = await response.json();
    if (!data.success || !data.data) {
      throw new Error("Invalid API response");
    }
    return parseModels(data.data);
  } catch (error) {
    console.error("Failed to fetch models from Aiberm API:", error);
    // Return fallback models if API fails
    return getFallbackModels();
  }
}

// Fallback models in case API is unavailable
export function getFallbackModels(): ParsedModel[] {
  const fallbackData: AibermModel[] = [
    // OpenAI
    { model_name: "openai/gpt-5.2-codex", quota_type: 0, model_ratio: 1.5, model_price: 0, owner_by: "", completion_ratio: 8, enable_groups: ["default"], supported_endpoint_types: ["openai"] },
    { model_name: "openai/gpt-5.2", quota_type: 0, model_ratio: 1.5, model_price: 0, owner_by: "", completion_ratio: 8, enable_groups: ["default"], supported_endpoint_types: ["openai"] },
    { model_name: "openai/gpt-4.1", quota_type: 0, model_ratio: 1.2, model_price: 0, owner_by: "", completion_ratio: 4, enable_groups: ["default"], supported_endpoint_types: ["openai"] },
    { model_name: "openai/gpt-4o", quota_type: 0, model_ratio: 0.9, model_price: 0, owner_by: "", completion_ratio: 4, enable_groups: ["default"], supported_endpoint_types: ["openai"] },
    { model_name: "openai/gpt-4o-mini", quota_type: 0, model_ratio: 0.05, model_price: 0, owner_by: "", completion_ratio: 4, enable_groups: ["default"], supported_endpoint_types: ["openai"] },
    // Anthropic
    { model_name: "anthropic/claude-sonnet-4.5", quota_type: 0, model_ratio: 5.2, model_price: 0, owner_by: "", completion_ratio: 5, enable_groups: ["default"], supported_endpoint_types: ["anthropic", "openai"] },
    { model_name: "anthropic/claude-opus-4.5", quota_type: 0, model_ratio: 8, model_price: 0, owner_by: "", completion_ratio: 5, enable_groups: ["default"], supported_endpoint_types: ["anthropic", "openai"] },
    { model_name: "anthropic/claude-haiku-4.5", quota_type: 0, model_ratio: 0.875, model_price: 0, owner_by: "", completion_ratio: 5, enable_groups: ["default"], supported_endpoint_types: ["anthropic", "openai"] },
    // Google
    { model_name: "google/gemini-3-pro", quota_type: 0, model_ratio: 1, model_price: 0, owner_by: "", completion_ratio: 6, enable_groups: ["default"], supported_endpoint_types: ["gemini", "openai"] },
    { model_name: "google/gemini-3-flash", quota_type: 0, model_ratio: 0.18, model_price: 0, owner_by: "", completion_ratio: 8, enable_groups: ["default"], supported_endpoint_types: ["gemini", "openai"] },
    { model_name: "google/gemini-2.5-pro", quota_type: 0, model_ratio: 1, model_price: 0, owner_by: "", completion_ratio: 8, enable_groups: ["default"], supported_endpoint_types: ["gemini", "openai"] },
    // DeepSeek
    { model_name: "deepseek/deepseek-r1", quota_type: 0, model_ratio: 1.56, model_price: 0, owner_by: "", completion_ratio: 3.57, enable_groups: ["default"], supported_endpoint_types: ["openai"] },
    { model_name: "deepseek/deepseek-v3.2", quota_type: 0, model_ratio: 0.45, model_price: 0, owner_by: "", completion_ratio: 1.5, enable_groups: ["default"], supported_endpoint_types: ["openai"] },
    // X.AI
    { model_name: "x-ai/grok-4.1-fast", quota_type: 0, model_ratio: 0.34, model_price: 0, owner_by: "", completion_ratio: 2.5, enable_groups: ["default"], supported_endpoint_types: ["openai"] },
  ];
  return parseModels(fallbackData);
}

// Export for backward compatibility
export const ALL_MODELS = getFallbackModels();
