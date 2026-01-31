import {
  AIBERM_BASE_URL,
  PROVIDER_ID,
  AUTH_PROFILE_ID,
} from "./constants.js";
import {
  fetchModelsFromAPI,
  type ParsedModel,
} from "./models.js";

function validateApiKey(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "API key is required";
  if (trimmed.length < 10) return "API key seems too short";
  if (!trimmed.startsWith("sk-")) return "API key should start with 'sk-'";
  return undefined;
}

export function createAibermAuthMethod() {
  return {
    id: "api_key",
    label: "Aiberm API Key",
    hint: "Enter your Aiberm API key to access GPT, Claude, Gemini, DeepSeek, Grok and more models. Get your key at https://aiberm.com/console/token",
    kind: "api_key" as const,
    run: async (ctx: {
      prompter: {
        text: (opts: {
          message: string;
          placeholder?: string;
          validate?: (value: string) => string | undefined;
        }) => Promise<string>;
      };
    }) => {
      const apiKey = await ctx.prompter.text({
        message: "Aiberm API Key",
        placeholder: "sk-...",
        validate: validateApiKey,
      });

      const trimmedKey = apiKey.trim();

      // Fetch latest models from API
      console.log("Fetching latest models from Aiberm API...");
      const allModels = await fetchModelsFromAPI();

      // Default to Claude Sonnet as the default model
      const defaultModelRef = `${PROVIDER_ID}/anthropic/claude-sonnet-4.5`;

      // Build models mapping for agents
      const modelsMapping: Record<string, object> = {};
      for (const model of allModels) {
        modelsMapping[`${PROVIDER_ID}/${model.id}`] = {};
      }

      return {
        profiles: [
          {
            profileId: AUTH_PROFILE_ID,
            credential: {
              type: "api_key" as const,
              provider: "aiberm",
              key: trimmedKey,
            },
          },
        ],
        configPatch: {
          models: {
            providers: {
              [PROVIDER_ID]: {
                baseUrl: AIBERM_BASE_URL,
                apiKey: trimmedKey,
                api: "openai-completions",
                models: allModels,
              },
            },
          },
          agents: {
            defaults: {
              model: defaultModelRef,
              models: modelsMapping,
            },
          },
        },
        defaultModel: defaultModelRef,
        notes: [
          `Aiberm: Loaded ${allModels.length} models from API.`,
          `Models are available under ${PROVIDER_ID}/ prefix (e.g., ${PROVIDER_ID}/anthropic/claude-sonnet-4.5).`,
          "Visit https://aiberm.com/pricing for the complete list of available models.",
        ],
      };
    },
  };
}
