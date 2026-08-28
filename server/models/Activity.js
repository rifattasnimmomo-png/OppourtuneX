const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        type: {
            type: String,
            enum: [
                "application_submitted",
                "application_accepted",
                "application_rejected",
                "application_withdrawn"
            ],
            required: true
        },

        title: {
            type: String,
            required: true
        },

        message: {
            type: String,
            required: true
        },

        relatedApplication: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Application"
        },

        relatedOpportunity: {
            type: mongoose.Schema.Types.ObjectId
        },

        opportunityType: {
            type: String,
            enum: ["Internship", "Scholarship"]
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Activity", activitySchema);