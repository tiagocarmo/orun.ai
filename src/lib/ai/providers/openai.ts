import { BaseLLMProvider } from "./base";
import type { LLMCompletionOptions, LLMCompletionResult } from "../types";

export class OpenAIProvider extends BaseLLMProvider {
  constructor(apiKey: string) {
    super(apiKey, "gpt-4o");
  }

  async complete(prompt: string, options?: LLMCompletionOptions): Promise<LLMCompletionResult> {
    const model = this.getModel(options);
    const startTime = Date.now();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: this.buildMessages(prompt, options),
        temperature: this.getTemperature(options),
        max_tokens: this.getMaxTokens(options),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const durationMs = Date.now() - startTime;

    return {
      text: data.choices[0].message.content,
      tokens: {
        prompt: data.usage?.prompt_tokens ?? 0,
        completion: data.usage?.completion_tokens ?? 0,
        total: data.usage?.total_tokens ?? 0,
      },
      model: data.model,
      durationMs,
    };
  }
}
