import mongoose from "mongoose";

export interface IPricing extends mongoose.Document {
    product: string;
    userId: string;
    price: number;
}

const pricingSchema = new mongoose.Schema({
    product: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: [String],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Pricing = mongoose.model("Pricing", pricingSchema);

export default Pricing;