const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
    {
        application: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Application",
            required: true
        },

        scheduledBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        scheduledAt: {
            type: Date,
            required: true
        },

        duration: {
            type: Number,
            default: 30
        },

        meetingLink: {
            type: String,
            default: ""
        },

        notes: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: ["scheduled", "completed", "cancelled"],
            default: "scheduled"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Interview", interviewSchema);