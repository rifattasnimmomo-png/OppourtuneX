const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Badge = require("./models/Badge");

dotenv.config({
    path: __dirname + "/.env"
});

const badges = [
    {
        name: "First Application",
        description: "Submit your first internship or scholarship application.",
        icon: "🎯",
        requirementType: "applications",
        requirementCount: 1
    },
    {
        name: "Application Explorer",
        description: "Submit 5 internship or scholarship applications.",
        icon: "🚀",
        requirementType: "applications",
        requirementCount: 5
    },
    {
        name: "Application Champion",
        description: "Submit 10 internship or scholarship applications.",
        icon: "🏆",
        requirementType: "applications",
        requirementCount: 10
    },
    {
        name: "First Acceptance",
        description: "Get your first application accepted.",
        icon: "🎉",
        requirementType: "accepted",
        requirementCount: 1
    },
    {
        name: "Internship Hunter",
        description: "Apply to 3 internship opportunities.",
        icon: "💼",
        requirementType: "internship",
        requirementCount: 3
    },
    {
        name: "Scholarship Hunter",
        description: "Apply to 3 scholarship opportunities.",
        icon: "🎓",
        requirementType: "scholarship",
        requirementCount: 3
    },
    {
        name: "Assessment Starter",
        description: "Complete your first assessment.",
        icon: "📝",
        requirementType: "assessments",
        requirementCount: 1
    },
    {
        name: "Assessment Pro",
        description: "Complete 5 assessments.",
        icon: "⭐",
        requirementType: "assessments",
        requirementCount: 5
    }
];

const seedBadges = async () => {

    try {

        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {
            throw new Error(
                "MONGODB_URI is not defined in server/.env"
            );
        }

        await mongoose.connect(mongoUri);

        console.log("Connected to MongoDB.");

        for (const badge of badges) {

            await Badge.findOneAndUpdate(
                {
                    name: badge.name
                },
                badge,
                {
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: true
                }
            );

            console.log(
                `Badge ready: ${badge.name}`
            );
        }

        console.log("All badges seeded successfully.");

        await mongoose.disconnect();

        process.exit(0);

    } catch (error) {

        console.error(
            "Failed to seed badges:",
            error.message
        );

        try {
            await mongoose.disconnect();
        } catch (disconnectError) {
            console.log(disconnectError.message);
        }

        process.exit(1);
    }
};

seedBadges();