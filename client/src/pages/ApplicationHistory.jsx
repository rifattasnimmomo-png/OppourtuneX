import { useEffect, useState } from "react";
import { getMyApplications } from "../services/applicationService";
import { getMyActivities } from "../services/activityService";

function ApplicationHistory() {

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [applications, setApplications] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {

            if (!user?.id) {
                setMessage("Please log in again.");
                setLoading(false);
                return;
            }

            const applicationsResponse =
                await getMyApplications(user.id);

            const activitiesResponse =
                await getMyActivities(user.id);

            setApplications(
                applicationsResponse.data || []
            );

            setActivities(
                activitiesResponse.data || []
            );

        } catch (error) {

            console.log(error);

            setMessage(
                error.response?.data?.message ||
                "Failed to load application history."
            );

        } finally {
            setLoading(false);
        }
    };

    const formatStatus = (status) => {
        if (!status) return "";

        return status.charAt(0).toUpperCase() +
            status.slice(1);
    };

    const formatDate = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric"
            }
        );
    };

    const getStatusStyle = (status) => {

        const styles = {
            pending: {
                background: "#fff7ed",
                color: "#c2410c"
            },

            accepted: {
                background: "#ecfdf5",
                color: "#047857"
            },

            rejected: {
                background: "#fef2f2",
                color: "#b91c1c"
            },

            withdrawn: {
                background: "#f3f4f6",
                color: "#4b5563"
            }
        };

        return {
            padding: "5px 10px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: "600",
            ...(
                styles[status] ||
                styles.pending
            )
        };
    };

    if (loading) {
        return <h1>Loading History...</h1>;
    }

    return (
        <div>

            <h1>Application History</h1>

            <p>
                View your complete application history and recent activity.
            </p>

            {message && (
                <div
                    style={{
                        padding: "12px",
                        marginBottom: "20px",
                        background: "#fef2f2",
                        color: "#b91c1c",
                        borderRadius: "8px"
                    }}
                >
                    {message}
                </div>
            )}

            {/* APPLICATION HISTORY */}

            <section style={{ marginTop: "30px" }}>

                <h2>Application History</h2>

                {applications.length === 0 ? (

                    <div
                        style={{
                            background: "white",
                            padding: "25px",
                            borderRadius: "10px",
                            boxShadow:
                                "0 2px 8px rgba(0,0,0,.1)"
                        }}
                    >
                        <p>
                            You have not submitted any applications yet.
                        </p>
                    </div>

                ) : (

                    applications.map((application) => (

                        <div
                            key={application._id}
                            style={{
                                background: "white",
                                padding: "20px",
                                marginBottom: "15px",
                                borderRadius: "10px",
                                boxShadow:
                                    "0 2px 8px rgba(0,0,0,.1)"
                            }}
                        >

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems: "center",
                                    gap: "15px",
                                    flexWrap: "wrap"
                                }}
                            >

                                <div>

                                    <h3 style={{
                                        marginBottom: "8px"
                                    }}>
                                        {application.opportunityType}
                                    </h3>

                                    <p>
                                        Application ID:{" "}
                                        {application._id}
                                    </p>

                                    <p>
                                        Applied on:{" "}
                                        <strong>
                                            {formatDate(
                                                application.createdAt
                                            )}
                                        </strong>
                                    </p>

                                    {application.updatedAt &&
                                        application.updatedAt !==
                                        application.createdAt && (
                                            <p>
                                                Last updated:{" "}
                                                {formatDate(
                                                    application.updatedAt
                                                )}
                                            </p>
                                        )}

                                </div>

                                <span
                                    style={getStatusStyle(
                                        application.status
                                    )}
                                >
                                    {formatStatus(
                                        application.status
                                    )}
                                </span>

                            </div>

                        </div>

                    ))

                )}

            </section>


            {/* ACTIVITY LOG */}

            <section style={{ marginTop: "40px" }}>

                <h2>Activity Log</h2>

                {activities.length === 0 ? (

                    <div
                        style={{
                            background: "white",
                            padding: "25px",
                            borderRadius: "10px",
                            boxShadow:
                                "0 2px 8px rgba(0,0,0,.1)"
                        }}
                    >
                        <p>
                            No activity recorded yet.
                        </p>
                    </div>

                ) : (

                    <div>

                        {activities.map((activity) => (

                            <div
                                key={activity._id}
                                style={{
                                    background: "white",
                                    padding: "18px",
                                    marginBottom: "12px",
                                    borderRadius: "10px",
                                    boxShadow:
                                        "0 2px 8px rgba(0,0,0,.08)"
                                }}
                            >

                                <h3>
                                    {activity.title}
                                </h3>

                                <p>
                                    {activity.message}
                                </p>

                                <small>
                                    {formatDate(
                                        activity.createdAt
                                    )}
                                </small>

                            </div>

                        ))}

                    </div>

                )}

            </section>

        </div>
    );
}

export default ApplicationHistory;