import { openRouterClient } from "./openRouter.js";

export const generateAiReview = async (prompt) => {
  const response =
    await openRouterClient.chat.completions.create({
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
    });

  const content =
    response.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Empty AI response");
  }

  try {
    return JSON.parse(content);
  } catch {
    throw new Error("Invalid JSON returned by AI");
  }
};