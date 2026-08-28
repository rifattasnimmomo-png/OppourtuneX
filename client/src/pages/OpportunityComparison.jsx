import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function OpportunityComparison() {

    const navigate = useNavigate();

    const [opportunities, setOpportunities] = useState([]);

    useEffect(() => {

        const saved =
            JSON.parse(
                localStorage.getItem("comparisonOpportunities") || "[]"
            );

        setOpportunities(saved);

    }, []);

    const removeOpportunity = (id) => {

        const updated =
            opportunities.filter(
                (opportunity) =>
                    opportunity._id !== id
            );

        setOpportunities(updated);

        localStorage.setItem(
            "comparisonOpportunities",
            JSON.stringify(updated)
        );

    };

    const clearComparison = () => {

        localStorage.removeItem(
            "comparisonOpportunities"
        );

        setOpportunities([]);

    };

    const formatDate = (date) => {

        if (!date) return "N/A";

        return new Date(date).toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric"
            }
        );

    };

    const formatCurrency = (amount) => {

        if (
            amount === undefined ||
            amount === null
        ) {
            return "N/A";
        }

        return `₹${Number(amount).toLocaleString()}`;

    };

    if (opportunities.length === 0) {

        return (

            <div>

                <h1>Compare Opportunities</h1>

                <p>
                    Select internships or scholarships to compare them side by side.
                </p>

                <div
                    style={{
                        background: "white",
                        padding: "25px",
                        marginTop: "25px",
                        borderRadius: "10px",
                        boxShadow:
                            "0 2px 8px rgba(0,0,0,.1)"
                    }}
                >

                    <p>
                        No opportunities selected for comparison.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/internships")
                        }
                    >
                        Browse Internships
                    </button>

                    {" "}

                    <button
                        onClick={() =>
                            navigate("/scholarships")
                        }
                    >
                        Browse Scholarships
                    </button>

                </div>

            </div>

        );

    }

    return (

        <div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "15px",
                    flexWrap: "wrap"
                }}
            >

                <div>

                    <h1>Compare Opportunities</h1>

                    <p>
                        Compare your selected internships and scholarships side by side.
                    </p>

                </div>

                <button
                    onClick={clearComparison}
                >
                    Clear Comparison
                </button>

            </div>


            <div
                style={{
                    overflowX: "auto",
                    marginTop: "30px"
                }}
            >

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            `180px repeat(${opportunities.length}, minmax(260px, 1fr))`,
                        minWidth:
                            `${180 + opportunities.length * 280}px`,
                        background: "white",
                        borderRadius: "10px",
                        overflow: "hidden",
                        boxShadow:
                            "0 2px 8px rgba(0,0,0,.1)"
                    }}
                >

                    {/* HEADER */}

                    <div
                        style={{
                            padding: "20px",
                            fontWeight: "700",
                            borderBottom: "1px solid #eee"
                        }}
                    >
                        Opportunity
                    </div>

                    {opportunities.map((opportunity) => (

                        <div
                            key={opportunity._id}
                            style={{
                                padding: "20px",
                                borderLeft:
                                    "1px solid #eee",
                                borderBottom:
                                    "1px solid #eee"
                            }}
                        >

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    gap: "10px"
                                }}
                            >

                                <strong>
                                    {opportunity.title}
                                </strong>

                                <button
                                    onClick={() =>
                                        removeOpportunity(
                                            opportunity._id
                                        )
                                    }
                                >
                                    Remove
                                </button>

                            </div>

                        </div>

                    ))}


                    {/* TYPE */}

                    <div
                        style={{
                            padding: "18px",
                            fontWeight: "600",
                            borderBottom: "1px solid #eee"
                        }}
                    >
                        Type
                    </div>

                    {opportunities.map((opportunity) => (

                        <div
                            key={`${opportunity._id}-type`}
                            style={{
                                padding: "18px",
                                borderLeft:
                                    "1px solid #eee",
                                borderBottom:
                                    "1px solid #eee"
                            }}
                        >

                            {opportunity.opportunityType ||
                                opportunity.type ||
                                "Opportunity"}

                        </div>

                    ))}


                    {/* COMPANY / UNIVERSITY */}

                    <div
                        style={{
                            padding: "18px",
                            fontWeight: "600",
                            borderBottom: "1px solid #eee"
                        }}
                    >
                        Organization
                    </div>

                    {opportunities.map((opportunity) => (

                        <div
                            key={`${opportunity._id}-organization`}
                            style={{
                                padding: "18px",
                                borderLeft:
                                    "1px solid #eee",
                                borderBottom:
                                    "1px solid #eee"
                            }}
                        >

                            {opportunity.opportunityType ===
                            "Scholarship"
                                ? opportunity.university
                                : opportunity.company}

                        </div>

                    ))}


                    {/* LOCATION */}

                    <div
                        style={{
                            padding: "18px",
                            fontWeight: "600",
                            borderBottom: "1px solid #eee"
                        }}
                    >
                        Location
                    </div>

                    {opportunities.map((opportunity) => (

                        <div
                            key={`${opportunity._id}-location`}
                            style={{
                                padding: "18px",
                                borderLeft:
                                    "1px solid #eee",
                                borderBottom:
                                    "1px solid #eee"
                            }}
                        >

                            {opportunity.location || "N/A"}

                        </div>

                    ))}


                    {/* WORK TYPE */}

                    <div
                        style={{
                            padding: "18px",
                            fontWeight: "600",
                            borderBottom: "1px solid #eee"
                        }}
                    >
                        Work Type
                    </div>

                    {opportunities.map((opportunity) => (

                        <div
                            key={`${opportunity._id}-work`}
                            style={{
                                padding: "18px",
                                borderLeft:
                                    "1px solid #eee",
                                borderBottom:
                                    "1px solid #eee"
                            }}
                        >

                            {opportunity.workType || "N/A"}

                        </div>

                    ))}


                    {/* STIPEND / AMOUNT */}

                    <div
                        style={{
                            padding: "18px",
                            fontWeight: "600",
                            borderBottom: "1px solid #eee"
                        }}
                    >
                        Amount / Stipend
                    </div>

                    {opportunities.map((opportunity) => (

                        <div
                            key={`${opportunity._id}-amount`}
                            style={{
                                padding: "18px",
                                borderLeft:
                                    "1px solid #eee",
                                borderBottom:
                                    "1px solid #eee"
                            }}
                        >

                            {opportunity.opportunityType ===
                            "Scholarship"
                                ? formatCurrency(
                                    opportunity.amount
                                )
                                : formatCurrency(
                                    opportunity.stipend
                                )}

                        </div>

                    ))}


                    {/* DURATION */}

                    <div
                        style={{
                            padding: "18px",
                            fontWeight: "600",
                            borderBottom: "1px solid #eee"
                        }}
                    >
                        Duration
                    </div>

                    {opportunities.map((opportunity) => (

                        <div
                            key={`${opportunity._id}-duration`}
                            style={{
                                padding: "18px",
                                borderLeft:
                                    "1px solid #eee",
                                borderBottom:
                                    "1px solid #eee"
                            }}
                        >

                            {opportunity.duration || "N/A"}

                        </div>

                    ))}


                    {/* DEADLINE */}

                    <div
                        style={{
                            padding: "18px",
                            fontWeight: "600",
                            borderBottom: "1px solid #eee"
                        }}
                    >
                        Deadline
                    </div>

                    {opportunities.map((opportunity) => (

                        <div
                            key={`${opportunity._id}-deadline`}
                            style={{
                                padding: "18px",
                                borderLeft:
                                    "1px solid #eee",
                                borderBottom:
                                    "1px solid #eee"
                            }}
                        >

                            {formatDate(
                                opportunity.deadline
                            )}

                        </div>

                    ))}


                    {/* ELIGIBILITY */}

                    <div
                        style={{
                            padding: "18px",
                            fontWeight: "600",
                            borderBottom: "1px solid #eee"
                        }}
                    >
                        Eligibility
                    </div>

                    {opportunities.map((opportunity) => (

                        <div
                            key={`${opportunity._id}-eligibility`}
                            style={{
                                padding: "18px",
                                borderLeft:
                                    "1px solid #eee",
                                borderBottom:
                                    "1px solid #eee"
                            }}
                        >

                            {opportunity.eligibility ||
                                "N/A"}

                        </div>

                    ))}


                    {/* SKILLS */}

                    <div
                        style={{
                            padding: "18px",
                            fontWeight: "600",
                            borderBottom: "1px solid #eee"
                        }}
                    >
                        Skills
                    </div>

                    {opportunities.map((opportunity) => (

                        <div
                            key={`${opportunity._id}-skills`}
                            style={{
                                padding: "18px",
                                borderLeft:
                                    "1px solid #eee",
                                borderBottom: "1px solid #eee"
                            }}
                        >

                            {opportunity.skills?.length > 0
                                ? opportunity.skills.join(", ")
                                : "N/A"}

                        </div>

                    ))}


                    {/* DESCRIPTION */}

                    <div
                        style={{
                            padding: "18px",
                            fontWeight: "600"
                        }}
                    >
                        Description
                    </div>

                    {opportunities.map((opportunity) => (

                        <div
                            key={`${opportunity._id}-description`}
                            style={{
                                padding: "18px",
                                borderLeft:
                                    "1px solid #eee"
                            }}
                        >

                            {opportunity.description ||
                                "N/A"}

                        </div>

                    ))}

                </div>

            </div>

        </div>

    );

}

export default OpportunityComparison;