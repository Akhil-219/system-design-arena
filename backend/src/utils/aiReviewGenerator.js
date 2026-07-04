import { openRouterClient } from "../ai/openRouter.js";

export const generateAiReview = async (prompt) => {
  let response;
  try {
    response = await openRouterClient.chat.completions.create({
      model: process.env.OPENROUTER_MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_object",
      },
      max_tokens: 4000,
      temperature: 0.3,
    });
  } catch (err) {
    console.error("OpenRouter call failed:", err?.status, err?.message, err?.error);
    throw new Error("AI review request failed");
  }

  const content =
    response.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Empty AI response");
  }

  try {
    return JSON.parse(content);
  } catch {
    console.log(content);

    throw new Error("Invalid JSON returned by AI");
  }
};