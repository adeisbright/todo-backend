const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ItemSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    user_id: Number,
    status: {
        type: String,
        default: "p",
        enum: ["p", "c", "i"],
    },
    description: String,
    todo_avatar: String,
    created_at: {
        type: Date,
        default: Date.now(),
    },
    startDate: Date,
    endDate: Date,
});

ItemSchema.index({ "$**": "text", created_at: -1 }, { weights: { title: 1 } });
module.exports = mongoose.model("item", ItemSchema);
