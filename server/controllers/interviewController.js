const Interview = require("../models/Interview");
const Application = require("../models/Application");
const Notification = require("../models/Notification");

const scheduleInterview = async (req, res) => {
    try {
        const {
            application,
            scheduledBy,
            scheduledAt,
            duration,
            meetingLink,
            notes
        } = req.body;

        if (!application || !scheduledBy || !scheduledAt) {
            return res.status(400).json({
                message: "Application, scheduler, and interview date/time are required"
            });
        }

        const existingApplication = await Application.findById(application);

        if (!existingApplication) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        if (
            existingApplication.status === "rejected" ||
            existingApplication.status === "withdrawn"
        ) {
            return res.status(400).json({
                message: "Cannot schedule an interview for this application"
            });
        }

        const interview = await Interview.create({
            application,
            scheduledBy,
            scheduledAt,
            duration: duration || 30,
            meetingLink: meetingLink || "",
            notes: notes || ""
        });

        await interview.populate([
            {
                path: "application",
                populate: {
                    path: "student",
                    select: "name email"
                }
            },
            {
                path: "scheduledBy",
                select: "name role companyName universityName"
            }
        ]);

        await Notification.create({
            user: existingApplication.student,
            type: "application",
            title: "Interview scheduled",
            message: `An interview has been scheduled for your application on ${new Date(
                scheduledAt
            ).toLocaleString()}.`,
            relatedApplication: existingApplication._id
        });

        res.status(201).json({
            message: "Interview scheduled successfully",
            interview
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getInterviewById = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id)
            .populate({
                path: "application",
                populate: {
                    path: "student",
                    select: "name email"
                }
            })
            .populate(
                "scheduledBy",
                "name email role companyName universityName"
            );

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found"
            });
        }

        res.status(200).json(interview);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getInterviewsForStudent = async (req, res) => {
    try {
        const applications = await Application.find({
            student: req.params.studentId
        }).select("_id");

        const applicationIds = applications.map(
            (application) => application._id
        );

        const interviews = await Interview.find({
            application: { $in: applicationIds }
        })
            .populate({
                path: "application",
                populate: {
                    path: "student",
                    select: "name email"
                }
            })
            .populate(
                "scheduledBy",
                "name email role companyName universityName"
            )
            .sort({ scheduledAt: 1 });

        res.status(200).json(interviews);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getInterviewsForApplication = async (req, res) => {
    try {
        const interviews = await Interview.find({
            application: req.params.applicationId
        })
            .populate({
                path: "application",
                populate: {
                    path: "student",
                    select: "name email"
                }
            })
            .populate(
                "scheduledBy",
                "name email role companyName universityName"
            )
            .sort({ scheduledAt: 1 });

        res.status(200).json(interviews);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateInterviewStatus = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found"
            });
        }

        const { status } = req.body;

        if (!["scheduled", "completed", "cancelled"].includes(status)) {
            return res.status(400).json({
                message: "Invalid interview status"
            });
        }

        interview.status = status;

        await interview.save();

        res.status(200).json({
            message: "Interview status updated successfully",
            interview
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const cancelInterview = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found"
            });
        }

        interview.status = "cancelled";

        await interview.save();

        await Notification.create({
            user: (
                await Application.findById(interview.application)
            ).student,
            type: "application",
            title: "Interview cancelled",
            message: "Your scheduled interview has been cancelled.",
            relatedApplication: interview.application
        });

        res.status(200).json({
            message: "Interview cancelled successfully",
            interview
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    scheduleInterview,
    getInterviewById,
    getInterviewsForStudent,
    getInterviewsForApplication,
    updateInterviewStatus,
    cancelInterview
};