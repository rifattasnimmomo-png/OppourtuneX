import { useEffect, useMemo, useState } from "react";
import { getProfile } from "../services/userService";
import "../styles/matching-score.css";

const OPPORTUNITIES = [
    {
        id: 1,
        title: "Frontend Developer Intern",
        type: "Internship",
        location: "Remote",
        tags: ["react", "javascript", "ui", "frontend"],
        departments: ["computer science", "software engineering", "information technology"],
        minCgpa: 3.0
    },
    {
        id: 2,
        title: "Backend Developer Intern",
        type: "Internship",
        location: "Dhaka",
        tags: ["node", "express", "mongodb", "api"],
        departments: ["computer science", "software engineering"],
        minCgpa: 3.2
    },
    {
        id: 3,
        title: "Merit Scholarship",
        type: "Scholarship",
        location: "University Campus",
        tags: ["merit", "academic", "leadership"],
        departments: ["any"],
        minCgpa: 3.5
    },
    {
        id: 4,
        title: "Data Analyst Intern",
        type: "Internship",
        location: "Hybrid",
        tags: ["sql", "excel", "analytics", "python"],
        departments: ["statistics", "computer science", "business"],
        minCgpa: 3.0
    }
];

function tokenize(text) {
    return String(text || "")
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(Boolean);
}

function clampScore(value) {
    return Math.max(0, Math.min(100, Math.round(value)));
}

function calculateScore(profile, resumeData, opportunity) {
    const profileText = tokenize([
        profile?.department,
        profile?.bio,
        profile?.universityName,
        profile?.companyName,
        resumeData?.skillsText,
        resumeData?.summary,
        resumeData?.projectsText
    ].join(" "));

    const uniqueTokens = new Set(profileText);
    const tagMatches = opportunity.tags.filter((tag) => uniqueTokens.has(tag)).length;
    const departmentText = String(profile?.department || "").toLowerCase();
    const departmentMatch = opportunity.departments.includes("any") || opportunity.departments.some((item) => departmentText.includes(item));
    const cgpa = Number(profile?.cgpa || 0);

    const skillScore = Math.min(tagMatches * 16, 48);
    const educationScore = departmentMatch ? 20 : 8;
    const cgpaScore = cgpa >= opportunity.minCgpa ? 20 : Math.max(8, 20 - (opportunity.minCgpa - cgpa) * 12);
    const locationScore = opportunity.location === "Remote" ? 12 : 10;

    const total = clampScore(skillScore + educationScore + cgpaScore + locationScore);

    return {
        total,
        skillScore,
        educationScore,
        cgpaScore,
        locationScore,
        matches: tagMatches
    };
}

function MatchingScore() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const resumeData = JSON.parse(localStorage.getItem("opportunex-resume") || "{}");

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeOpportunityId, setActiveOpportunityId] = useState(OPPORTUNITIES[0].id);

    useEffect(() => {
        const loadProfile = async () => {
            if (!user?.id) {
                setProfile({ department: "Computer Science", cgpa: 3.4, bio: "Interested in web development and remote internships." });
                setLoading(false);
                return;
            }

            try {
                const response = await getProfile(user.id);
                setProfile(response.data);
            }
            catch (error) {
                console.log(error);
                setProfile({ department: "Computer Science", cgpa: 3.4, bio: "Interested in web development and remote internships." });
            }
            finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [user?.id]);

    const scoredOpportunities = useMemo(() => {
        return OPPORTUNITIES
            .map((opportunity) => ({
                ...opportunity,
                breakdown: calculateScore(profile, resumeData, opportunity)
            }))
            .sort((a, b) => b.breakdown.total - a.breakdown.total);
    }, [profile, resumeData]);

    const activeOpportunity = scoredOpportunities.find((item) => item.id === activeOpportunityId) || scoredOpportunities[0];

    return (
        <div className="matching-page">
            <div className="matching-header">
                <div>
                    <h1>Profile Matching Score</h1>
                    <p>See how well your profile and resume fit the available opportunities.</p>
                </div>
                <div className="matching-badge">{profile ? `${profile.department || "Student"}` : "Loading"}</div>
            </div>

            {loading ? (
                <div className="matching-panel">
                    <p>Loading profile match results...</p>
                </div>
            ) : (
                <div className="matching-layout">
                    <section className="matching-list">
                        {scoredOpportunities.map((opportunity) => (
                            <button
                                key={opportunity.id}
                                className={opportunity.id === activeOpportunityId ? "matching-card active" : "matching-card"}
                                onClick={() => setActiveOpportunityId(opportunity.id)}
                            >
                                <div className="matching-card-top">
                                    <strong>{opportunity.title}</strong>
                                    <span>{opportunity.type}</span>
                                </div>
                                <p>{opportunity.location}</p>
                                <div className="matching-score-line">
                                    <div className="matching-bar">
                                        <span style={{ width: `${opportunity.breakdown.total}%` }} />
                                    </div>
                                    <strong>{opportunity.breakdown.total}%</strong>
                                </div>
                            </button>
                        ))}
                    </section>

                    <section className="matching-panel">
                        <h2>{activeOpportunity.title}</h2>
                        <p className="matching-subtitle">{activeOpportunity.type} • {activeOpportunity.location}</p>

                        <div className="score-ring">
                            <div>
                                <strong>{activeOpportunity.breakdown.total}%</strong>
                                <span>Match</span>
                            </div>
                        </div>

                        <div className="score-breakdown">
                            <div>
                                <span>Skills</span>
                                <strong>{activeOpportunity.breakdown.skillScore}%</strong>
                            </div>
                            <div>
                                <span>Department</span>
                                <strong>{activeOpportunity.breakdown.educationScore}%</strong>
                            </div>
                            <div>
                                <span>CGPA</span>
                                <strong>{activeOpportunity.breakdown.cgpaScore}%</strong>
                            </div>
                            <div>
                                <span>Location</span>
                                <strong>{activeOpportunity.breakdown.locationScore}%</strong>
                            </div>
                        </div>

                        <div className="matching-notes">
                            <h3>Why this matches</h3>
                            <p>
                                We found {activeOpportunity.breakdown.matches} keyword match{activeOpportunity.breakdown.matches === 1 ? "" : "es"} in your profile or resume,
                                and your education details support this role well.
                            </p>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}

export default MatchingScore;
