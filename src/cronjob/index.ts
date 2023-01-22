import { CronJob } from "cron";
import { checkPrice } from "./checkPrice";

const job = new CronJob("59 29 * * * *", async () => {
    console.log(new Date());
    await checkPrice();
  },null,true,"Asia/Kolkata"
);

export default async () => {
  job.start();
};