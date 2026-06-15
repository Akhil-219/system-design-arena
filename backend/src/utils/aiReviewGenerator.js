import { openRouterClient } from "../ai/openRouter.js";

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
      max_tokens: 4000,
    temperature: 0.3,
    });

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