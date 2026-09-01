import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllSubmissions } from "../services/assessmentService";

function AssessmentSubmissions() {
    const { id } = useParams();

    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadSubmissions();
    }, []);

    const loadSubmissions = async () => {
        try {
            const response = await getAllSubmissions(id);
            setSubmissions(response.data || []);
        } catch (error) {
            console.log(error);
            setMessage(
                error.response?.data?.message ||
                "Failed to load submissions."
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <h1>Assessment Submissions</h1>;
    }

    return (
        <div>
            <h1>Assessment Submissions</h1>

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

            {submissions.length === 0 ? (
                <div
                    style={{
                        background: "white",
                        padding: "25px",
                        borderRadius: "10px",
                        boxShadow: "0 2px 8px rgba(0,0,0,.1)"
                    }}
                >
                    No student has submitted this assessment yet.
                </div>
            ) : (
                submissions.map((submission, studentIndex) => (
                    <div
                        key={submission._id}
                        style={{
                            background: "white",
                            padding: "20px",
                            marginBottom: "20px",
                            borderRadius: "10px",
                            boxShadow: "0 2px 8px rgba(0,0,0,.1)"
                        }}
                    >
                        <h2>
                            {submission.student?.name || "Student"}
                        </h2>

                        <p>
                            <strong>Email:</strong>{" "}
                            {submission.student?.email}
                        </p>

                        <p>
                            <strong>Submitted:</strong>{" "}
                            {new Date(
                                submission.createdAt
                            ).toLocaleString()}
                        </p>

                        <p>
                            <strong>Score:</strong>{" "}
                            {submission.score} / {submission.totalMarks}
                        </p>

                        <hr style={{ margin: "20px 0" }} />

                        <h3>Student Answers</h3>

                        {submission.answers &&
                        submission.answers.length > 0 ? (
                            submission.answers.map((answer, index) => (
                                <div
                                    key={index}
                                    style={{
                                        border: "1px solid #ddd",
                                        borderRadius: "8px",
                                        padding: "15px",
                                        marginBottom: "15px",
                                        background: "#fafafa"
                                    }}
                                >
                                    <p>
                                        <strong>
                                            Question {index + 1}
                                        </strong>
                                    </p>

                                    <p>{answer.question}</p>

                                    <p>
                                        <strong>
                                            Student Answer:
                                        </strong>{" "}
                                        {answer.selectedOption}
                                    </p>

                                    <p>
                                        <strong>
                                            Correct Answer:
                                        </strong>{" "}
                                        {answer.correctOption}
                                    </p>

                                    <p
                                        style={{
                                            color: answer.isCorrect
                                                ? "green"
                                                : "red",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {answer.isCorrect
                                            ? "Correct"
                                            : "Incorrect"}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p>No answers available.</p>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default AssessmentSubmissions;