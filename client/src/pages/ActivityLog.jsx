import { useEffect, useState } from "react";
import { getMyActivities } from "../services/activityService";

function ActivityLog() {

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadActivities();
    }, []);

    const loadActivities = async () => {

        try {

            if (!user?.id) {
                setMessage("Please log in again.");
                setLoading(false);
                return;
            }

            const response = await getMyActivities(user.id);

            setActivities(response.data || []);

        } catch (error) {

            console.log(error);

            setMessage(
                error.response?.data?.message ||
                "Failed to load activity history."
            );

        } finally {

            setLoading(false);

        }

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

    const formatTime = (date) => {

        if (!date) return "";

        return new Date(date).toLocaleTimeString(
            "en-US",
            {
                hour: "numeric",
                minute: "2-digit"
            }
        );

    };

    const getIcon = (type) => {

        switch (type) {

            case "application_submitted":
                return "📨";

            case "application_accepted":
                return "✅";

            case "application_rejected":
                return "❌";

            case "application_withdrawn":
                return "↩️";

            default:
                return "📋";

        }

    };

    const getStatusClass = (type) => {

        switch (type) {

            case "application_submitted":
                return "#2563eb";

            case "application_accepted":
                return "#16a34a";

            case "application_rejected":
                return "#dc2626";

            case "application_withdrawn":
                return "#6b7280";

            default:
                return "#374151";

        }

    };

    if (loading) {

        return (

            <div
                style={{
                    padding: "20px",
                    color: "#000"
                }}
            >

                <h1>Activity Log</h1>

                <p>
                    Loading your activity...
                </p>

            </div>

        );

    }

    return (

        <div
            style={{
                padding: "10px 0 40px",
                color: "#000"
            }}
        >

            {/* HEADER */}

            <div
                style={{
                    marginBottom: "30px"
                }}
            >

                <h1
                    style={{
                        margin: "0 0 8px",
                        fontSize: "32px",
                        color: "#000"
                    }}
                >
                    Activity Log
                </h1>

                <p
                    style={{
                        margin: 0,
                        color: "#000"
                    }}
                >
                    View your recent application activity and updates.
                </p>

            </div>


            {/* ERROR */}

            {message && (

                <div
                    style={{
                        padding: "14px",
                        marginBottom: "25px",
                        background: "#fef2f2",
                        border: "1px solid #fecaca",
                        borderRadius: "10px",
                        color: "#000"
                    }}
                >
                    {message}
                </div>

            )}


            {/* EMPTY STATE */}

            {activities.length === 0 ? (

                <div
                    style={{
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "14px",
                        padding: "45px 25px",
                        textAlign: "center",
                        boxShadow:
                            "0 3px 10px rgba(0,0,0,0.08)"
                    }}
                >

                    <div
                        style={{
                            fontSize: "50px",
                            marginBottom: "15px"
                        }}
                    >
                        📋
                    </div>

                    <h2
                        style={{
                            margin: "0 0 10px",
                            color: "#000"
                        }}
                    >
                        No activity yet
                    </h2>

                    <p
                        style={{
                            margin: 0,
                            color: "#000"
                        }}
                    >
                        Your application activity will appear here.
                    </p>

                </div>

            ) : (

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px"
                    }}
                >

                    {activities.map((activity) => (

                        <div
                            key={activity._id}
                            style={{
                                background: "#fff",
                                border: "1px solid #e5e7eb",
                                borderRadius: "14px",
                                padding: "20px",
                                display: "flex",
                                gap: "18px",
                                alignItems: "flex-start",
                                boxShadow:
                                    "0 3px 10px rgba(0,0,0,0.06)"
                            }}
                        >

                            {/* ICON */}

                            <div
                                style={{
                                    width: "52px",
                                    height: "52px",
                                    minWidth: "52px",
                                    borderRadius: "50%",
                                    background:
                                        `${getStatusClass(activity.type)}15`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "25px"
                                }}
                            >
                                {getIcon(activity.type)}
                            </div>


                            {/* CONTENT */}

                            <div
                                style={{
                                    flex: 1
                                }}
                            >

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        gap: "15px",
                                        flexWrap: "wrap"
                                    }}
                                >

                                    <h3
                                        style={{
                                            margin: "0 0 6px",
                                            color: "#000",
                                            fontSize: "18px"
                                        }}
                                    >
                                        {activity.title}
                                    </h3>

                                    <span
                                        style={{
                                            fontSize: "12px",
                                            color: "#000",
                                            whiteSpace: "nowrap"
                                        }}
                                    >
                                        {formatDate(activity.createdAt)}
                                    </span>

                                </div>


                                <p
                                    style={{
                                        margin: "0 0 10px",
                                        color: "#000",
                                        lineHeight: "1.5"
                                    }}
                                >
                                    {activity.message}
                                </p>


                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        flexWrap: "wrap"
                                    }}
                                >

                                    <span
                                        style={{
                                            display: "inline-block",
                                            padding: "5px 10px",
                                            borderRadius: "20px",
                                            background:
                                                `${getStatusClass(activity.type)}15`,
                                            color: "#000",
                                            fontSize: "12px",
                                            fontWeight: "600"
                                        }}
                                    >
                                        {activity.type
                                            .replaceAll("_", " ")
                                            .replace(
                                                "application ",
                                                ""
                                            )}
                                    </span>

                                    <span
                                        style={{
                                            fontSize: "12px",
                                            color: "#000"
                                        }}
                                    >
                                        {formatTime(activity.createdAt)}
                                    </span>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default ActivityLog;