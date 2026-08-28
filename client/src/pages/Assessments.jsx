import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAssessmentsForCreator } from "../services/assessmentService";

function Assessments() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const userId = user._id || user.id;

    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadAssessments();
    }, []);

    const loadAssessments = async () => {
        try {
            if (!userId) {
                setMessage("User ID not found. Please log in again.");
                setLoading(false);
                return;
            }

            console.log("Loading assessments for user:", userId);

            const response = await getAssessmentsForCreator(userId);

            setAssessments(response.data || []);
        } catch (error) {
            console.error("Assessment loading error:", error);

            setMessage(
                error.response?.data?.message ||
                "Failed to load assessments."
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <h1>Loading Assessments...</h1>;
    }

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "25px"
                }}
            >
                <div>
                    <h1>Assessments</h1>

                    <p>
                        Create and manage assessments for your opportunities.
                    </p>
                </div>

                {(user.role === "company" ||
                    user.role === "university") && (
                    <Link to="/assessments/create">
                        <button>Create Assessment</button>
                    </Link>
                )}
            </div>

            {message && (
                <div
                    style={{
                        padding: "12px",
                        marginBottom: "20px",
                        background: "#fee2e2",
                        borderRadius: "8px"
                    }}
                >
                    <strong>Error:</strong> {message}
                </div>
            )}

            {assessments.length === 0 ? (
                <div
                    style={{
                        background: "white",
                        padding: "30px",
                        borderRadius: "10px",
                        boxShadow: "0 2px 8px rgba(0,0,0,.1)"
                    }}
                >
                    <p>No assessments created yet.</p>

                    {(user.role === "company" ||
                        user.role === "university") && (
                        <Link to="/assessments/create">
                            Create your first assessment
                        </Link>
                    )}
                </div>
            ) : (
                <div>
                    {assessments.map((assessment) => (
                        <div
                            key={assessment._id}
                            style={{
                                background: "white",
                                padding: "20px",
                                marginBottom: "15px",
                                borderRadius: "10px",
                                boxShadow: "0 2px 8px rgba(0,0,0,.1)"
                            }}
                        >
                            <h2>{assessment.title}</h2>

                            {assessment.description && (
                                <p>{assessment.description}</p>
                            )}

                            <p>
                                Questions:{" "}
                                <strong>
                                    {assessment.questions?.length || 0}
                                </strong>
                            </p>

                            <p>
                                Duration:{" "}
                                <strong>
                                    {assessment.duration} minutes
                                </strong>
                            </p>

                            {assessment.opportunityType && (
                                <p>
                                    Opportunity Type:{" "}
                                    <strong>
                                        {assessment.opportunityType}
                                    </strong>
                                </p>
                            )}

                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    flexWrap: "wrap"
                                }}
                            >
                                <Link
                                    to={`/assessments/${assessment._id}`}
                                >
                                    <button>
                                        View Assessment
                                    </button>
                                </Link>

                                <Link
                                    to={`/assessments/${assessment._id}/submissions`}
                                >
                                    <button>
                                        View Submissions
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Assessments;