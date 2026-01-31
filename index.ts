import { emptyPluginConfigSchema } from "openclaw/plugin-sdk";
import {
  PLUGIN_ID,
  PLUGIN_NAME,
  PLUGIN_DESCRIPTION,
  PROVIDER_ID,
  AIBERM_BASE_URL,
  AIBERM_API_KEY_ENV,
} from "./src/constants.js";
import { getFallbackModels } from "./src/models.js";
import { createAibermAuthMethod } from "./src/auth.js";

const aibermPlugin = {
  id: PLUGIN_ID,
  name: PLUGIN_NAME,
  description: PLUGIN_DESCRIPTION,
  configSchema: emptyPluginConfigSchema(),
  register(api: {
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
  }) {
    const authMethod = createAibermAuthMethod();

    // Use fallback models for initial registration
    // Dynamic models will be fetched during authentication
    const fallbackModels = getFallbackModels();

    // Register single unified provider
    api.registerProvider({
      id: PROVIDER_ID,
      label: "Aiberm",
      envVars: [AIBERM_API_KEY_ENV],
      models: {
        baseUrl: AIBERM_BASE_URL,
        api: "openai-completions",
        models: fallbackModels,
      },
      auth: [authMethod],
    });
  },
};

export default aibermPlugin;
