const Application = require("../models/Application");
const Notification = require("../models/Notification");
const Activity = require("../models/Activity");

const Internship = require("../models/Internship");
const Scholarship = require("../models/Scholarship");


const getOpportunityDetails = async (
    opportunityId,
    opportunityType
) => {

    if (opportunityType === "Internship") {

        return Internship.findById(opportunityId)
            .select("title company");

    }

    return Scholarship.findById(opportunityId)
        .select("title university");
};


/*
    APPLY FOR OPPORTUNITY
*/

const applyForOpportunity = async (req, res) => {

    try {

        const {
            student,
            opportunity,
            opportunityType
        } = req.body;


        const existing = await Application.findOne({
            student,
            opportunity,
            status: {
                $in: ["pending", "accepted"]
            }
        });


        if (existing) {

            return res.status(400).json({
                message:
                    "You have already applied for this opportunity"
            });

        }


        const application =
            await Application.create({

                student,
                opportunity,
                opportunityType

            });


        const opportunityDetails =
            await getOpportunityDetails(
                opportunity,
                opportunityType
            );


        const opportunityName =
            opportunityDetails?.title ||
            `${opportunityType}`;


        /*
            NOTIFICATION
        */

        await Notification.create({

            user: student,

            type: "application",

            title:
                `Your application for ${opportunityName} is pending`,

            message:
                `Your application for ${opportunityName} is pending.`,

            relatedApplication:
                application._id

        });


        /*
            ACTIVITY LOG
        */

        await Activity.create({

            user: student,

            type: "application_submitted",

            title: "Application Submitted",

            message:
                `You applied for ${opportunityName}.`,

            relatedApplication:
                application._id,

            relatedOpportunity:
                opportunity,

            opportunityType

        });


        res.status(201).json({

            message:
                "Application submitted successfully",

            application

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


/*
    GET APPLICATIONS FOR OPPORTUNITY
*/

const getApplicationsForOpportunity = async (
    req,
    res
) => {

    try {

        const applications =
            await Application.find({

                opportunity:
                    req.params.opportunityId

            })
                .populate(
                    "student",
                    "name email"
                )
                .sort({
                    createdAt: 1
                });


        res.status(200).json(
            applications
        );

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


/*
    GET MY APPLICATIONS
*/

const getMyApplications = async (
    req,
    res
) => {

    try {

        const applications =
            await Application.find({

                student:
                    req.params.studentId

            })
                .sort({
                    createdAt: -1
                });


        res.status(200).json(
            applications
        );

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


/*
    UPDATE APPLICATION STATUS
*/

const updateApplicationStatus = async (
    req,
    res
) => {

    try {

        const application =
            await Application.findById(
                req.params.id
            );


        if (!application) {

            return res.status(404).json({
                message:
                    "Application not found"
            });

        }


        const nextStatus =
            req.body.status ||
            application.status;

        const previousStatus =
            application.status;


        application.status =
            nextStatus;


        await application.save();


        /*
            ONLY CREATE ACTIVITY
            WHEN STATUS ACTUALLY CHANGES
        */

        if (
            nextStatus !== previousStatus &&
            (
                nextStatus === "accepted" ||
                nextStatus === "rejected"
            )
        ) {

            const readableStatus =
                nextStatus
                    .charAt(0)
                    .toUpperCase() +
                nextStatus.slice(1);


            const opportunityDetails =
                await getOpportunityDetails(
                    application.opportunity,
                    application.opportunityType
                );


            const opportunityName =
                opportunityDetails?.title ||
                `${application.opportunityType}`;


            /*
                NOTIFICATION
            */

            await Notification.create({

                user:
                    application.student,

                type:
                    "application",

                title:
                    `Your application for ${opportunityName} is ${readableStatus.toLowerCase()}`,

                message:
                    `Your application for ${opportunityName} has been ${nextStatus}.`,

                relatedApplication:
                    application._id

            });


            /*
                ACTIVITY
            */

            await Activity.create({

                user:
                    application.student,

                type:
                    nextStatus === "accepted"
                        ? "application_accepted"
                        : "application_rejected",

                title:
                    `Application ${readableStatus}`,

                message:
                    `Your application for ${opportunityName} has been ${nextStatus}.`,

                relatedApplication:
                    application._id,

                relatedOpportunity:
                    application.opportunity,

                opportunityType:
                    application.opportunityType

            });

        }


        res.json({

            message:
                "Application status updated successfully",

            application

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


/*
    WITHDRAW APPLICATION
*/

const withdrawApplication = async (
    req,
    res
) => {

    try {

        const application =
            await Application.findById(
                req.params.id
            );


        if (!application) {

            return res.status(404).json({
                message:
                    "Application not found"
            });

        }


        application.status =
            "withdrawn";


        await application.save();


        const opportunityDetails =
            await getOpportunityDetails(
                application.opportunity,
                application.opportunityType
            );


        const opportunityName =
            opportunityDetails?.title ||
            `${application.opportunityType}`;


        /*
            NOTIFICATION
        */

        await Notification.create({

            user:
                application.student,

            type:
                "application",

            title:
                `You withdrew your application for ${opportunityName}`,

            message:
                `You withdrew your application for ${opportunityName}.`,

            relatedApplication:
                application._id

        });


        /*
            ACTIVITY
        */

        await Activity.create({

            user:
                application.student,

            type:
                "application_withdrawn",

            title:
                "Application Withdrawn",

            message:
                `You withdrew your application for ${opportunityName}.`,

            relatedApplication:
                application._id,

            relatedOpportunity:
                application.opportunity,

            opportunityType:
                application.opportunityType

        });


        res.json({

            message:
                "Application withdrawn successfully",

            application

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


/*
    GET APPLICATIONS FOR OWNER
*/

const getApplicationsForOwner = async (
    req,
    res
) => {

    try {

        const {
            ownerId
        } = req.params;


        const internships =
            await Internship.find({

                createdBy:
                    ownerId

            })
                .select("_id");


        const scholarships =
            await Scholarship.find({

                createdBy:
                    ownerId

            })
                .select("_id");


        const internshipIds =
            internships.map(
                internship =>
                    internship._id
            );


        const scholarshipIds =
            scholarships.map(
                scholarship =>
                    scholarship._id
            );


        const applications =
            await Application.find({

                $or: [

                    {
                        opportunityType:
                            "Internship",

                        opportunity: {
                            $in: internshipIds
                        }
                    },

                    {
                        opportunityType:
                            "Scholarship",

                        opportunity: {
                            $in: scholarshipIds
                        }
                    }

                ]

            })
                .populate(
                    "student",
                    "name email profilePicture"
                )
                .sort({
                    createdAt: -1
                });


        res.status(200).json(
            applications
        );

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

    getApplicationsForOwner,

    updateApplicationStatus,

    withdrawApplication

};