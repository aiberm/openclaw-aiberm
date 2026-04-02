# openclaw-aiberm

English | [中文](./README.md)

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

Enable the plugin:

```bash
openclaw plugins enable openclaw-aiberm
```

**Important**: After enabling, restart the gateway for changes to take effect:

```bash
openclaw gateway restart
```

## Authentication

After installing and enabling the plugin, authenticate with your Aiberm API key:

```bash
openclaw models auth login --provider aiberm --set-default
```

You will be prompted to enter your Aiberm API key. Get your API key at [https://aiberm.com/console/token](https://aiberm.com/console/token).

If you need to switch to a different model, you can re-run `openclaw onboard`, select **Skip for now** in Model/auth provider, select **aiberm** in Filter models by provider, then choose the model you want to switch to from the model list.

## Example Models

Models are loaded dynamically from the API. Here are some examples:

### OpenAI GPT
- `aiberm/openai/gpt-5.4` - Latest GPT-5.4 model
- `aiberm/openai/gpt-5.3-codex` - GPT-5.3 code-optimized
- `aiberm/openai/gpt-5.2` / `gpt-5.2-codex`
- `aiberm/openai/gpt-5.1` / `gpt-5.1-codex`
- `aiberm/openai/gpt-5` / `gpt-5-codex`
- `aiberm/openai/gpt-5-mini` / `gpt-5-nano`
- `aiberm/openai/gpt-4.1` / `gpt-4.1-mini` / `gpt-4.1-nano`
- `aiberm/openai/gpt-4o` / `gpt-4o-mini`
- `aiberm/openai/o3-mini` - Reasoning-optimized model

### Anthropic Claude
- `aiberm/anthropic/claude-opus-4.6` / `claude-opus-4.6:thinking`
- `aiberm/anthropic/claude-opus-4.5` / `claude-opus-4.5:thinking`
- `aiberm/anthropic/claude-sonnet-4.6` / `claude-sonnet-4.6:thinking`
- `aiberm/anthropic/claude-sonnet-4.5` / `claude-sonnet-4.5:thinking`
- `aiberm/anthropic/claude-haiku` / `claude-haiku-4.5` / `claude-haiku-4.5:thinking`

### Google Gemini
- `aiberm/google/gemini-3-pro` - Gemini 3 Pro
- `aiberm/google/gemini-3-flash` - Gemini 3 Flash
- `aiberm/google/gemini-2.5-pro` / `gemini-2.5-flash`
- `aiberm/gemini-3.1-pro-preview-thinking`

### DeepSeek
- `aiberm/deepseek/deepseek-r1` - DeepSeek R1 reasoning model
- `aiberm/deepseek/deepseek-v3.2` / `deepseek-v3.2-exp`
- `aiberm/deepseek/deepseek-v3.2-exp-thinking` - Chain-of-thought mode
- `aiberm/deepseek-ocr` - OCR-specialized model

### X.AI Grok
- `aiberm/x-ai/grok-4.1-fast` - Grok 4.1 fast version
- `aiberm/x-ai/grok-code-fast-1` - Code-optimized version

### Other Models
- `aiberm/minimax/minimax-m2.5` - MiniMax M2.5
- `aiberm/xiaomi/mimo-v2-flash` - Xiaomi Mimo V2
- `aiberm/glm-5` - Zhipu GLM-5
- `aiberm/kimi-k2.5` / `kimi-k2.5-thinking` - Kimi K2.5

### Embedding Models
- `aiberm/openai/text-embedding-3-large`
- `aiberm/openai/text-embedding-3-small`
- `aiberm/openai/text-embedding-ada-002`

Visit [Aiberm Pricing](https://aiberm.com/pricing) for the complete and up-to-date list of available models.

## Usage

After authentication, you can start using OpenClaw. For detailed usage, please refer to the [OpenClaw Documentation](https://docs.openclaw.ai).

List installed models:

```bash
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
