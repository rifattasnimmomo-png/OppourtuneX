const Badge = require("../models/Badge");
const UserBadge = require("../models/UserBadge");
const Application = require("../models/Application");
const Assessment = require("../models/Assessment");

const getMyBadges = async (req, res) => {
    try {
        const userId = req.params.userId;

        const badges = await Badge.find()
            .sort({ requirementType: 1, requirementCount: 1 });

        const earnedBadges = await UserBadge.find({
            user: userId
        }).populate("badge");

        const earnedMap = new Map();

        earnedBadges.forEach((item) => {
            if (item.badge) {
                earnedMap.set(
                    item.badge._id.toString(),
                    item.earnedAt
                );
            }
        });

        const applications = await Application.find({
            student: userId
        });

        const totalApplications = applications.length;

        const acceptedApplications = applications.filter(
            (application) =>
                application.status === "accepted"
        ).length;

        const internshipApplications = applications.filter(
            (application) =>
                application.opportunityType === "Internship"
        ).length;

        const scholarshipApplications = applications.filter(
            (application) =>
                application.opportunityType === "Scholarship"
        ).length;

        const assessments = await Assessment.find({
            "submissions.student": userId
        });

        const completedAssessments = assessments.length;

        const result = [];

        for (const badge of badges) {
            let progress = 0;

            if (badge.requirementType === "applications") {
                progress = totalApplications;
            }

            if (badge.requirementType === "accepted") {
                progress = acceptedApplications;
            }

            if (badge.requirementType === "internship") {
                progress = internshipApplications;
            }

            if (badge.requirementType === "scholarship") {
                progress = scholarshipApplications;
            }

            if (badge.requirementType === "assessments") {
                progress = completedAssessments;
            }

            const earned =
                progress >= badge.requirementCount;

            let earnedAt =
                earnedMap.get(
                    badge._id.toString()
                ) || null;

            if (earned && !earnedAt) {
                const newUserBadge =
                    await UserBadge.create({
                        user: userId,
                        badge: badge._id
                    });

                earnedAt = newUserBadge.earnedAt;
            }

            result.push({
                _id: badge._id,
                name: badge.name,
                description: badge.description,
                icon: badge.icon,
                requirementType:
                    badge.requirementType,
                requirementCount:
                    badge.requirementCount,
                progress,
                earned,
                earnedAt
            });
        }

        res.status(200).json(result);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    getMyBadges
};