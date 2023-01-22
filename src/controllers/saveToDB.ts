import Pricing from "../models/price.model";

export const saveToDB = async (search: string, id: string, price: number) => {
  console.log(id);
  const find = await Pricing.findOne({ product: search });
  if (find) {
    const update = await Pricing.findOneAndUpdate(
        { product : search }, { $addToSet: { userId: id } } , { new: true }
    );

  } else {
    const array = [id];
    const pricing = new Pricing({
      product: search,
      userId: array,
      price: price,
    });
    pricing.save();
  }
};