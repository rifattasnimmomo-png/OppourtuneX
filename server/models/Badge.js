const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },

        description: {
            type: String,
            required: true
        },

        icon: {
            type: String,
            default: "🏆"
        },

        requirementType: {
            type: String,
            enum: [
                "applications",
                "accepted",
                "internship",
                "scholarship",
                "assessments"
            ],
            required: true
        },

        requirementCount: {
            type: Number,
            default: 1
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Badge", badgeSchema);