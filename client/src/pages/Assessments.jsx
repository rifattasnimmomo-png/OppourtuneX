import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    getAssessmentsForCreator,
    getAssessmentsForOpportunity,
    getStudentResult
} from "../services/assessmentService";

import { getMyApplications } from "../services/applicationService";

function Assessments() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadAssessments();
    }, []);

    const loadAssessments = async () => {
        try {
            setLoading(true);
            setMessage("");

            if (!user?.id) {
                setMessage("Please log in again.");
                return;
            }

            // COMPANY / UNIVERSITY
            if (user.role === "company" || user.role === "university") {
                const res = await getAssessmentsForCreator(user.id);
                setAssessments(res.data || []);
                return;
            }

            // STUDENT
            const applicationRes = await getMyApplications(user.id);
            const applications = applicationRes.data || [];

            const allAssessments = [];

            for (const application of applications) {
                if (!application.opportunity) continue;
                if (application.status === "withdrawn") continue;

                try {
                    const res = await getAssessmentsForOpportunity(
                        application.opportunity
                    );

                    for (const assessment of res.data || []) {
                        let hasSubmitted = false;

                        try {
                            await getStudentResult(
                                assessment._id,
                                user.id
                            );
                            hasSubmitted = true;
                        } catch (err) {
                            if (err.response?.status !== 404) {
                                console.log(err);
                            }
                        }

                        allAssessments.push({
                            ...assessment,
                            applicationStatus: application.status,
                            hasSubmitted
                        });
                    }
                } catch (err) {
                    console.log(err);
                }
            }

            const unique = [];
            allAssessments.forEach((assessment) => {
                if (!unique.find((a) => a._id === assessment._id)) {
                    unique.push(assessment);
                }
            });

            setAssessments(unique);

        } catch (err) {
            console.log(err);
            setMessage(
                err.response?.data?.message ||
                    "Failed to load assessments."
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <h1>Assessments</h1>;

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
                        {user.role === "student"
                            ? "Assessments available for your applications."
                            : "Create and manage assessments for your opportunities."}
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
                        background: "#f3f4f6",
                        borderRadius: "8px"
                    }}
                >
                    {message}
                </div>
            )}

            {assessments.length === 0 ? (
                <div
                    style={{
                        background: "white",
                        padding: "30px",
                        borderRadius: "10px",
                        boxShadow:
                            "0 2px 8px rgba(0,0,0,.1)"
                    }}
                >
                    <p>
                        {user.role === "student"
                            ? "No assessments are currently available for your applications."
                            : "No assessments created yet."}
                    </p>

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
                                boxShadow:
                                    "0 2px 8px rgba(0,0,0,.1)"
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

                            {user.role === "student" && (
                                <p>
                                    Application Status:{" "}
                                    <strong>
                                        {assessment.applicationStatus}
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
                                {user.role === "student" ? (
                                    assessment.hasSubmitted ? (
                                        <Link
                                            to={`/assessments/${assessment._id}/result/${user.id}`}
                                        >
                                            <button>View Result</button>
                                        </Link>
                                    ) : (
                                        <Link
                                            to={`/assessments/${assessment._id}/take`}
                                        >
                                            <button>View Assessment</button>
                                        </Link>
                                    )
                                ) : (
                                    <>
                                        {/* COMPANY PREVIEW PAGE */}
                                        <Link
                                            to={`/assessments/${assessment._id}`}
                                        >
                                            <button>View Assessment</button>
                                        </Link>

                                        <Link
                                            to={`/assessments/${assessment._id}/submissions`}
                                        >
                                            <button>View Submissions</button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Assessments;