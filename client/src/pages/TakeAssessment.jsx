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

    const [assessment, setAssessment] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadAssessment();
    }, [id]);

    const loadAssessment = async () => {
        try {
            const response = await getAssessmentById(id);

            setAssessment(response.data);
        } catch (error) {
            console.log(error);

            setMessage(
                error.response?.data?.message ||
                "Failed to load assessment."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionId, selectedAnswer) => {
        setAnswers({
            ...answers,
            [questionId]: Number(selectedAnswer)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user?.id) {
            setMessage("Please log in again.");
            return;
        }

        if (user.role !== "student") {
            setMessage("Only students can submit assessments.");
            return;
        }

        const unansweredQuestions = assessment.questions.filter(
            (question) =>
                answers[question._id] === undefined
        );

        if (unansweredQuestions.length > 0) {
            setMessage(
                `Please answer all questions. ${unansweredQuestions.length} question(s) remaining.`
            );
            return;
        }

        const formattedAnswers = Object.entries(answers).map(
            ([questionId, selectedAnswer]) => ({
                questionId,
                selectedAnswer
            })
        );

        try {
            setSubmitting(true);
            setMessage("");

            const response = await submitAssessment(id, {
                student: user.id,
                answers: formattedAnswers
            });

            const result = response.data.result;

            navigate(
                `/assessments/${id}/result/${user.id}`,
                {
                    state: {
                        result
                    }
                }
            );
        } catch (error) {
            console.log(error);

            setMessage(
                error.response?.data?.message ||
                "Failed to submit assessment."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <h1>Loading Assessment...</h1>;
    }

    if (!assessment) {
        return (
            <div>
                <h1>Assessment</h1>
                <p>
                    {message || "Assessment not found."}
                </p>
            </div>
        );
    }

    return (
        <div>

            <h1>{assessment.title}</h1>

            {assessment.description && (
                <p>{assessment.description}</p>
            )}

            <p>
                <strong>
                    Questions:
                </strong>{" "}
                {assessment.questions.length}
            </p>

            <p>
                <strong>
                    Duration:
                </strong>{" "}
                {assessment.duration} minutes
            </p>

            {message && (
                <div
                    style={{
                        padding: "12px",
                        margin: "15px 0",
                        background: "#f3f4f6",
                        borderRadius: "8px"
                    }}
                >
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                {assessment.questions.map(
                    (question, questionIndex) => (

                        <div
                            key={question._id}
                            style={{
                                background: "white",
                                padding: "20px",
                                marginBottom: "20px",
                                borderRadius: "10px",
                                boxShadow:
                                    "0 2px 8px rgba(0,0,0,.1)"
                            }}
                        >

                            <h3>
                                {questionIndex + 1}.{" "}
                                {question.question}
                            </h3>

                            <div>

                                {question.options.map(
                                    (option, optionIndex) => (

                                        <label
                                            key={optionIndex}
                                            style={{
                                                display: "block",
                                                padding: "10px",
                                                marginBottom: "8px",
                                                border:
                                                    "1px solid #ddd",
                                                borderRadius: "8px",
                                                cursor: "pointer"
                                            }}
                                        >

                                            <input
                                                type="radio"
                                                name={`question-${question._id}`}
                                                value={optionIndex}
                                                checked={
                                                    answers[
                                                        question._id
                                                    ] === optionIndex
                                                }
                                                onChange={(e) =>
                                                    handleAnswerChange(
                                                        question._id,
                                                        e.target.value
                                                    )
                                                }
                                                style={{
                                                    marginRight:
                                                        "10px"
                                                }}
                                            />

                                            {String.fromCharCode(
                                                65 + optionIndex
                                            )}.{" "}
                                            {option}

                                        </label>

                                    )
                                )}

                            </div>

                        </div>

                    )
                )}

                <button
                    type="submit"
                    disabled={submitting}
                >
                    {submitting
                        ? "Submitting..."
                        : "Submit Assessment"}
                </button>

            </form>

        </div>
    );
}

export default TakeAssessment;