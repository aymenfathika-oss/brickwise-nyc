interface ClaudeMessageOptions {
  model?: string;
  system?: string;
  maxTokens?: number;
}

export async function askClaude(userText: string, opts: ClaudeMessageOptions = {}): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set. Add it in your Netlify site's environment variables.");
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: opts.model ?? "claude-haiku-4-5-20251001",
      max_tokens: opts.maxTokens ?? 600,
      system: opts.system,
      messages: [{ role: "user", content: userText }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Anthropic API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const textBlock = data.content?.find((b: any) => b.type === "text");
  return textBlock?.text ?? "";
}
