import { useEffect, useState } from "react";
import { getInterviewsForStudent } from "../services/interviewService";

function StudentInterviews() {
    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadInterviews();
    }, []);

    const loadInterviews = async () => {
        try {
            setLoading(true);
            setMessage("");

            if (!user?.id) {
                setMessage("Please log in again.");
                return;
            }

            const response =
                await getInterviewsForStudent(user.id);

            const data = Array.isArray(response.data)
                ? response.data
                : [];

            setInterviews(data);
        } catch (error) {
            console.log(error);

            setMessage(
                error.response?.data?.message ||
                "Failed to load interviews."
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "Not specified";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Not specified";
        }

        return parsedDate.toLocaleString();
    };

    if (loading) {
        return <h1>Interviews</h1>;
    }

    return (
        <div>

            <h1>Scheduled Interviews</h1>

            <p>
                View interviews scheduled for your applications.
            </p>

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

            {interviews.length === 0 ? (

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
                        No interviews have been scheduled for you.
                    </p>
                </div>

            ) : (

                <div>

                    {interviews.map((interview) => (

                        <div
                            key={interview._id}
                            style={{
                                background: "white",
                                padding: "20px",
                                marginBottom: "15px",
                                borderRadius: "10px",
                                boxShadow:
                                    "0 2px 8px rgba(0,0,0,.1)"
                            }}
                        >

                            <h2>
                                Interview
                            </h2>

                            {interview.application?.opportunity && (
                                <p>
                                    <strong>
                                        Opportunity:
                                    </strong>{" "}
                                    {interview.application.opportunity.title ||
                                        "Opportunity"}
                                </p>
                            )}

                            {interview.application?.opportunityType && (
                                <p>
                                    <strong>
                                        Type:
                                    </strong>{" "}
                                    {interview.application.opportunityType}
                                </p>
                            )}

                            <p>
                                <strong>
                                    Date & Time:
                                </strong>{" "}
                                {formatDate(
                                    interview.scheduledAt
                                )}
                            </p>

                            {interview.duration !== undefined && (
                                <p>
                                    <strong>
                                        Duration:
                                    </strong>{" "}
                                    {interview.duration} minutes
                                </p>
                            )}

                            <p>
                                <strong>
                                    Status:
                                </strong>{" "}
                                {interview.status || "scheduled"}
                            </p>

                            {interview.scheduledBy && (
                                <p>
                                    <strong>
                                        Scheduled by:
                                    </strong>{" "}
                                    {interview.scheduledBy.name ||
                                        interview.scheduledBy.email ||
                                        "Company"}
                                </p>
                            )}

                            {interview.notes && (
                                <p>
                                    <strong>
                                        Notes:
                                    </strong>{" "}
                                    {interview.notes}
                                </p>
                            )}

                            {interview.status === "scheduled" &&
                                interview.meetingLink && (

                                <a
                                    href={interview.meetingLink}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <button type="button">
                                        Join Interview
                                    </button>
                                </a>

                            )}

                            {interview.status === "cancelled" && (
                                <p>
                                    This interview has been cancelled.
                                </p>
                            )}

                            {interview.status === "completed" && (
                                <p>
                                    This interview has been completed.
                                </p>
                            )}

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default StudentInterviews;