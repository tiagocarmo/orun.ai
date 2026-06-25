import type { LLMClient, LLMProviderType } from "./types";
import { OpenAIProvider } from "./providers/openai";
import { getSettingValue } from "@/lib/settings";

export async function createLLMClient(provider?: LLMProviderType): Promise<LLMClient> {
  let providerName = provider;

  if (!providerName) {
    const dbProvider = await getSettingValue("agents.default_model");
    providerName = (dbProvider as LLMProviderType) ?? undefined;
  }

  providerName = providerName ?? (process.env.LLM_PROVIDER as LLMProviderType) ?? "openai";

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
