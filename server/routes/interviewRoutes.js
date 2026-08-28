const express = require("express");

const router = express.Router();

const {
    scheduleInterview,
    getInterviewById,
    getInterviewsForStudent,
    getInterviewsForApplication,
    updateInterviewStatus,
    cancelInterview
} = require("../controllers/interviewController");

router.post("/", scheduleInterview);

router.get("/student/:studentId", getInterviewsForStudent);

router.get(
    "/application/:applicationId",
    getInterviewsForApplication
);

router.get("/:id", getInterviewById);

router.put("/:id/status", updateInterviewStatus);

router.put("/:id/cancel", cancelInterview);

module.exports = router;