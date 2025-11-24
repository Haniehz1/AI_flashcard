import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `
You are a flashcard generator. Given study material, create 5-10 flashcards.
Return JSON array: [{ "front": "question", "back": "answer" }]
Rules:
- Questions should test understanding, not just recall
- Answers should be concise (1-2 sentences max)
- Cover the most important concepts
- No duplicate concepts
Only return valid JSON, no markdown.
`.trim();

const TIMEOUT_MS = 15000;
const MAX_TEXT = 8000;

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Missing OPENAI_API_KEY on the server." },
      { status: 500 }
    );
  }

  let text: string;
  try {
    const body = await req.json();
    text = (body?.text ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!text || text.length < 50) {
    return NextResponse.json(
      { error: "Please provide at least 50 characters of study material." },
      { status: 400 }
    );
  }

  const truncated = text.slice(0, MAX_TEXT);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const completion = await client.chat.completions.create(
      {
        model: "gpt-4o-mini",
        temperature: 0.3,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: truncated }
        ],
        max_tokens: 800,
        response_format: { type: "text" }
      },
      { signal: controller.signal }
    );

    const message = completion.choices[0]?.message?.content?.trim() ?? "";

    let parsed: unknown;
    try {
      parsed = JSON.parse(message);
    } catch (err) {
      return NextResponse.json(
        { error: "AI response was not valid JSON. Please try again." },
        { status: 502 }
      );
    }

    if (!Array.isArray(parsed)) {
      return NextResponse.json(
        { error: "Unexpected response shape from AI." },
        { status: 502 }
      );
    }

    const cards = parsed
      .filter((item) => item && typeof item === "object")
      .map((item: any) => ({
        front: String(item.front ?? "").trim(),
        back: String(item.back ?? "").trim()
      }))
      .filter((item) => item.front && item.back)
      .slice(0, 10);

    if (cards.length === 0) {
      return NextResponse.json(
        { error: "AI did not return any flashcards. Try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ cards });
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      return NextResponse.json(
        { error: "OpenAI request timed out. Please retry." },
        { status: 504 }
      );
    }

    console.error("Error generating flashcards:", err);
    return NextResponse.json(
      { error: "Failed to generate flashcards. Please try again." },
      { status: 500 }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
