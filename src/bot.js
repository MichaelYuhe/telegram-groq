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
      model: "mixtral-8x7b-32768",
    });

    console.log(completion.choices[0].message.content);
    return completion.choices[0].message.content;
  } catch (error) {
    console.error(error);
  }
}

bot.on("message:text", async (ctx) => {
  const response = await getGroqResponse(ctx.message.text);
  console.log(response);
  ctx.reply(response);
});

bot.start();
