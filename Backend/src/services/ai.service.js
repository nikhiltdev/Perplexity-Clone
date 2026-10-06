import { ChatGoogle } from "@langchain/google/node";
import { ChatCohere } from "@langchain/cohere"
import { ChatMistralAI } from "@langchain/mistralai"
import { HumanMessage, SystemMessage, AIMessage } from "langchain"
import dotenv from "dotenv"
dotenv.config()

const COHERE_LLM = new ChatCohere({
    model: "command-r7b-12-2024",
    apiKey: process.env.COHERE_API_KEY
})

const GOOGLE_LLM = new ChatGoogle({
  model: "gemini-3.8-flash",
  apiKey: process.env.GOOGLE_API_KEY
});

export async function generateResponse(messages) {
    const response = await COHERE_LLM.invoke(
        messages.map((message) => {
            if (message.role == "user") {
                return new HumanMessage({ content: message.content })
            } else if (message.role == "ai") {
                return new AIMessage({ content: message.content })
            }
        })
    )
    return response.content
}

const systemPrompt = `
You are a chat title generator.

Your task is to generate a short and meaningful title based on the user's first message.

Rules:
- Generate only one title.
- Keep the title between 3 and 7 words.
- Clearly describe the main topic of the user's message.
- Make the title natural, simple, and easy to understand.
- Do not use quotes.
- Do not add explanations.
- Do not use emojis.
- Do not start with words like "Title:".
- Do not copy the entire user's message.
- Focus on the main intent or topic.

Examples:

User: "I want to know how to save more money every month."
Title: Monthly Money Saving Tips

User: "How can I create a REST API using Express?"
Title: Building an Express REST API

User: "I spent 500 rupees on dinner today."
Title: Dinner Expense

User: "What is the difference between income and expenses?"
Title: Income vs Expenses

Now generate a suitable title for the user's message.
`;

export async function generateChatTitle(message) {
    const response = await COHERE_LLM.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(`this is message for generating title ${message}`)
    ])
    console.log(response)
    return response.content
}