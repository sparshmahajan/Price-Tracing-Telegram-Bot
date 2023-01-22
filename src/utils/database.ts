import mongoose, {
  connect,
  ConnectOptions,
} from "mongoose";
const mongoURL: string = process.env.MONGODB_URL || "";
mongoose.set("strictQuery", true);

interface IConnectOptions extends ConnectOptions {
  useNewUrlParser: boolean;
  useUnifiedTopology: boolean;
}

const options: IConnectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export const db = {
  connect: () => {
    connect(mongoURL, options as IConnectOptions, (error: any) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Connected to MongoDB");
      }
    });
  },
};