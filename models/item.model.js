const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { toJSON, paginate } = require('./plugins');

const itemSchema = new Schema(
    {
        itemName: { 
            type: String,
            required: true,
        },
        isDone: {
            type: Boolean,
            default: false
        },
        checklistId: {
            type: Schema.Types.ObjectId,
            ref: 'Checklist'
        }
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
itemSchema.plugin(toJSON);
itemSchema.plugin(paginate);

// full text search
itemSchema.index({ "$**": "text" });

/**
 * @typedef Item
 */
const Item = model('Item', itemSchema);

module.exports = Item;