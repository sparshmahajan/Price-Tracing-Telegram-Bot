import { config } from "dotenv";
config();
import TelegramBot from "node-telegram-bot-api";
import { amazonSearch } from "./controllers/amazon_search";
import { flipkartSearch } from "./controllers/flipkart_search";
import { myntraSearch } from "./controllers/myntra_search";

import { db } from "./utils/database";
db.connect();

const token = process.env.BOT_TOKEN;
if (token === undefined) {
  throw new Error("Bot token not found");
}
export const bot = new TelegramBot(token);

import cron from "./cronjob";

try {
  cron();
  console.log("Bot started");
  bot.onText(/\/start/, async (msg) => {
    bot.sendMessage(
      msg.chat.id,
      "Welcome " +
        msg.chat.first_name +
        "\n" +
        " This Bot will help you to track the price of your <b> Amazon </b> , <b>Flipkart</b> and <b> Myntra </b> products . Just send the valid link of the product.",
      {
        parse_mode: "HTML",
      }
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    bot.sendMessage(
      msg.chat.id,
      "You can use the following commands to get more information about the bot.",
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Help",
                callback_data: "/help",
              },
              {
                text: "About",
                callback_data: "/about",
              },
            ],
          ],
        },
      }
    );
  });

  bot.onText(/\/help/, (msg) => {
    bot.sendMessage(
      msg.chat.id,
      "This Bot will help you to track the price of your <b> Amazon </b> , <b>Flipkart</b> and <b> Myntra </b> products . Just send the valid link of the product.",
      {
        parse_mode: "HTML",
      }
    );
  });

  bot.onText(/\/about/, (msg) => {
    bot.sendMessage(
      msg.chat.id,
      "This Bot is made by <a href='https://t.me/Sparsh4342'>Sparsh</a> .",
      {
        parse_mode: "HTML",
      }
    );
  });

  bot.on("message", async (msg: any) => {
    const me: any = await bot.getMe();
    if (msg.from.id === me.id) {
      return;
    }

    const url = msg.text.split(" ")[0];
    const userSize = msg.text.split(" ")[1];
    if (
      url !== undefined &&
      msg.entities !== undefined &&
      msg.entities[0]?.type === "url"
    ) {
      if (url.includes("amazon.in")) {
        const price: number = await amazonSearch(url, msg.chat.id);
        bot.sendMessage(
          msg.chat.id,
          "Your Amazon product price is " +
            price +
            " and it is added to our database for tracking."
        );
      } else if (url.includes("flipkart.com")) {
        const price: number = await flipkartSearch(url, msg.chat.id);
        bot.sendMessage(
          msg.chat.id,
          "Your Flipkart product price is " +
            price +
            " and it is added to our database for tracking."
        );
      } else if (url.includes("myntra.com")) {
        const price: number = await myntraSearch(url, msg.chat.id, userSize);
        if (price === undefined) {
          bot.sendMessage(msg.chat.id, "Some error occured. Please try again.");
          return;
        } else if (price === 1e9) {
          bot.sendMessage(
            msg.chat.id,
            "Size not available for this product , we will notify you when it is available."
          );
          return;
        }
        bot.sendMessage(
          msg.chat.id,
          "Your Myntra product price is " +
            price +
            " and it is added to our database for tracking."
        );
      }
    } else if (
      msg.entities !== undefined &&
      msg.entities[0]?.type === "bot_command"
    ) {
      return;
    } else {
      bot.sendMessage(msg.chat.id, "Please send a valid link of the product.");
    }
  });

  bot.on("callback_query", (callbackQuery) => {
    const msg = callbackQuery.message;
    if (msg !== undefined) {
      if (callbackQuery.data === "/help") {
        bot.sendMessage(
          msg.chat.id,
          "This Bot will help you to track the price of your <b> Amazon </b> , <b>Flipkart</b> and <b> Myntra </b> products . Just send the valid link of the product.",
          {
            parse_mode: "HTML",
          }
        );
      } else if (callbackQuery.data === "/about") {
        bot.sendMessage(
          msg.chat.id,
          "This Bot is made by <a href='https://t.me/Sparsh4342'>Sparsh</a> .",
          {
            parse_mode: "HTML",
          }
        );
      }
    }
  });
} catch (err) {
  console.log(err);
}
