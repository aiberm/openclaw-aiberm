# openclaw-aiberm

[English](./README_EN.md) | 中文

Aiberm 的 [OpenClaw](https://github.com/openclaw/openclaw) 插件。

通过 Aiberm API，使用一个 API Key 即可访问 GPT、Claude、Gemini、DeepSeek、Grok 等多种模型。

**动态模型加载**：插件会自动从 Aiberm API 获取最新的模型列表，无需更新插件即可使用最新模型。

## 安装

```bash
openclaw plugins install openclaw-aiberm
```

或通过 npm 安装：

```bash
npm install openclaw-aiberm
```

启用插件：

```bash
openclaw plugins enable openclaw-aiberm
```

**重要**：启用后需要重启 gateway 才能生效：

```bash
openclaw gateway restart
```

## 认证

安装并启用插件后，使用 Aiberm API Key 进行认证：

```bash
openclaw models auth login --provider aiberm --set-default
```

系统会提示你输入 Aiberm API Key。在 [https://aiberm.com/console/token](https://aiberm.com/console/token) 获取你的 API Key。

如果需要更换成其他模型，可以重新运行一下 `openclaw onboard`，在 Model/auth provider 中选择 **Skip for now**，在 Filter models by provider 中选择 **aiberm**，然后在模型列表中选择你想切换的模型。

## 可用模型

模型从 API 动态加载，以下是一些示例：

### OpenAI GPT
- `aiberm/openai/gpt-5.4` - 最新 GPT-5.4 模型
- `aiberm/openai/gpt-5.3-codex` - GPT-5.3 代码优化版
- `aiberm/openai/gpt-5.2` / `gpt-5.2-codex`
- `aiberm/openai/gpt-5.1` / `gpt-5.1-codex`
- `aiberm/openai/gpt-5` / `gpt-5-codex`
- `aiberm/openai/gpt-5-mini` / `gpt-5-nano`
- `aiberm/openai/gpt-4.1` / `gpt-4.1-mini` / `gpt-4.1-nano`
- `aiberm/openai/gpt-4o` / `gpt-4o-mini`
- `aiberm/openai/o3-mini` - 推理优化模型

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
- `aiberm/deepseek/deepseek-r1` - DeepSeek R1 推理模型
- `aiberm/deepseek/deepseek-v3.2` / `deepseek-v3.2-exp`
- `aiberm/deepseek/deepseek-v3.2-exp-thinking` - 思维链模式
- `aiberm/deepseek-ocr` - OCR 专用模型

### X.AI Grok
- `aiberm/x-ai/grok-4.1-fast` - Grok 4.1 快速版
- `aiberm/x-ai/grok-code-fast-1` - 代码优化版

### 其他模型
- `aiberm/minimax/minimax-m2.5` - MiniMax M2.5
- `aiberm/xiaomi/mimo-v2-flash` - 小米 Mimo V2
- `aiberm/glm-5` - 智谱 GLM-5
- `aiberm/kimi-k2.5` / `kimi-k2.5-thinking` - Kimi K2.5

### Embedding 模型
- `aiberm/openai/text-embedding-3-large`
- `aiberm/openai/text-embedding-3-small`
- `aiberm/openai/text-embedding-ada-002`

访问 [Aiberm 价格页面](https://aiberm.com/pricing) 查看完整的模型列表。

## 使用方法

认证成功后，即可开始使用 OpenClaw。具体使用方法请参考 [OpenClaw 官方文档](https://docs.openclaw.ai)。

查看已安装的模型：

```bash
openclaw models list | grep aiberm
```

## 环境变量

也可以通过环境变量设置 API Key：

```bash
export AIBERM_API_KEY=sk-your-api-key
```

## 动态加载原理

1. 插件加载时，从 `https://aiberm.com/api/pricing` 获取最新模型列表
2. 如果 API 不可用，插件会使用内置的模型列表
3. 认证时会再次获取最新模型，确保模型列表是最新的

这意味着：
- 新模型上线后无需更新插件即可使用
- 下线的模型会自动移除
- 模型信息始终保持最新

## 为什么选择 Aiberm？

- **统一 API**：一个 API Key 访问多个 AI 提供商（OpenAI、Anthropic、Google、DeepSeek、X.AI 等）
- **始终最新**：动态模型加载确保你始终可以使用最新模型
- **价格优惠**：所有模型均有竞争力的价格
- **稳定可靠**：高可用性和快速响应
- **简单易用**：简单的认证流程

## 相关链接

- [Aiberm 官网](https://aiberm.com)
- [Aiberm 文档](https://docs.aiberm.com)
- [获取 API Key](https://aiberm.com/console/token)
- [价格](https://aiberm.com/pricing)

## 许可证

MIT
