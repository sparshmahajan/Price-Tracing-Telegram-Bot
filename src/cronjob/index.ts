import { CronJob } from "cron";
import { checkPrice } from "./checkPrice";

const job = new CronJob("00 00 * * * *", async () => {
  console.log("Cron job started");
    await checkPrice();
  } , null, true, "Asia/Kolkata"
);

export default async () => {
  job.start();
};