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

## 可用模型

模型从 API 动态加载，以下是一些示例：

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

访问 [Aiberm 价格页面](https://aiberm.com/pricing) 查看完整的模型列表。

## 使用方法

```bash
# 使用 Claude Sonnet 4.5（认证后的默认模型）
openclaw agent --message "你好"

# 使用指定模型
openclaw agent --model aiberm/openai/gpt-5.2-codex --message "你好"

# 使用 DeepSeek R1
openclaw agent --model aiberm/deepseek/deepseek-r1 --message "你好"

# 列出可用模型
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
