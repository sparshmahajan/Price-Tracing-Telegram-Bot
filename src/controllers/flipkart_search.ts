import puppeteer from "puppeteer";
import { saveToDB } from "./saveToDB";

export const flipkartSearch = async (search: string, id: string | undefined) => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(search);
    const price = await page.evaluate(() => {
      const price: number = parseInt(
        document
          .getElementsByClassName("_30jeq3 _16Jk6d")[0]
          .textContent.substring(1)
          .replace(",", "")
      );
      return price;
    });
    await browser.close();
    if( id !== undefined ) {
      saveToDB(search, id, price);
    }
    return price;
  } catch (err) {
    console.log(err);
  }
};
