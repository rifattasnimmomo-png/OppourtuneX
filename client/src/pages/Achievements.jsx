import { useEffect, useState } from "react";
import { getMyBadges } from "../services/badgeService";

function Achievements() {

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadBadges();
    }, []);

    const loadBadges = async () => {

        try {

            if (!user?.id) {
                setMessage("Please log in again.");
                setLoading(false);
                return;
            }

            const response = await getMyBadges(user.id);

            setBadges(response.data || []);

        } catch (error) {

            console.log(error);

            setMessage(
                error.response?.data?.message ||
                "Failed to load achievements."
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

    const getProgress = (badge) => {

        if (!badge.requirementCount) {
            return 0;
        }

        return Math.min(
            badge.progress || 0,
            badge.requirementCount
        );

    };

    const getRequirementText = (badge) => {

        const count = badge.requirementCount;

        switch (badge.requirementType) {

            case "applications":
                return `Submit ${count} application${count !== 1 ? "s" : ""}`;

            case "accepted":
                return `Get ${count} application${count !== 1 ? "s" : ""} accepted`;

            case "internship":
                return `Apply to ${count} internship${count !== 1 ? "s" : ""}`;

            case "scholarship":
                return `Apply to ${count} scholarship${count !== 1 ? "s" : ""}`;

            case "assessments":
                return `Complete ${count} assessment${count !== 1 ? "s" : ""}`;

            default:
                return `Complete ${count} activity${count !== 1 ? "s" : ""}`;

        }

    };

    if (loading) {

        return (

            <div
                style={{
                    padding: "30px",
                    color: "#000"
                }}
            >

                <h1>Achievements</h1>

                <p>
                    Loading your achievements...
                </p>

            </div>

        );

    }

    const earnedCount =
        badges.filter((badge) => badge.earned).length;

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
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "20px",
                    marginBottom: "30px"
                }}
            >

                <div>

                    <h1
                        style={{
                            margin: "0 0 8px",
                            color: "#000",
                            fontSize: "32px"
                        }}
                    >
                        Achievements
                    </h1>

                    <p
                        style={{
                            margin: 0,
                            color: "#000"
                        }}
                    >
                        Earn badges by completing activities
                        and accomplishments on OppurtuneX.
                    </p>

                </div>

                <div
                    style={{
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        padding: "15px 22px",
                        textAlign: "center",
                        minWidth: "120px",
                        boxShadow:
                            "0 2px 8px rgba(0,0,0,0.08)"
                    }}
                >

                    <div
                        style={{
                            fontSize: "26px",
                            fontWeight: "700",
                            color: "#000"
                        }}
                    >
                        {earnedCount}/{badges.length}
                    </div>

                    <div
                        style={{
                            fontSize: "13px",
                            color: "#000",
                            marginTop: "3px"
                        }}
                    >
                        Badges Earned
                    </div>

                </div>

            </div>


            {/* ERROR */}

            {message && (

                <div
                    style={{
                        padding: "14px",
                        marginBottom: "25px",
                        background: "#fef2f2",
                        color: "#000",
                        border: "1px solid #fecaca",
                        borderRadius: "10px"
                    }}
                >
                    {message}
                </div>

            )}


            {/* BADGES */}

            {badges.length === 0 ? (

                <div
                    style={{
                        background: "#ffffff",
                        padding: "35px",
                        borderRadius: "14px",
                        border: "1px solid #e5e7eb",
                        boxShadow:
                            "0 2px 10px rgba(0,0,0,0.08)",
                        textAlign: "center",
                        color: "#000"
                    }}
                >

                    <div
                        style={{
                            fontSize: "50px",
                            marginBottom: "15px"
                        }}
                    >
                        🏆
                    </div>

                    <h2
                        style={{
                            margin: "0 0 8px",
                            color: "#000"
                        }}
                    >
                        No badges available
                    </h2>

                    <p
                        style={{
                            margin: 0,
                            color: "#000"
                        }}
                    >
                        Complete activities on OppurtuneX
                        to unlock achievements.
                    </p>

                </div>

            ) : (

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: "22px"
                    }}
                >

                    {badges.map((badge) => {

                        const progress =
                            getProgress(badge);

                        const percentage =
                            badge.requirementCount > 0
                                ? Math.min(
                                    100,
                                    Math.round(
                                        (progress /
                                            badge.requirementCount) *
                                        100
                                    )
                                )
                                : 0;

                        return (

                            <div
                                key={badge._id}
                                style={{
                                    background: "#ffffff",
                                    border: badge.earned
                                        ? "2px solid #16a34a"
                                        : "1px solid #e5e7eb",
                                    borderRadius: "16px",
                                    padding: "25px",
                                    boxShadow:
                                        "0 4px 12px rgba(0,0,0,0.08)",
                                    position: "relative",
                                    minHeight: "300px",
                                    display: "flex",
                                    flexDirection: "column"
                                }}
                            >

                                {/* STATUS */}

                                <div
                                    style={{
                                        position: "absolute",
                                        top: "18px",
                                        right: "18px",
                                        padding: "5px 10px",
                                        borderRadius: "20px",
                                        fontSize: "12px",
                                        fontWeight: "700",
                                        background: badge.earned
                                            ? "#dcfce7"
                                            : "#f3f4f6",
                                        color: "#000"
                                    }}
                                >
                                    {badge.earned
                                        ? "✓ Earned"
                                        : "Locked"}
                                </div>


                                {/* ICON */}

                                <div
                                    style={{
                                        width: "90px",
                                        height: "90px",
                                        borderRadius: "50%",
                                        background: badge.earned
                                            ? "#fef3c7"
                                            : "#f3f4f6",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "48px",
                                        marginBottom: "20px"
                                    }}
                                >
                                    {badge.earned
                                        ? badge.icon
                                        : "🔒"}
                                </div>


                                {/* NAME */}

                                <h2
                                    style={{
                                        margin:
                                            "0 0 10px",
                                        fontSize: "21px",
                                        color: "#000"
                                    }}
                                >
                                    {badge.name}
                                </h2>


                                {/* DESCRIPTION */}

                                <p
                                    style={{
                                        margin:
                                            "0 0 15px",
                                        lineHeight: "1.5",
                                        color: "#000"
                                    }}
                                >
                                    {badge.description}
                                </p>


                                {/* REQUIREMENT */}

                                <div
                                    style={{
                                        marginTop: "auto"
                                    }}
                                >

                                    <p
                                        style={{
                                            margin:
                                                "0 0 10px",
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            color: "#000"
                                        }}
                                    >
                                        Requirement
                                    </p>

                                    <p
                                        style={{
                                            margin:
                                                "0 0 15px",
                                            fontSize: "14px",
                                            color: "#000"
                                        }}
                                    >
                                        {getRequirementText(
                                            badge
                                        )}
                                    </p>


                                    {/* EARNED */}

                                    {badge.earned ? (

                                        <div>

                                            <div
                                                style={{
                                                    padding:
                                                        "10px 12px",
                                                    background:
                                                        "#f0fdf4",
                                                    borderRadius:
                                                        "8px",
                                                    color: "#000",
                                                    fontSize:
                                                        "13px",
                                                    fontWeight:
                                                        "600"
                                                }}
                                            >
                                                🏆 Achievement
                                                unlocked!
                                            </div>

                                            {badge.earnedAt && (

                                                <p
                                                    style={{
                                                        margin:
                                                            "10px 0 0",
                                                        fontSize:
                                                            "12px",
                                                        color:
                                                            "#000"
                                                    }}
                                                >
                                                    Earned on{" "}
                                                    {formatDate(
                                                        badge.earnedAt
                                                    )}
                                                </p>

                                            )}

                                        </div>

                                    ) : (

                                        <div>

                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    marginBottom:
                                                        "7px",
                                                    fontSize:
                                                        "13px",
                                                    fontWeight:
                                                        "600",
                                                    color: "#000"
                                                }}
                                            >

                                                <span>
                                                    Progress
                                                </span>

                                                <span>
                                                    {progress} /{" "}
                                                    {
                                                        badge.requirementCount
                                                    }
                                                </span>

                                            </div>


                                            <div
                                                style={{
                                                    width: "100%",
                                                    height: "9px",
                                                    background:
                                                        "#e5e7eb",
                                                    borderRadius:
                                                        "10px",
                                                    overflow:
                                                        "hidden"
                                                }}
                                            >

                                                <div
                                                    style={{
                                                        width:
                                                            `${percentage}%`,
                                                        height: "100%",
                                                        background:
                                                            "#2563eb",
                                                        borderRadius:
                                                            "10px"
                                                    }}
                                                />

                                            </div>

                                            <p
                                                style={{
                                                    margin:
                                                        "8px 0 0",
                                                    fontSize:
                                                        "12px",
                                                    color: "#000"
                                                }}
                                            >
                                                {percentage}% complete
                                            </p>

                                        </div>

                                    )}

                                </div>

                            </div>

                        );

                    })}

                </div>

            )}

        </div>

    );

}

export default Achievements;