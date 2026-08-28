const Assessment = require("../models/Assessment");

const createAssessment = async (req, res) => {
    try {
        const {
            title,
            description,
            createdBy,
            opportunity,
            opportunityType,
            questions,
            duration
        } = req.body;

        if (!title || !createdBy || !questions || questions.length === 0) {
            return res.status(400).json({
                message: "Title, creator, and at least one question are required"
            });
        }

        for (const question of questions) {
            if (
                !question.question ||
                !Array.isArray(question.options) ||
                question.options.length !== 4 ||
                question.correctAnswer === undefined
            ) {
                return res.status(400).json({
                    message:
                        "Each question must have a question, exactly 4 options, and a correct answer"
                });
            }

            if (
                question.correctAnswer < 0 ||
                question.correctAnswer > 3
            ) {
                return res.status(400).json({
                    message:
                        "Correct answer must be between 0 and 3"
                });
            }
        }

        const assessment = await Assessment.create({
            title,
            description: description || "",
            createdBy,
            opportunity: opportunity || undefined,
            opportunityType: opportunityType || undefined,
            questions,
            duration: duration || 30
        });

        res.status(201).json({
            message: "Assessment created successfully",
            assessment
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const getAssessmentById = async (req, res) => {
    try {
        const assessment = await Assessment.findById(
            req.params.id
        )
            .populate(
                "createdBy",
                "name email role companyName universityName"
            );

        if (!assessment) {
            return res.status(404).json({
                message: "Assessment not found"
            });
        }

        res.status(200).json(assessment);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const getAssessmentsForCreator = async (req, res) => {
    try {
        const assessments = await Assessment.find({
            createdBy: req.params.creatorId
        })
            .sort({
                createdAt: -1
            });

        res.status(200).json(assessments);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const getAssessmentsForOpportunity = async (req, res) => {
    try {
        const assessments = await Assessment.find({
            opportunity: req.params.opportunityId
        })
            .sort({
                createdAt: -1
            });

        res.status(200).json(assessments);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const submitAssessment = async (req, res) => {
    try {
        const { student, answers } = req.body;

        if (!student || !Array.isArray(answers)) {
            return res.status(400).json({
                message: "Student and answers are required"
            });
        }

        const assessment = await Assessment.findById(
            req.params.id
        );

        if (!assessment) {
            return res.status(404).json({
                message: "Assessment not found"
            });
        }

        const alreadySubmitted = assessment.submissions.some(
            (submission) =>
                submission.student.toString() === student.toString()
        );

        if (alreadySubmitted) {
            return res.status(400).json({
                message: "You have already submitted this assessment"
            });
        }

        let score = 0;

        const processedAnswers = assessment.questions.map(
            (question) => {
                const submittedAnswer = answers.find(
                    (answer) =>
                        answer.questionId.toString() ===
                        question._id.toString()
                );

                const selectedAnswer =
                    submittedAnswer
                        ? Number(submittedAnswer.selectedAnswer)
                        : -1;

                if (
                    selectedAnswer ===
                    question.correctAnswer
                ) {
                    score++;
                }

                return {
                    questionId: question._id,
                    selectedAnswer
                };
            }
        );

        const submission = {
            student,
            answers: processedAnswers,
            score,
            totalQuestions: assessment.questions.length,
            submittedAt: new Date()
        };

        assessment.submissions.push(submission);

        await assessment.save();

        res.status(200).json({
            message: "Assessment submitted successfully",
            result: {
                score,
                totalQuestions: assessment.questions.length,
                percentage:
                    assessment.questions.length > 0
                        ? Math.round(
                              (score /
                                  assessment.questions.length) *
                                  100
                          )
                        : 0
            }
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const getStudentResult = async (req, res) => {
    try {
        const assessment = await Assessment.findById(
            req.params.id
        );

        if (!assessment) {
            return res.status(404).json({
                message: "Assessment not found"
            });
        }

        const submission = assessment.submissions.find(
            (item) =>
                item.student.toString() ===
                req.params.studentId.toString()
        );

        if (!submission) {
            return res.status(404).json({
                message: "No submission found for this student"
            });
        }

        res.status(200).json({
            assessmentId: assessment._id,
            assessmentTitle: assessment.title,
            score: submission.score,
            totalQuestions: submission.totalQuestions,
            percentage:
                submission.totalQuestions > 0
                    ? Math.round(
                          (submission.score /
                              submission.totalQuestions) *
                              100
                      )
                    : 0,
            submittedAt: submission.submittedAt
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const getAllSubmissions = async (req, res) => {
    try {
        const assessment = await Assessment.findById(
            req.params.id
        )
            .populate(
                "submissions.student",
                "name email profilePicture"
            );

        if (!assessment) {
            return res.status(404).json({
                message: "Assessment not found"
            });
        }

        res.status(200).json(
            assessment.submissions
        );
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    createAssessment,
    getAssessmentById,
    getAssessmentsForCreator,
    getAssessmentsForOpportunity,
    submitAssessment,
    getStudentResult,
    getAllSubmissions
};