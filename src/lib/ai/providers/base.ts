import type { LLMClient, LLMCompletionOptions, LLMCompletionResult } from "../types";

export abstract class BaseLLMProvider implements LLMClient {
  protected apiKey: string;
  protected defaultModel: string;

  constructor(apiKey: string, defaultModel: string) {
    this.apiKey = apiKey;
    this.defaultModel = defaultModel;
  }

  abstract complete(prompt: string, options?: LLMCompletionOptions): Promise<LLMCompletionResult>;

  protected getModel(options?: LLMCompletionOptions): string {
    return options?.model ?? this.defaultModel;
  }

  protected getTemperature(options?: LLMCompletionOptions): number {
    return options?.temperature ?? 0.7;
  }

  protected getMaxTokens(options?: LLMCompletionOptions): number {
    return options?.maxTokens ?? 4096;
  }

  protected buildMessages(prompt: string, options?: LLMCompletionOptions): Array<{ role: string; content: string }> {
    const messages: Array<{ role: string; content: string }> = [];
    if (options?.systemPrompt) {
      messages.push({ role: "system", content: options.systemPrompt });
    }
    messages.push({ role: "user", content: prompt });
    return messages;
  }
}
