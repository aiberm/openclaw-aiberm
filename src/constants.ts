// Aiberm API Base URL - unified endpoint for all models
export const AIBERM_BASE_URL = "https://aiberm.com/v1";
export const AIBERM_PRICING_API = "https://aiberm.com/api/pricing";

// Provider IDs
export const PROVIDER_ID_OPENAI = "aiberm-openai";
export const PROVIDER_ID_ANTHROPIC = "aiberm-anthropic";
export const PROVIDER_ID_GOOGLE = "aiberm-google";
export const PROVIDER_ID_DEEPSEEK = "aiberm-deepseek";
export const PROVIDER_ID_XAI = "aiberm-xai";
export const PROVIDER_ID_OTHER = "aiberm-other";

// Environment variable for API key
export const AIBERM_API_KEY_ENV = "AIBERM_API_KEY";

// Auth profile ID
export const AUTH_PROFILE_ID = "aiberm:default";

// Plugin metadata
export const PLUGIN_ID = "openclaw-aiberm";
export const PLUGIN_NAME = "Aiberm";
export const PLUGIN_DESCRIPTION =
  "Access GPT, Claude, Gemini, DeepSeek, Grok and more models via Aiberm API";

// Provider mapping based on model prefix
export const PROVIDER_MAPPING: Record<string, string> = {
  "openai/": PROVIDER_ID_OPENAI,
  "anthropic/": PROVIDER_ID_ANTHROPIC,
  "google/": PROVIDER_ID_GOOGLE,
  "deepseek/": PROVIDER_ID_DEEPSEEK,
  "x-ai/": PROVIDER_ID_XAI,
  "claude-": PROVIDER_ID_ANTHROPIC,
  "gemini-": PROVIDER_ID_GOOGLE,
  "gpt-": PROVIDER_ID_OPENAI,
  "minimax/": PROVIDER_ID_OTHER,
  "xiaomi/": PROVIDER_ID_OTHER,
  "kimi-": PROVIDER_ID_OTHER,
};

// API type mapping based on provider
export const API_TYPE_MAPPING: Record<string, string> = {
  [PROVIDER_ID_OPENAI]: "openai-completions",
  [PROVIDER_ID_ANTHROPIC]: "anthropic-messages",
  [PROVIDER_ID_GOOGLE]: "google-generative-ai",
  [PROVIDER_ID_DEEPSEEK]: "openai-completions",
  [PROVIDER_ID_XAI]: "openai-completions",
  [PROVIDER_ID_OTHER]: "openai-completions",
};
