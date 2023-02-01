const { Schema, model } = require("mongoose");

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

module.exports = model('Shop', shopSchema);