const { Schema, model } = require("mongoose");

const playerSchema = new Schema({
    _id: { type: String },
    name: { type: String, default: 'vazio' },
    category: { type: String, default: 'vazio' },
    hp: { type: Number, default: 30 },
    stamina: { type: Number, default: 300 },
    money: { type: Number, default: 1000 },
    inventory: [{ 
        type: { type: String }, 
        category: { type: String },
        value: { type: String }, 
        amount: { type: Number } 
    }]
});

module.exports = model('Player', playerSchema);