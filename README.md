# openclaw-aiberm

Aiberm provider plugin for [OpenClaw](https://github.com/openclaw/openclaw).

Access GPT, Claude, Gemini, DeepSeek, Grok and more models through Aiberm API with a single API key.

**Dynamic Model Loading**: This plugin automatically fetches the latest available models from Aiberm API, so you always have access to the newest models without updating the plugin.

## Installation

```bash
openclaw plugins install openclaw-aiberm
```

Or install via npm:

```bash
npm install openclaw-aiberm
```

Then enable the plugin:

```bash
openclaw plugins enable openclaw-aiberm
```

## Authentication

After installing the plugin, authenticate with your Aiberm API key:

```bash
openclaw models auth login --provider aiberm --set-default
```

You will be prompted to enter your Aiberm API key. Get your API key at [https://aiberm.com/console/token](https://aiberm.com/console/token).

## Example Models

Models are loaded dynamically from the API. Here are some examples:

### OpenAI GPT
- `aiberm/openai/gpt-5.2-codex`
- `aiberm/openai/gpt-5.2`
- `aiberm/openai/gpt-4.1`
- `aiberm/openai/gpt-4o`
- `aiberm/openai/gpt-4o-mini`

### Anthropic Claude
- `aiberm/anthropic/claude-opus-4.5`
- `aiberm/anthropic/claude-sonnet-4.5`
- `aiberm/anthropic/claude-haiku-4.5`
- `aiberm/anthropic/claude-sonnet-4.5:thinking`

### Google Gemini
- `aiberm/google/gemini-3-pro`
- `aiberm/google/gemini-3-flash`
- `aiberm/google/gemini-2.5-pro`

### DeepSeek
- `aiberm/deepseek/deepseek-r1`
- `aiberm/deepseek/deepseek-v3.2`

### X.AI Grok
- `aiberm/x-ai/grok-4.1-fast`
- `aiberm/x-ai/grok-code-fast-1`

Visit [Aiberm Pricing](https://aiberm.com/pricing) for the complete and up-to-date list of available models.

## Usage

```bash
# Use Claude Sonnet 4.5 (default after auth)
openclaw agent --message "Hello"

# Use a specific model
openclaw agent --model aiberm/openai/gpt-5.2-codex --message "Hello"

# Use DeepSeek R1
openclaw agent --model aiberm/deepseek/deepseek-r1 --message "Hello"

# List available models
openclaw models list | grep aiberm
```

## Environment Variable

You can also set the API key via environment variable:

```bash
export AIBERM_API_KEY=sk-your-api-key
```

## How Dynamic Loading Works

1. When the plugin loads, it fetches the latest model list from `https://aiberm.com/api/pricing`
2. If the API is unavailable, the plugin falls back to a built-in model list
3. During authentication, the latest models are fetched again to ensure you have the most up-to-date list

This means:
- New models are available immediately without plugin updates
- Deprecated models are automatically removed
- Model capabilities are always current

## Why Aiberm?

- **Unified API**: Access multiple AI providers (OpenAI, Anthropic, Google, DeepSeek, X.AI, and more) with a single API key
- **Always Up-to-date**: Dynamic model loading ensures you always have access to the latest models
- **Cost-effective**: Competitive pricing for all models
- **Reliable**: High availability and fast response times
- **Easy setup**: Simple authentication flow

## Links

- [Aiberm Website](https://aiberm.com)
- [Aiberm Documentation](https://docs.aiberm.com)
- [Get API Key](https://aiberm.com/console/token)
- [Pricing](https://aiberm.com/pricing)

## License

MIT
