import type { LLMClient, LLMProviderType } from "./types";
import { OpenAIProvider } from "./providers/openai";

export function createLLMClient(provider?: LLMProviderType): LLMClient {
  const providerName = provider ?? (process.env.LLM_PROVIDER as LLMProviderType) ?? "openai";

  switch (providerName) {
    case "openai": {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) throw new Error("OPENAI_API_KEY is required");
      return new OpenAIProvider(apiKey);
    }
    // Future providers can be added here
    // case "anthropic": ...
    // case "deepseek": ...
    default:
      throw new Error(`Unsupported LLM provider: ${providerName}`);
  }
}
