import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getAssessmentById,
    submitAssessment
} from "../services/assessmentService";

function TakeAssessment() {
    const { id } = useParams();
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isStudent = user.role === "student";

    const [assessment, setAssessment] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadAssessment();
    }, []);

    const loadAssessment = async () => {
        try {
            const res = await getAssessmentById(id);
            setAssessment(res.data);
        } catch (err) {
            console.log(err);
            setMessage("Failed to load assessment.");
        } finally {
            setLoading(false);
        }
    };

    const chooseAnswer = (questionIndex, optionIndex) => {
        if (!isStudent) return;

        setAnswers((prev) => ({
            ...prev,
            [questionIndex]: optionIndex
        }));
    };

    const handleSubmit = async () => {
        if (!assessment || !isStudent) return;

        if (Object.keys(answers).length !== assessment.questions.length) {
            setMessage("Please answer all questions.");
            return;
        }

        try {
            setSubmitting(true);
            setMessage("");

            // IMPORTANT: This matches your backend schema.
            const submissionAnswers = assessment.questions.map(
                (question, index) => ({
                    questionId: question._id,
                    selectedAnswer: answers[index]
                })
            );

            await submitAssessment(id, {
                student: user.id,
                answers: submissionAnswers,
                totalQuestions: assessment.questions.length
            });

            setSubmitted(true);

            setTimeout(() => {
                navigate("/assessments");
            }, 2500);

        } catch (err) {
            console.log(err);
            setMessage(
                err.response?.data?.message ||
                "Failed to submit assessment."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <h1>Loading Assessment...</h1>;

    if (!assessment) return <h1>Assessment Not Found</h1>;

    if (submitted) {
        return (
            <div
                style={{
                    background: "white",
                    padding: "40px",
                    borderRadius: "12px",
                    textAlign: "center",
                    boxShadow: "0 2px 10px rgba(0,0,0,.1)"
                }}
            >
                <h1 style={{ color: "green" }}>
                    Assessment Submitted Successfully!
                </h1>

                <p>Your assessment has been submitted to the company.</p>

                <p>Redirecting back to Assessments...</p>
            </div>
        );
    }

    return (
        <div>
            <h1>{assessment.title}</h1>

            {assessment.description && <p>{assessment.description}</p>}

            <p>
                <strong>Duration:</strong> {assessment.duration} minutes
            </p>

            {message && (
                <div
                    style={{
                        background: "#f3f4f6",
                        padding: "12px",
                        borderRadius: "8px",
                        marginBottom: "20px"
                    }}
                >
                    {message}
                </div>
            )}

            {assessment.questions.map((question, qIndex) => (
                <div
                    key={qIndex}
                    style={{
                        background: "white",
                        padding: "20px",
                        marginBottom: "20px",
                        borderRadius: "10px",
                        boxShadow: "0 2px 8px rgba(0,0,0,.1)"
                    }}
                >
                    <h3>Question {qIndex + 1}</h3>

                    <p>{question.question}</p>

                    {question.options.map((option, optionIndex) => (
                        <div
                            key={optionIndex}
                            style={{ marginBottom: "10px" }}
                        >
                            <label>
                                <input
                                    type="radio"
                                    name={`question-${qIndex}`}
                                    checked={answers[qIndex] === optionIndex}
                                    disabled={!isStudent}
                                    onChange={() =>
                                        chooseAnswer(qIndex, optionIndex)
                                    }
                                />{" "}
                                {option}
                            </label>
                        </div>
                    ))}
                </div>
            ))}

            {isStudent && (
                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting
                        ? "Submitting..."
                        : "Submit Assessment"}
                </button>
            )}
        </div>
    );
}

export default TakeAssessment;