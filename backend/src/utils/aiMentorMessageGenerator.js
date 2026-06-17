import { openRouterClient } from "../ai/openRouter.js";

export const generateMentorResponse = async (messages) => {
    const response =
    await openRouterClient.chat.completions.create({
        model: process.env.OPENROUTER_MODEL,
        messages,
        max_tokens: 2000,
        temperature: 0.3,
    });

    const content =
    response.choices?.[0]?.message?.content;
    console.log(response.choices?.[0]?.message?.content);
    
    if(!content){
        throw new Error(
            "Empty AI response"
        );
    }
    return content;
};

