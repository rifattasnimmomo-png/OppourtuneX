import { useEffect, useState } from "react";
import { getApplicationsForOwner } from "../services/applicationService";
import {
    scheduleInterview,
    getInterviewsForApplication,
    cancelInterview
} from "../services/interviewService";

function CompanyDashboard() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplication, setSelectedApplication] = useState(null);

    const [form, setForm] = useState({
        scheduledAt: "",
        duration: 30,
        meetingLink: "",
        notes: ""
    });

    const [message, setMessage] = useState("");

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        try {
            const res = await getApplicationsForOwner(user.id);
            setApplications(res.data || []);
        } catch (error) {
            console.log(error);
            setMessage("Failed to load applications.");
        } finally {
            setLoading(false);
        }
    };

    const openInterviewForm = (application) => {
        setSelectedApplication(application);
        setMessage("");

        setForm({
            scheduledAt: "",
            duration: 30,
            meetingLink: "",
            notes: ""
        });
    };

    const closeInterviewForm = () => {
        setSelectedApplication(null);
        setMessage("");
    };

    const handleScheduleInterview = async (e) => {
        e.preventDefault();

        if (!selectedApplication) return;

        if (!form.scheduledAt) {
            setMessage("Please select an interview date and time.");
            return;
        }

        try {
            await scheduleInterview({
                application: selectedApplication._id,
                scheduledBy: user.id,
                scheduledAt: new Date(form.scheduledAt).toISOString(),
                duration: Number(form.duration) || 30,
                meetingLink: form.meetingLink,
                notes: form.notes
            });

            setMessage("Interview scheduled successfully.");

            setForm({
                scheduledAt: "",
                duration: 30,
                meetingLink: "",
                notes: ""
            });
        } catch (error) {
            console.log(error);
            setMessage(
                error.response?.data?.message ||
                "Failed to schedule interview."
            );
        }
    };

    const handleViewInterviews = async (application) => {
        try {
            const res = await getInterviewsForApplication(application._id);

            if (!res.data || res.data.length === 0) {
                setMessage("No interviews scheduled for this application.");
                return;
            }

            const interview = res.data[res.data.length - 1];

            const date = new Date(interview.scheduledAt).toLocaleString();

            const shouldCancel =
                interview.status === "scheduled" &&
                window.confirm(
                    `Interview scheduled for ${date}.\n\nClick OK to cancel this interview, or Cancel to keep it.`
                );

            if (shouldCancel) {
                await cancelInterview(interview._id);
                setMessage("Interview cancelled successfully.");
            } else {
                setMessage(
                    `Interview: ${date} (${interview.status})`
                );
            }
        } catch (error) {
            console.log(error);
            setMessage("Failed to load interview information.");
        }
    };

    if (loading) {
        return <h1>Company Dashboard</h1>;
    }

    return (
        <div>
            <h1>Company Dashboard</h1>

            <p>
                Manage applicants and schedule interviews.
            </p>

            {message && (
                <div
                    style={{
                        padding: "10px",
                        margin: "15px 0",
                        background: "#f3f4f6",
                        borderRadius: "8px"
                    }}
                >
                    {message}
                </div>
            )}

            <h2>Applicants</h2>

            {applications.length === 0 ? (
                <p>No applications received yet.</p>
            ) : (
                <div>
                    {applications.map((application) => (
                        <div
                            key={application._id}
                            style={{
                                background: "white",
                                padding: "20px",
                                marginBottom: "15px",
                                borderRadius: "10px",
                                boxShadow: "0 2px 8px rgba(0,0,0,.1)"
                            }}
                        >
                            <h3>
                                {application.student?.name ||
                                    "Unknown Student"}
                            </h3>

                            <p>
                                Email:{" "}
                                {application.student?.email ||
                                    "Not available"}
                            </p>

                            <p>
                                Type: {application.opportunityType}
                            </p>

                            <p>
                                Status:{" "}
                                <strong>
                                    {application.status}
                                </strong>
                            </p>

                            {application.status === "accepted" && (
                                <button
                                    onClick={() =>
                                        openInterviewForm(application)
                                    }
                                >
                                    Schedule Interview
                                </button>
                            )}

                            <button
                                onClick={() =>
                                    handleViewInterviews(application)
                                }
                                style={{ marginLeft: "10px" }}
                            >
                                View Interview
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {selectedApplication && (
                <div
                    style={{
                        marginTop: "25px",
                        background: "white",
                        padding: "25px",
                        borderRadius: "10px",
                        boxShadow: "0 2px 8px rgba(0,0,0,.1)"
                    }}
                >
                    <h2>
                        Schedule Interview
                    </h2>

                    <p>
                        Student:{" "}
                        <strong>
                            {selectedApplication.student?.name}
                        </strong>
                    </p>

                    <form onSubmit={handleScheduleInterview}>
                        <div style={{ marginBottom: "15px" }}>
                            <label>
                                Date & Time
                            </label>

                            <br />

                            <input
                                type="datetime-local"
                                value={form.scheduledAt}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        scheduledAt: e.target.value
                                    })
                                }
                                required
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label>
                                Duration (minutes)
                            </label>

                            <br />

                            <input
                                type="number"
                                min="1"
                                value={form.duration}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        duration: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label>
                                Meeting Link
                            </label>

                            <br />

                            <input
                                type="text"
                                placeholder="https://meet.google.com/..."
                                value={form.meetingLink}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        meetingLink: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label>
                                Notes
                            </label>

                            <br />

                            <textarea
                                rows="4"
                                placeholder="Interview instructions..."
                                value={form.notes}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        notes: e.target.value
                                    })
                                }
                            />
                        </div>

                        <button type="submit">
                            Schedule Interview
                        </button>

                        <button
                            type="button"
                            onClick={closeInterviewForm}
                            style={{ marginLeft: "10px" }}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default CompanyDashboard;