import { emptyPluginConfigSchema } from "openclaw/plugin-sdk";
import {
  PLUGIN_ID,
  PLUGIN_NAME,
  PLUGIN_DESCRIPTION,
  PROVIDER_ID_OPENAI,
  PROVIDER_ID_ANTHROPIC,
  PROVIDER_ID_GOOGLE,
  PROVIDER_ID_DEEPSEEK,
  PROVIDER_ID_XAI,
  PROVIDER_ID_OTHER,
  AIBERM_BASE_URL,
  AIBERM_API_KEY_ENV,
  API_TYPE_MAPPING,
} from "./src/constants.js";
import {
  fetchModelsFromAPI,
  groupModelsByProvider,
  getFallbackModels,
} from "./src/models.js";
import { createAibermAuthMethod } from "./src/auth.js";

const aibermPlugin = {
  id: PLUGIN_ID,
  name: PLUGIN_NAME,
  description: PLUGIN_DESCRIPTION,
  configSchema: emptyPluginConfigSchema(),
  async register(api: {
    registerProvider: (provider: {
      id: string;
      label: string;
      envVars?: string[];
      models?: {
        baseUrl: string;
        api: string;
        models: Array<{
          id: string;
          name: string;
          reasoning: boolean;
          input: readonly string[];
          cost: { input: number; output: number; cacheRead: number; cacheWrite: number };
          contextWindow: number;
          maxTokens: number;
        }>;
      };
      auth: Array<ReturnType<typeof createAibermAuthMethod>>;
    }) => void;
    logger?: {
      info: (msg: string) => void;
      error: (msg: string) => void;
    };
  }) {
    const authMethod = createAibermAuthMethod();

    // Try to fetch models from API, fallback to static list
    let allModels;
    try {
      api.logger?.info("Fetching models from Aiberm API...");
      allModels = await fetchModelsFromAPI();
      api.logger?.info(`Loaded ${allModels.length} models from Aiberm API`);
    } catch (error) {
      api.logger?.error(`Failed to fetch models from API: ${error}`);
      allModels = getFallbackModels();
      api.logger?.info(`Using ${allModels.length} fallback models`);
    }

    const groupedModels = groupModelsByProvider(allModels);

    const providerConfigs = [
      { id: PROVIDER_ID_OPENAI, label: "Aiberm OpenAI" },
      { id: PROVIDER_ID_ANTHROPIC, label: "Aiberm Anthropic" },
      { id: PROVIDER_ID_GOOGLE, label: "Aiberm Google" },
      { id: PROVIDER_ID_DEEPSEEK, label: "Aiberm DeepSeek" },
      { id: PROVIDER_ID_XAI, label: "Aiberm X.AI" },
      { id: PROVIDER_ID_OTHER, label: "Aiberm Other" },
    ];

    for (const { id, label } of providerConfigs) {
      const models = groupedModels[id] || [];
      if (models.length > 0) {
        api.registerProvider({
          id,
          label,
          envVars: [AIBERM_API_KEY_ENV],
          models: {
            baseUrl: AIBERM_BASE_URL,
            api: API_TYPE_MAPPING[id] || "openai-completions",
            models,
          },
          auth: [authMethod],
        });
      }
    }
  },
};

export default aibermPlugin;
