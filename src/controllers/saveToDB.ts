import Pricing from "../models/price.model";

export const saveToDB = async (search: string, id: string, price: number, userNeededSize: string) => {
  const find = await Pricing.findOne({ $and: [{ product: search }, { userId: id } , { userNeededSize: userNeededSize }] });
  if (!find) {
    const newPrice = new Pricing({
      product: search,
      userId: id,
      price: price,
      userNeededSize: userNeededSize,
    });
    await newPrice.save();
  } 
};
