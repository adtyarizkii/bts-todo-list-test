const Checklist = require('../models/checklist.model');
const Item = require('../models/item.model');

exports.createChecklist = async (req, res) => {
  const checklist = await Checklist.create({
    name: req.body.name,
    userId: req.user._id
  });
  res.json(checklist);
};

exports.getChecklists = async (req, res) => {
  const checklists = await Checklist.find({ userId: req.user._id });
  res.json(checklists);
};

exports.getChecklistDetail = async (req, res) => {
  const checklist = await Checklist.findById(req.params.id);
  const items = await Item.find({ checklistId: req.params.id });
  res.json({ checklist, items });
};

exports.deleteChecklist = async (req, res) => {
  await Item.deleteMany({ checklistId: req.params.id });
  await Checklist.findByIdAndDelete(req.params.id);
  res.json({ message: 'Checklist deleted' });
};
