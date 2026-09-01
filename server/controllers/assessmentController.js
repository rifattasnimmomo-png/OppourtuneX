const Assessment = require("../models/Assessment");

// ================= CREATE ASSESSMENT =================

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

        if (
            !title ||
            !createdBy ||
            !Array.isArray(questions) ||
            questions.length === 0
        ) {
            return res.status(400).json({
                message:
                    "Title, creator, and at least one question are required."
            });
        }

        for (const question of questions) {
            if (
                !question.question ||
                !Array.isArray(question.options) ||
                question.options.length !== 4 ||
                question.correctAnswer === undefined ||
                Number(question.correctAnswer) < 0 ||
                Number(question.correctAnswer) > 3
            ) {
                return res.status(400).json({
                    message:
                        "Each question must have a question, exactly 4 options, and a correct answer between 0 and 3."
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

        return res.status(201).json({
            message: "Assessment created successfully.",
            assessment
        });
    } catch (error) {
        console.error("CREATE ASSESSMENT ERROR:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};


// ================= GET ONE ASSESSMENT =================

const getAssessmentById = async (req, res) => {
    try {
        const assessment = await Assessment.findById(
            req.params.id
        ).populate(
            "createdBy",
            "name email role companyName universityName"
        );

        if (!assessment) {
            return res.status(404).json({
                message: "Assessment not found."
            });
        }

        return res.status(200).json(assessment);
    } catch (error) {
        console.error("GET ASSESSMENT ERROR:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};


// ================= GET CREATOR ASSESSMENTS =================

const getAssessmentsForCreator = async (req, res) => {
    try {
        const assessments = await Assessment.find({
            createdBy: req.params.creatorId
        }).sort({
            createdAt: -1
        });

        return res.status(200).json(assessments);
    } catch (error) {
        console.error(
            "GET CREATOR ASSESSMENTS ERROR:",
            error
        );

        return res.status(500).json({
            message: error.message
        });
    }
};


// ================= GET OPPORTUNITY ASSESSMENTS =================

const getAssessmentsForOpportunity = async (req, res) => {
    try {
        const assessments = await Assessment.find({
            opportunity: req.params.opportunityId
        }).sort({
            createdAt: -1
        });

        return res.status(200).json(assessments);
    } catch (error) {
        console.error(
            "GET OPPORTUNITY ASSESSMENTS ERROR:",
            error
        );

        return res.status(500).json({
            message: error.message
        });
    }
};


// ================= SUBMIT ASSESSMENT =================

const submitAssessment = async (req, res) => {
    try {
        const assessment = await Assessment.findById(
            req.params.id
        );

        if (!assessment) {
            return res.status(404).json({
                message: "Assessment not found."
            });
        }

        const {
            student,
            answers
        } = req.body;

        if (
            !student ||
            !Array.isArray(answers)
        ) {
            return res.status(400).json({
                message:
                    "Student and answers are required."
            });
        }

        if (
            answers.length !==
            assessment.questions.length
        ) {
            return res.status(400).json({
                message:
                    "Please answer all questions before submitting."
            });
        }

        const existingSubmission =
            assessment.submissions.find(
                (submission) =>
                    submission.student.toString() ===
                    student.toString()
            );

        if (existingSubmission) {
            return res.status(400).json({
                message:
                    "You have already submitted this assessment."
            });
        }

        let score = 0;

        const formattedAnswers =
            assessment.questions.map((question) => {
                const submittedAnswer =
                    answers.find(
                        (answer) =>
                            answer.questionId &&
                            answer.questionId.toString() ===
                            question._id.toString()
                    );

                if (!submittedAnswer) {
                    throw new Error(
                        "Answer missing for question: " +
                        question._id.toString()
                    );
                }

                const selectedAnswer =
                    Number(
                        submittedAnswer.selectedAnswer
                    );

                if (
                    !Number.isInteger(selectedAnswer) ||
                    selectedAnswer < 0 ||
                    selectedAnswer > 3
                ) {
                    throw new Error(
                        "Invalid answer selected."
                    );
                }

                const isCorrect =
                    selectedAnswer ===
                    Number(question.correctAnswer);

                if (isCorrect) {
                    score++;
                }

                return {
                    questionId: question._id,
                    selectedAnswer: selectedAnswer,
                    isCorrect: isCorrect
                };
            });

        const submission = {
            student: student,
            answers: formattedAnswers,
            score: score,
            totalQuestions: assessment.questions.length,
            submittedAt: new Date()
        };

        assessment.submissions.push(submission);

        await assessment.save();

        return res.status(201).json({
            message:
                "Assessment submitted successfully.",
            score: score,
            totalQuestions:
                assessment.questions.length,
            submittedAt:
                submission.submittedAt
        });

    } catch (error) {
        console.error(
            "SUBMIT ASSESSMENT ERROR:",
            error
        );

        return res.status(500).json({
            message: error.message
        });
    }
};


// ================= STUDENT RESULT =================

const getStudentResult = async (req, res) => {
    try {
        const assessment =
            await Assessment.findById(
                req.params.id
            );

        if (!assessment) {
            return res.status(404).json({
                message:
                    "Assessment not found."
            });
        }

        const submission =
            assessment.submissions.find(
                (submission) =>
                    submission.student.toString() ===
                    req.params.studentId.toString()
            );

        if (!submission) {
            return res.status(404).json({
                message:
                    "No submission found."
            });
        }

        const totalQuestions =
            submission.totalQuestions ||
            assessment.questions.length;

        const percentage =
            totalQuestions > 0
                ? Math.round(
                    (submission.score /
                        totalQuestions) *
                    100
                )
                : 0;

        return res.status(200).json({
            assessmentId:
                assessment._id,

            assessmentTitle:
                assessment.title,

            score:
                submission.score,

            totalQuestions:
                totalQuestions,

            percentage:
                percentage,

            submittedAt:
                submission.submittedAt
        });

    } catch (error) {
        console.error(
            "GET STUDENT RESULT ERROR:",
            error
        );

        return res.status(500).json({
            message: error.message
        });
    }
};


// ================= COMPANY VIEW SUBMISSIONS =================

const getAllSubmissions = async (req, res) => {
    try {
        const assessment =
            await Assessment.findById(
                req.params.id
            ).populate(
                "submissions.student",
                "name email profilePicture"
            );

        if (!assessment) {
            return res.status(404).json({
                message:
                    "Assessment not found."
            });
        }

        const submissions =
            assessment.submissions.map(
                (submission) => {

                    const answers =
                        submission.answers.map(
                            (answer) => {

                                const question =
                                    assessment.questions.find(
                                        (q) =>
                                            q._id.toString() ===
                                            answer.questionId.toString()
                                    );

                                if (!question) {
                                    return {
                                        question:
                                            "Question not found",

                                        selectedAnswer:
                                            "Unknown",

                                        correctAnswer:
                                            "Unknown",

                                        isCorrect:
                                            false
                                    };
                                }

                                const selectedAnswer =
                                    Number(
                                        answer.selectedAnswer
                                    );

                                const correctAnswer =
                                    Number(
                                        question.correctAnswer
                                    );

                                return {
                                    question:
                                        question.question,

                                    selectedAnswer:
                                        question.options[
                                            selectedAnswer
                                        ],

                                    correctAnswer:
                                        question.options[
                                            correctAnswer
                                        ],

                                    isCorrect:
                                        selectedAnswer ===
                                        correctAnswer
                                };
                            }
                        );

                    return {
                        _id:
                            submission._id,

                        student:
                            submission.student,

                        score:
                            submission.score,

                        totalQuestions:
                            submission.totalQuestions ||
                            assessment.questions.length,

                        submittedAt:
                            submission.submittedAt,

                        answers:
                            answers
                    };
                }
            );

        return res.status(200).json(
            submissions
        );

    } catch (error) {
        console.error(
            "GET SUBMISSIONS ERROR:",
            error
        );

        return res.status(500).json({
            message: error.message
        });
    }
};


// ================= EXPORTS =================

module.exports = {
    createAssessment,
    getAssessmentById,
    getAssessmentsForCreator,
    getAssessmentsForOpportunity,
    submitAssessment,
    getStudentResult,
    getAllSubmissions
};