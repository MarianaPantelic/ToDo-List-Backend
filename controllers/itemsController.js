const Item = require("../models/item");
const createError = require("http-errors");

exports.getItems = async (req, res, next) => {
  const items = await Item.find({}); // {} - is optional
  res.status(200).send(items);
};

exports.createItem = async (req, res, next) => {
  const body = req.body;
  try {
    const item = new Item(body);
    await item.save();
    // res.status(201).json(item);
    res.status(201).send(item);
  } catch (error) {
    next(error);
  }
};

exports.getItem = async (req, res, next) => {
  const { id } = req.params;
  try {
    const item = await Item.findById(id);
    if (!item) throw new createError.NotFound();
    res.status(200).send(item);
  } catch (error) {
    next(error);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    const item = Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!item) {
      throw new createError.NotFound();
    }
    res.status(201).send(item);
  } catch (error) {
    next(error);
  }
};

exports.deleteItem = async (req, res, next) => {
  const item = await Item.findByIdAndDelete(req.params.id);
  res.status(200).send({ message: "Deleted successfully" });
};
