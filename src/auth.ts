import {
  AIBERM_BASE_URL,
  PROVIDER_ID_OPENAI,
  PROVIDER_ID_ANTHROPIC,
  PROVIDER_ID_GOOGLE,
  PROVIDER_ID_DEEPSEEK,
  PROVIDER_ID_XAI,
  PROVIDER_ID_OTHER,
  AUTH_PROFILE_ID,
  API_TYPE_MAPPING,
} from "./constants.js";
import {
  fetchModelsFromAPI,
  groupModelsByProvider,
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
      const groupedModels = groupModelsByProvider(allModels);

      // Default to Claude Sonnet as the default model
      const defaultModelRef = `${PROVIDER_ID_ANTHROPIC}/anthropic/claude-sonnet-4.5`;

      // Build providers config
      const providers: Record<string, {
        baseUrl: string;
        apiKey: string;
        api: string;
        models: ParsedModel[];
      }> = {};

      const providerIds = [
        PROVIDER_ID_OPENAI,
        PROVIDER_ID_ANTHROPIC,
        PROVIDER_ID_GOOGLE,
        PROVIDER_ID_DEEPSEEK,
        PROVIDER_ID_XAI,
        PROVIDER_ID_OTHER,
      ];

      for (const providerId of providerIds) {
        const models = groupedModels[providerId] || [];
        if (models.length > 0) {
          providers[providerId] = {
            baseUrl: AIBERM_BASE_URL,
            apiKey: trimmedKey,
            api: API_TYPE_MAPPING[providerId] || "openai-completions",
            models,
          };
        }
      }

      // Build models mapping for agents
      const modelsMapping: Record<string, object> = {};
      for (const model of allModels) {
        modelsMapping[`${model.providerId}/${model.id}`] = {};
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
            providers,
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
          "Models are available under aiberm-openai/, aiberm-anthropic/, aiberm-google/, aiberm-deepseek/, aiberm-xai/, and aiberm-other/ prefixes.",
          "Visit https://aiberm.com/pricing for the complete list of available models.",
        ],
      };
    },
  };
}
