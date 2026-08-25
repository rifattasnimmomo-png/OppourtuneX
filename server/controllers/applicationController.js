const Application = require("../models/Application");
const Notification = require("../models/Notification");
const Internship = require("../models/Internship");
const Scholarship = require("../models/Scholarship");

const getOpportunityDetails = async (opportunityId, opportunityType) => {
    if (opportunityType === "Internship") {
        return Internship.findById(opportunityId).select("title company");
    }

    return Scholarship.findById(opportunityId).select("title university");
};

const applyForOpportunity = async (req, res) => {
    try {
        const { student, opportunity, opportunityType } = req.body;

        const existing = await Application.findOne({
            student,
            opportunity,
            status: { $in: ["pending", "accepted"] }
        });

        if (existing) {
            return res.status(400).json({
                message: "You have already applied for this opportunity"
            });
        }

        const application = await Application.create({
            student,
            opportunity,
            opportunityType
        });

        const opportunityDetails = await getOpportunityDetails(
            opportunity,
            opportunityType
        );

        const opportunityName =
            opportunityDetails?.title || `${opportunityType}`;

        await Notification.create({
            user: student,
            type: "application",
            title: `Your application for ${opportunityName} is pending`,
            message: `Your application for ${opportunityName} is pending.`,
            relatedApplication: application._id
        });

        res.status(201).json({
            message: "Application submitted successfully",
            application
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getApplicationsForOpportunity = async (req, res) => {
    try {
        const applications = await Application.find({
            opportunity: req.params.opportunityId
        })
            .populate("student", "name email")
            .sort({
                createdAt: 1
            });

        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({
            student: req.params.studentId
        }).sort({
            createdAt: -1
        });

        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateApplicationStatus = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        const nextStatus = req.body.status || application.status;
        const previousStatus = application.status;

        application.status = nextStatus;

        await application.save();

        if (
            nextStatus !== previousStatus &&
            (nextStatus === "accepted" || nextStatus === "rejected")
        ) {
            const readableStatus =
                nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1);

            const opportunityDetails = await getOpportunityDetails(
                application.opportunity,
                application.opportunityType
            );

            const opportunityName =
                opportunityDetails?.title ||
                `${application.opportunityType}`;

            await Notification.create({
                user: application.student,
                type: "application",
                title: `Your application for ${opportunityName} is ${readableStatus.toLowerCase()}`,
                message: `Your application for ${opportunityName} has been ${nextStatus}.`,
                relatedApplication: application._id
            });
        }

        res.json({
            message: "Application status updated successfully",
            application
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const withdrawApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        application.status = "withdrawn";

        await application.save();

        const opportunityDetails = await getOpportunityDetails(
            application.opportunity,
            application.opportunityType
        );

        const opportunityName =
            opportunityDetails?.title ||
            `${application.opportunityType}`;

        await Notification.create({
            user: application.student,
            type: "application",
            title: `You withdrew your application for ${opportunityName}`,
            message: `You withdrew your application for ${opportunityName}.`,
            relatedApplication: application._id
        });

        res.json({
            message: "Application withdrawn successfully",
            application
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    applyForOpportunity,
    getApplicationsForOpportunity,
    getMyApplications,
    updateApplicationStatus,
    withdrawApplication
};