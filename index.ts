import { emptyPluginConfigSchema } from "openclaw/plugin-sdk";
import {
  PLUGIN_ID,
  PLUGIN_NAME,
  PLUGIN_DESCRIPTION,
  PROVIDER_ID,
  AIBERM_BASE_URL,
  AIBERM_API_KEY_ENV,
} from "./src/constants.js";
import {
  fetchModelsFromAPI,
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

    // Register single unified provider
    api.registerProvider({
      id: PROVIDER_ID,
      label: "Aiberm",
      envVars: [AIBERM_API_KEY_ENV],
      models: {
        baseUrl: AIBERM_BASE_URL,
        api: "openai-completions",
        models: allModels,
      },
      auth: [authMethod],
    });
  },
};

export default aibermPlugin;
