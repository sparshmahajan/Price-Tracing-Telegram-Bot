import puppeteer from "puppeteer";
import { saveToDB } from "./saveToDB";

export const amazonSearch = async (search: string, id: string | undefined) => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(search);
    const price = await page.evaluate(() => {
      const price: number = parseInt(
        document.querySelector(".a-price-whole").textContent.replace(",", "")
      );
      return price;
    });
    await browser.close();

    if (id !== undefined) {
      saveToDB(search, id, price, 'OneSize');
    }
    return price;
  } catch (err) {
    console.log(err);
  }
};