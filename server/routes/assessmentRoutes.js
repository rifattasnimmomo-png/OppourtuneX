const express = require("express");

const router = express.Router();

const {
    createAssessment,
    getAssessmentById,
    getAssessmentsForCreator,
    getAssessmentsForOpportunity,
    submitAssessment,
    getStudentResult,
    getAllSubmissions
} = require("../controllers/assessmentController");

router.post("/", createAssessment);

router.get("/creator/:creatorId", getAssessmentsForCreator);

router.get(
    "/opportunity/:opportunityId",
    getAssessmentsForOpportunity
);

router.get("/:id", getAssessmentById);

router.post("/:id/submit", submitAssessment);

router.get(
    "/:id/result/:studentId",
    getStudentResult
);

router.get(
    "/:id/submissions",
    getAllSubmissions
);

module.exports = router;