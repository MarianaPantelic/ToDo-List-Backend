const mongoose = require("mongoose");

//models
const { Schema } = mongoose;

//schema
const ItemSchema = new Schema({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
});
// model
const Item = mongoose.model("Item", ItemSchema);

module.exports = Item;
