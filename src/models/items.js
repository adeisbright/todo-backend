const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ItemSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        userId: Number,
        status: {
            type: String,
            default: "p",
            enum: ["p", "c", "i"],
        },
        description: String,
        todo_avatar: String,
        startDate: Date,
        startTime: String,
        startNum: Number,
        dueDate: Date,
        dueTime: String,
        endNum: Number,
    },
    { timestamps: true }
);

ItemSchema.index({ "$**": "text", created_at: -1 }, { weights: { title: 1 } });
module.exports = mongoose.model("item", ItemSchema);
