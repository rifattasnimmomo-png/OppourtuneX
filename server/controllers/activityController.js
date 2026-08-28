const Activity = require("../models/Activity");

const getMyActivities = async (req, res) => {
    try {
        const activities = await Activity.find({
            user: req.params.userId
        })
            .populate(
                "relatedApplication",
                "status opportunityType createdAt updatedAt"
            )
            .sort({
                createdAt: -1
            });

        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getMyActivities
};