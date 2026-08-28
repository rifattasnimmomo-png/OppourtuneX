const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
            trim: true
        },

        options: {
            type: [String],
            required: true,
            validate: {
                validator: function (value) {
                    return value.length === 4;
                },
                message: "Each question must have exactly 4 options"
            }
        },

        correctAnswer: {
            type: Number,
            required: true,
            min: 0,
            max: 3
        }
    },
    {
        _id: true
    }
);

const assessmentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        opportunity: {
            type: mongoose.Schema.Types.ObjectId,
            required: false
        },

        opportunityType: {
            type: String,
            enum: ["Internship", "Scholarship"],
            required: false
        },

        questions: {
            type: [questionSchema],
            required: true,
            validate: {
                validator: function (value) {
                    return value.length > 0;
                },
                message: "An assessment must contain at least one question"
            }
        },

        duration: {
            type: Number,
            default: 30
        },

        submissions: [
            {
                student: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },

                answers: [
                    {
                        questionId: {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true
                        },

                        selectedAnswer: {
                            type: Number,
                            required: true
                        }
                    }
                ],

                score: {
                    type: Number,
                    required: true
                },

                totalQuestions: {
                    type: Number,
                    required: true
                },

                submittedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Assessment", assessmentSchema);