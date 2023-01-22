import puppeteer from "puppeteer";
import { saveToDB } from "./saveToDB";

export const myntraSearch = async (search: string, id: string | undefined , userSize : string | undefined) => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(search);

    const getAvailableSizes = await page.evaluate((userSize : string | undefined) => {
      if(userSize === 'OneSize') {
        return true;
      }
      const totalSizes = document.getElementsByClassName(
        "size-buttons-unified-size"
      ).length;

      if (totalSizes === 1) {
        return true;
      }
      const totalAvailableSizes = document.getElementsByClassName(
        "size-buttons-size-button"
      ).length;
      const availableSize = []; 
      for (let i = 0; i < totalAvailableSizes; i++) {
        const size = document.getElementsByClassName(
          "size-buttons-size-button"
        )[i].textContent;

        availableSize.push(size);
        if (userSize === size) {
          return true;
        }
      }
      if( userSize !== undefined ) {
        return false;
      } else {
        return true;
      }
    } , userSize);

    const price = await page.evaluate((getAvailableSizes) => {
      if( getAvailableSizes === false ) {
        return 1e9;
      }
      const price: number = parseInt(
        document
          .getElementsByClassName("pdp-price")[0]
          .textContent.substring(1)
          .replace(",", "")
      );
      return price;
    } , getAvailableSizes);

    if(userSize === undefined ) {
      userSize = 'OneSize';
    }

    await browser.close();
    if (id !== undefined) {
      saveToDB(search, id, price , userSize);
    }

    if( id === undefined ) {
      console.log(price);
    }
    return price;
  } catch (err) {
    console.log(err);
  }
};