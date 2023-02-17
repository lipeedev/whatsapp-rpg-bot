import { model, Schema } from "mongoose";

const shopSchema = new Schema({
    _id: { type: Number, default: 1 },
    items: [{
        type: { type: String },
        category: String,
        isSingle: Boolean,
        value: String,
        coast: Number
    }]
});

export const Shop = model('Shop', shopSchema);