const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { toJSON, paginate } = require('./plugins');

const checklistSchema = new Schema(
    {
        name: { 
            type: String,
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
checklistSchema.plugin(toJSON);
checklistSchema.plugin(paginate);

// full text search
checklistSchema.index({ "$**": "text" });

/**
 * @typedef Checklist
 */
const Checklist = model('Checklist', checklistSchema);

module.exports = Checklist;