const Item = require('../models/item.model');

exports.addItem = async (req, res) => {
  const item = await Item.create({
    itemName: req.body.itemName,
    checklistId: req.params.checklistId
  });
  res.json(item);
};

exports.updateItem = async (req, res) => {
  const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.toggleStatus = async (req, res) => {
  const item = await Item.findById(req.params.id);
  item.isDone = !item.isDone;
  await item.save();
  res.json(item);
};

exports.deleteItem = async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: 'Item deleted' });
};
