import Pricing from "../models/price.model";
import { amazonSearch } from "./../controllers/amazon_search";
import { flipkartSearch } from "./../controllers/flipkart_search";
import { myntraSearch } from "./../controllers/myntra_search";
import { bot } from "./../index";

export const checkPrice = async () => {
  const find = await Pricing.find();
  find.forEach(async (item) => {
    const search = item.product;
    const id = item.userId;
    const price = item.price;
    if (search.includes("amazon")) {
      const newPrice = await amazonSearch(search, undefined);
      if (item.userNeededSize === "OneSize") {
        await bot.sendMessage(id, search + "\nPrice has dropped");
      } else {
        await bot.sendMessage(
          id,
          search + "\nPrice has dropped for size " + item.userNeededSize
        );
      }
    } else if (search.includes("flipkart")) {
      const newPrice = await flipkartSearch(search, undefined);
      if (newPrice < price) {
        if (item.userNeededSize === "OneSize") {
          await bot.sendMessage(id, search + "\nPrice has dropped");
        } else {
          await bot.sendMessage(
            id,
            search + "\nPrice has dropped for size " + item.userNeededSize
          );
        }
      }
    } else if (search.includes("myntra")) {
      const newPrice = await myntraSearch(
        search,
        undefined,
        item.userNeededSize
      );
      if (newPrice < price) {
        if (item.userNeededSize === "OneSize") {
          await bot.sendMessage(id, search + "\nPrice has dropped");
        } else {
          await bot.sendMessage(
            id,
            search + "\nPrice has dropped for size " + item.userNeededSize
          );
        }
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  });
};
