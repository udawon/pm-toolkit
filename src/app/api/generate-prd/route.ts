import Anthropic from "@anthropic-ai/sdk";
import { getSystemPrompt } from "@/lib/prd-prompt";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { idea, template } = await request.json();

  if (!idea || typeof idea !== "string") {
    return new Response("idea is required", { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response("ANTHROPIC_API_KEY is not configured", { status: 500 });
  }

  const client = new Anthropic({ apiKey });
  const systemPrompt = getSystemPrompt(template || "prd");

  const stream = await client.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `다음 아이디어에 대해 문서를 작성해주세요:\n\n${idea}`,
      },
    ],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(event.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
