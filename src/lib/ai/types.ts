export type LLMProviderType = "openai" | "anthropic" | "deepseek";

export interface LLMClient {
  complete(prompt: string, options?: LLMCompletionOptions): Promise<LLMCompletionResult>;
}

export type LLMCompletionOptions = {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
};

export type LLMCompletionResult = {
  text: string;
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
  model: string;
  durationMs: number;
};
