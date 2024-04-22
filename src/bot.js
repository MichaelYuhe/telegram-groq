import { Bot } from "grammy";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "your_groq_api_key",
});

const bot = new Bot(
  process.env.TELEGRAM_BOT_TOKEN || "your_telegram_bot_token",
);

async function getGroqResponse(query) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: query,
        },
      ],
      model: "llama3-70b-8192",
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 1,
      stop: null,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error(error);
  }
}

bot.on("message:text", async (ctx) => {
  const response = await getGroqResponse(ctx.message.text);

  ctx.reply(response);
});

bot.start();
