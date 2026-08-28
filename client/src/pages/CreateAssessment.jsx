import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAssessment } from "../services/assessmentService";

function CreateAssessment() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState(30);

    const [questions, setQuestions] = useState([
        {
            question: "",
            options: ["", "", "", ""],
            correctAnswer: 0
        }
    ]);

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                question: "",
                options: ["", "", "", ""],
                correctAnswer: 0
            }
        ]);
    };

    const removeQuestion = (index) => {
        if (questions.length === 1) {
            setMessage("An assessment must have at least one question.");
            return;
        }

        setQuestions(
            questions.filter((_, questionIndex) => questionIndex !== index)
        );
    };

    const updateQuestion = (index, value) => {
        const updatedQuestions = [...questions];

        updatedQuestions[index].question = value;

        setQuestions(updatedQuestions);
    };

    const updateOption = (questionIndex, optionIndex, value) => {
        const updatedQuestions = [...questions];

        updatedQuestions[questionIndex].options[optionIndex] = value;

        setQuestions(updatedQuestions);
    };

    const updateCorrectAnswer = (questionIndex, value) => {
        const updatedQuestions = [...questions];

        updatedQuestions[questionIndex].correctAnswer = Number(value);

        setQuestions(updatedQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");

        if (!user?.id) {
            setMessage("Please log in again.");
            return;
        }

        if (user.role !== "company" && user.role !== "university") {
            setMessage(
                "Only company and university accounts can create assessments."
            );
            return;
        }

        if (!title.trim()) {
            setMessage("Please enter an assessment title.");
            return;
        }

        for (let i = 0; i < questions.length; i++) {
            const currentQuestion = questions[i];

            if (!currentQuestion.question.trim()) {
                setMessage(
                    `Please enter the question for Question ${i + 1}.`
                );
                return;
            }

            if (
                currentQuestion.options.some(
                    (option) => !option.trim()
                )
            ) {
                setMessage(
                    `Please fill all 4 options for Question ${i + 1}.`
                );
                return;
            }
        }

        try {
            setLoading(true);

            await createAssessment({
                title: title.trim(),
                description: description.trim(),
                createdBy: user.id,
                questions,
                duration: Number(duration) || 30
            });

            setMessage("Assessment created successfully.");

            setTimeout(() => {
                navigate("/assessments");
            }, 700);
        } catch (error) {
            console.log(error);

            setMessage(
                error.response?.data?.message ||
                "Failed to create assessment."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>

            <h1>Create Assessment</h1>

            <p>
                Create a multiple-choice assessment for students.
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

                <div
                    style={{
                        background: "white",
                        padding: "20px",
                        marginBottom: "20px",
                        borderRadius: "10px",
                        boxShadow: "0 2px 8px rgba(0,0,0,.1)"
                    }}
                >

                    <h2>Assessment Details</h2>

                    <div style={{ marginBottom: "15px" }}>

                        <label>
                            Assessment Title
                        </label>

                        <br />

                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. React Developer Technical Assessment"
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "5px"
                            }}
                        />

                    </div>

                    <div style={{ marginBottom: "15px" }}>

                        <label>
                            Description
                        </label>

                        <br />

                        <textarea
                            rows="4"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            placeholder="Describe what this assessment evaluates..."
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "5px"
                            }}
                        />

                    </div>

                    <div>

                        <label>
                            Duration (minutes)
                        </label>

                        <br />

                        <input
                            type="number"
                            min="1"
                            value={duration}
                            onChange={(e) =>
                                setDuration(e.target.value)
                            }
                            style={{
                                padding: "10px",
                                marginTop: "5px"
                            }}
                        />

                    </div>

                </div>

                <h2>Questions</h2>

                {questions.map((question, questionIndex) => (

                    <div
                        key={questionIndex}
                        style={{
                            background: "white",
                            padding: "20px",
                            marginBottom: "20px",
                            borderRadius: "10px",
                            boxShadow: "0 2px 8px rgba(0,0,0,.1)"
                        }}
                    >

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                        >

                            <h3>
                                Question {questionIndex + 1}
                            </h3>

                            <button
                                type="button"
                                onClick={() =>
                                    removeQuestion(questionIndex)
                                }
                            >
                                Remove
                            </button>

                        </div>

                        <div style={{ marginBottom: "15px" }}>

                            <label>
                                Question
                            </label>

                            <br />

                            <textarea
                                rows="3"
                                value={question.question}
                                onChange={(e) =>
                                    updateQuestion(
                                        questionIndex,
                                        e.target.value
                                    )
                                }
                                placeholder="Enter your question..."
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    marginTop: "5px"
                                }}
                            />

                        </div>

                        <h4>Options</h4>

                        {question.options.map(
                            (option, optionIndex) => (

                                <div
                                    key={optionIndex}
                                    style={{
                                        marginBottom: "10px"
                                    }}
                                >

                                    <label>
                                        Option{" "}
                                        {String.fromCharCode(
                                            65 + optionIndex
                                        )}
                                    </label>

                                    <br />

                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) =>
                                            updateOption(
                                                questionIndex,
                                                optionIndex,
                                                e.target.value
                                            )
                                        }
                                        placeholder={`Option ${
                                            optionIndex + 1
                                        }`}
                                        style={{
                                            width: "100%",
                                            padding: "10px",
                                            marginTop: "5px"
                                        }}
                                    />

                                </div>

                            )
                        )}

                        <div style={{ marginTop: "15px" }}>

                            <label>
                                Correct Answer
                            </label>

                            <br />

                            <select
                                value={question.correctAnswer}
                                onChange={(e) =>
                                    updateCorrectAnswer(
                                        questionIndex,
                                        e.target.value
                                    )
                                }
                                style={{
                                    padding: "10px",
                                    marginTop: "5px"
                                }}
                            >

                                <option value={0}>
                                    Option A
                                </option>

                                <option value={1}>
                                    Option B
                                </option>

                                <option value={2}>
                                    Option C
                                </option>

                                <option value={3}>
                                    Option D
                                </option>

                            </select>

                        </div>

                    </div>

                ))}

                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "25px"
                    }}
                >

                    <button
                        type="button"
                        onClick={addQuestion}
                    >
                        + Add Question
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating..."
                            : "Create Assessment"}
                    </button>

                </div>

            </form>

        </div>
    );
}

export default CreateAssessment;