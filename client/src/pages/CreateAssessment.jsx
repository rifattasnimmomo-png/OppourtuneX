import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createAssessment } from "../services/assessmentService";
import { getInternships } from "../services/internshipService";
import { getScholarships } from "../services/scholarshipService";

function CreateAssessment() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState(30);

    const [opportunityType, setOpportunityType] = useState("Internship");
    const [opportunity, setOpportunity] = useState("");

    const [internships, setInternships] = useState([]);
    const [scholarships, setScholarships] = useState([]);

    const [questions, setQuestions] = useState([
        {
            question: "",
            options: ["", "", "", ""],
            correctAnswer: 0
        }
    ]);

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadOpportunities();
    }, []);

    const loadOpportunities = async () => {
        try {
            const [internshipRes, scholarshipRes] = await Promise.all([
                getInternships(),
                getScholarships()
            ]);

            const myInternships = (internshipRes.data || []).filter(
                (item) => item.createdBy === user.id
            );

            const myScholarships = (scholarshipRes.data || []).filter(
                (item) => item.createdBy === user.id
            );

            setInternships(myInternships);
            setScholarships(myScholarships);

            if (myInternships.length > 0) {
                setOpportunity(myInternships[0]._id);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (opportunityType === "Internship") {
            setOpportunity(internships[0]?._id || "");
        } else {
            setOpportunity(scholarships[0]?._id || "");
        }
    }, [opportunityType, internships, scholarships]);

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
            setMessage("At least one question is required.");
            return;
        }

        setQuestions(
            questions.filter((_, i) => i !== index)
        );
    };

    const updateQuestion = (index, value) => {
        const updated = [...questions];
        updated[index].question = value;
        setQuestions(updated);
    };

    const updateOption = (qIndex, oIndex, value) => {
        const updated = [...questions];
        updated[qIndex].options[oIndex] = value;
        setQuestions(updated);
    };

    const updateCorrectAnswer = (index, value) => {
        const updated = [...questions];
        updated[index].correctAnswer = Number(value);
        setQuestions(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!title.trim()) {
            setMessage("Assessment title is required.");
            return;
        }

        if (!opportunity) {
            setMessage("Please select an opportunity.");
            return;
        }

        for (const q of questions) {
            if (!q.question.trim()) {
                setMessage("Every question needs text.");
                return;
            }

            if (q.options.some((option) => !option.trim())) {
                setMessage("Fill all four options.");
                return;
            }
        }

        try {
            setLoading(true);

            await createAssessment({
                title,
                description,
                createdBy: user.id,
                opportunity,
                opportunityType,
                duration,
                questions
            });

            alert("Assessment created successfully.");
            navigate("/assessments");
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

            <form onSubmit={handleSubmit}>

                <div
                    style={{
                        background: "white",
                        padding: "20px",
                        borderRadius: "10px",
                        marginBottom: "20px",
                        boxShadow: "0 2px 8px rgba(0,0,0,.1)"
                    }}
                >

                    <h2>Assessment Details</h2>

                    <label>Title</label>

                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            margin: "8px 0 16px"
                        }}
                    />

                    <label>Description</label>

                    <textarea
                        rows="3"
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        style={{
                            width: "100%",
                            padding: "10px",
                            margin: "8px 0 16px"
                        }}
                    />

                    <label>Opportunity Type</label>

                    <select
                        value={opportunityType}
                        onChange={(e) =>
                            setOpportunityType(e.target.value)
                        }
                        style={{
                            width: "100%",
                            padding: "10px",
                            margin: "8px 0 16px"
                        }}
                    >

                        <option value="Internship">
                            Internship
                        </option>

                        <option value="Scholarship">
                            Scholarship
                        </option>

                    </select>

                    <label>Select Opportunity</label>

                    <select
                        value={opportunity}
                        onChange={(e) =>
                            setOpportunity(e.target.value)
                        }
                        style={{
                            width: "100%",
                            padding: "10px",
                            margin: "8px 0 16px"
                        }}
                    >

                        {(opportunityType === "Internship"
                            ? internships
                            : scholarships
                        ).map((item) => (

                            <option
                                key={item._id}
                                value={item._id}
                            >
                                {item.title}
                            </option>

                        ))}

                    </select>

                    <label>Duration (minutes)</label>

                    <input
                        type="number"
                        value={duration}
                        onChange={(e) =>
                            setDuration(Number(e.target.value))
                        }
                        style={{
                            width: "100%",
                            padding: "10px",
                            margin: "8px 0"
                        }}
                    />

                </div>

                <h2>Questions</h2>

                {questions.map((question, qIndex) => (

                    <div
                        key={qIndex}
                        style={{
                            background: "white",
                            padding: "20px",
                            borderRadius: "10px",
                            marginBottom: "20px",
                            boxShadow: "0 2px 8px rgba(0,0,0,.1)"
                        }}
                    >

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between"
                            }}
                        >

                            <h3>
                                Question {qIndex + 1}
                            </h3>

                            <button
                                type="button"
                                onClick={() =>
                                    removeQuestion(qIndex)
                                }
                            >
                                Remove
                            </button>

                        </div>

                        <textarea
                            rows="2"
                            value={question.question}
                            onChange={(e) =>
                                updateQuestion(
                                    qIndex,
                                    e.target.value
                                )
                            }
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginBottom: "15px"
                            }}
                        />

                        {question.options.map(
                            (option, oIndex) => (

                                <input
                                    key={oIndex}
                                    type="text"
                                    placeholder={`Option ${String.fromCharCode(
                                        65 + oIndex
                                    )}`}
                                    value={option}
                                    onChange={(e) =>
                                        updateOption(
                                            qIndex,
                                            oIndex,
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        marginBottom: "10px"
                                    }}
                                />

                            )
                        )}

                        <label>
                            Correct Answer
                        </label>

                        <select
                            value={question.correctAnswer}
                            onChange={(e) =>
                                updateCorrectAnswer(
                                    qIndex,
                                    e.target.value
                                )
                            }
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "8px"
                            }}
                        >

                            <option value={0}>Option A</option>
                            <option value={1}>Option B</option>
                            <option value={2}>Option C</option>
                            <option value={3}>Option D</option>

                        </select>

                    </div>

                ))}

                <div
                    style={{
                        display: "flex",
                        gap: "10px"
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