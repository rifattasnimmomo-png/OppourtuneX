import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAssessmentById } from "../services/assessmentService";

function AssessmentPreview() {
    const { id } = useParams();

    const [assessment, setAssessment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAssessment();
    }, []);

    const loadAssessment = async () => {
        try {
            const res = await getAssessmentById(id);
            setAssessment(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <h1>Loading Assessment...</h1>;

    if (!assessment) return <h1>Assessment Not Found</h1>;

    return (
        <div>
            <h1>{assessment.title}</h1>

            {assessment.description && (
                <p>{assessment.description}</p>
            )}

            <p>
                <strong>Duration:</strong>{" "}
                {assessment.duration} minutes
            </p>

            <div
                style={{
                    background: "#eef6ff",
                    padding: "12px",
                    borderRadius: "8px",
                    marginBottom: "20px"
                }}
            >
                <strong>Preview Mode</strong> — This is how students will see the assessment. Companies cannot answer or submit it.
            </div>

            {assessment.questions.map((question, index) => (
                <div
                    key={index}
                    style={{
                        background: "white",
                        padding: "20px",
                        marginBottom: "20px",
                        borderRadius: "10px",
                        boxShadow: "0 2px 8px rgba(0,0,0,.1)"
                    }}
                >
                    <h3>Question {index + 1}</h3>

                    <p>{question.question}</p>

                    {question.options.map((option, optionIndex) => (
                        <div
                            key={optionIndex}
                            style={{ marginBottom: "8px" }}
                        >
                            <label>
                                <input
                                    type="radio"
                                    disabled
                                />{" "}
                                {option}
                            </label>
                        </div>
                    ))}

                    <p
                        style={{
                            marginTop: "12px",
                            color: "#2563eb",
                            fontWeight: "600"
                        }}
                    >
                        Correct Answer:{" "}
                        {question.options[question.correctAnswer]}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default AssessmentPreview;