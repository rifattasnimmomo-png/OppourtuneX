import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    getMyApplications,
    withdrawApplication
} from "../services/applicationService";

import {
    getInterviewsForStudent
} from "../services/interviewService";

import {
    getInternships
} from "../services/internshipService";

import {
    getScholarships
} from "../services/scholarshipService";

import {
    getAssessmentsForOpportunity,
    getStudentResult
} from "../services/assessmentService";

import "../styles/cards.css";
import "../styles/filters.css";
import "../styles/dashboard-applications.css";

function StudentDashboard() {

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [applications, setApplications] = useState([]);
    const [internships, setInternships] = useState([]);
    const [scholarships, setScholarships] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [assessments, setAssessments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("all");
    const [sortBy, setSortBy] = useState("recent");

    useEffect(() => {
        if (user.role === "student") {
            loadDashboard();
        } else {
            setLoading(false);
        }
    }, []);

    const loadDashboard = async () => {
        setLoading(true);

        try {
            const [
                applicationsRes,
                internshipsRes,
                scholarshipsRes,
                interviewsRes
            ] = await Promise.all([
                getMyApplications(user.id),
                getInternships(),
                getScholarships(),
                getInterviewsForStudent(user.id)
            ]);

            const apps = applicationsRes.data || [];

            setApplications(apps);
            setInternships(internshipsRes.data || []);
            setScholarships(scholarshipsRes.data || []);
            setInterviews(interviewsRes.data || []);

            const assessmentList = [];

            for (const app of apps) {

                if (!app.opportunity) continue;
                if (app.status === "withdrawn") continue;

                try {
                    const assessmentRes =
                        await getAssessmentsForOpportunity(
                            app.opportunity
                        );

                    const list = assessmentRes.data || [];

                    for (const assessment of list) {

                        let submitted = false;

                        try {
                            await getStudentResult(
                                assessment._id,
                                user.id
                            );
                            submitted = true;
                        } catch (err) {
                            if (err.response?.status !== 404) {
                                console.log(err);
                            }
                        }

                        assessmentList.push({
                            ...assessment,
                            applicationStatus: app.status,
                            hasSubmitted: submitted
                        });
                    }

                } catch (err) {
                    console.log(err);
                }
            }

            const unique = [];

            assessmentList.forEach((assessment) => {
                if (!unique.find((a) => a._id === assessment._id)) {
                    unique.push(assessment);
                }
            });

            setAssessments(unique);

        } catch (err) {
            console.log(err);
        }

        setLoading(false);
    };

    const handleWithdraw = async (id) => {
        if (!window.confirm("Withdraw this application?")) return;

        try {
            await withdrawApplication(id);
            loadDashboard();
        } catch (err) {
            console.log(err);
        }
    };

    if (user.role !== "student") {
        return (
            <div>
                <h1>Student Dashboard</h1>
                <p>This dashboard is only available for student accounts.</p>
            </div>
        );
    }

    const enrichedApplications = applications.map((app) => {

        const source =
            app.opportunityType === "Internship"
                ? internships
                : scholarships;

        const opportunity = source.find(
            (o) => o._id === app.opportunity
        );

        return {
            ...app,
            opportunity
        };

    });

    const stats = {
        total: enrichedApplications.length,
        pending: enrichedApplications.filter((a) => a.status === "pending").length,
        accepted: enrichedApplications.filter((a) => a.status === "accepted").length,
        rejected: enrichedApplications.filter((a) => a.status === "rejected").length,
        withdrawn: enrichedApplications.filter((a) => a.status === "withdrawn").length
    };

    const filteredApplications =
        activeFilter === "all"
            ? enrichedApplications
            : enrichedApplications.filter(
                  (a) => a.status === activeFilter
              );

    const sortedApplications = [...filteredApplications].sort((a, b) => {

        if (sortBy === "deadline") {

            if (!a.opportunity) return 1;
            if (!b.opportunity) return -1;

            return (
                new Date(a.opportunity.deadline) -
                new Date(b.opportunity.deadline)
            );
        }

        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const upcomingInterviews = interviews
        .filter(
            (i) =>
                i.status === "scheduled" &&
                new Date(i.scheduledAt) >= new Date()
        )
        .sort(
            (a, b) =>
                new Date(a.scheduledAt) -
                new Date(b.scheduledAt)
        );

    return (
        <div>

            <h1>Student Dashboard</h1>

            {/* Upcoming Interviews */}

            <h2>Upcoming Interviews</h2>

            {loading ? (
                <p>Loading your interviews...</p>
            ) : upcomingInterviews.length === 0 ? (
                <div className="empty-state">
                    <p>No interviews scheduled.</p>
                </div>
            ) : (
                upcomingInterviews.map((interview) => (
                    <div
                        key={interview._id}
                        className="application-row"
                    >
                        <div>

                            <span className="type-badge">
                                Interview
                            </span>

                            <h3>Interview</h3>

                            <p>
                                <strong>Date:</strong>{" "}
                                {new Date(
                                    interview.scheduledAt
                                ).toLocaleString()}
                            </p>

                            <p>
                                <strong>Duration:</strong>{" "}
                                {interview.duration} minutes
                            </p>

                            <p>
                                <strong>Scheduled by:</strong>{" "}
                                {interview.scheduledBy?.companyName ||
                                    interview.scheduledBy?.universityName ||
                                    interview.scheduledBy?.name ||
                                    "Organization"}
                            </p>

                            {interview.meetingLink && (
                                <p>
                                    <strong>Meeting:</strong>{" "}
                                    <a
                                        href={interview.meetingLink}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Join Meeting
                                    </a>
                                </p>
                            )}

                            {interview.notes && (
                                <p>
                                    <strong>Notes:</strong>{" "}
                                    {interview.notes}
                                </p>
                            )}

                        </div>

                        <div className="application-status">
                            <span className="badge-success">
                                Scheduled
                            </span>
                        </div>
                    </div>
                ))
            )}

            {/* Assessments */}

            <h2>Assessments</h2>

            {loading ? (
                <p>Loading your assessments...</p>
            ) : assessments.length === 0 ? (
                <div className="empty-state">
                    <p>
                        No assessments have been posted for your applications yet.
                    </p>
                </div>
            ) : (
                assessments.map((assessment) => (
                    <div
                        key={assessment._id}
                        className="application-row"
                    >
                        <div>

                            <span className="type-badge">
                                Assessment
                            </span>

                            <h3>{assessment.title}</h3>

                            {assessment.description && (
                                <p>{assessment.description}</p>
                            )}

                            <p>
                                <strong>Questions:</strong>{" "}
                                {assessment.questions?.length || 0}
                            </p>

                            <p>
                                <strong>Duration:</strong>{" "}
                                {assessment.duration} minutes
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                {assessment.applicationStatus}
                            </p>

                        </div>

                        <div className="application-status">

                            {assessment.hasSubmitted ? (
                                <Link
                                    to={`/assessments/${assessment._id}/result/${user.id}`}
                                >
                                    <button>
                                        View Result
                                    </button>
                                </Link>
                            ) : (
                                <Link
                                    to={`/assessments/${assessment._id}/take`}
                                >
                                    <button>
                                        Take Assessment
                                    </button>
                                </Link>
                            )}

                        </div>
                    </div>
                ))
            )}

            {/* My Applications */}

            <h2>My Applications</h2>

            {loading ? (
                <p>Loading your applications...</p>
            ) : (
                <div>

                    <div className="stats-row">

                        <div
                            className={
                                activeFilter === "all"
                                    ? "stat-box active"
                                    : "stat-box"
                            }
                            onClick={() =>
                                setActiveFilter("all")
                            }
                        >
                            <p className="stat-number">{stats.total}</p>
                            <p className="stat-label">Total</p>
                        </div>

                        <div
                            className={
                                activeFilter === "pending"
                                    ? "stat-box stat-pending active"
                                    : "stat-box stat-pending"
                            }
                            onClick={() =>
                                setActiveFilter("pending")
                            }
                        >
                            <p className="stat-number">{stats.pending}</p>
                            <p className="stat-label">Pending</p>
                        </div>

                        <div
                            className={
                                activeFilter === "accepted"
                                    ? "stat-box stat-accepted active"
                                    : "stat-box stat-accepted"
                            }
                            onClick={() =>
                                setActiveFilter("accepted")
                            }
                        >
                            <p className="stat-number">{stats.accepted}</p>
                            <p className="stat-label">Accepted</p>
                        </div>

                        <div
                            className={
                                activeFilter === "rejected"
                                    ? "stat-box stat-rejected active"
                                    : "stat-box stat-rejected"
                            }
                            onClick={() =>
                                setActiveFilter("rejected")
                            }
                        >
                            <p className="stat-number">{stats.rejected}</p>
                            <p className="stat-label">Rejected</p>
                        </div>

                        <div
                            className={
                                activeFilter === "withdrawn"
                                    ? "stat-box active"
                                    : "stat-box"
                            }
                            onClick={() =>
                                setActiveFilter("withdrawn")
                            }
                        >
                            <p className="stat-number">{stats.withdrawn}</p>
                            <p className="stat-label">Withdrawn</p>
                        </div>

                    </div>

                    <div className="filter-tabs">

                        {["all","pending","accepted","rejected","withdrawn"].map((status) => (
                            <button
                                key={status}
                                className={
                                    activeFilter === status
                                        ? "filter-tab active"
                                        : "filter-tab"
                                }
                                onClick={() =>
                                    setActiveFilter(status)
                                }
                            >
                                {status.charAt(0).toUpperCase() +
                                    status.slice(1)}
                            </button>
                        ))}

                    </div>

                    {filteredApplications.length > 0 && (
                        <div className="results-bar">

                            <span>
                                {filteredApplications.length} application
                                {filteredApplications.length !== 1
                                    ? "s"
                                    : ""}
                            </span>

                            <label>

                                Sort by:

                                <select
                                    value={sortBy}
                                    onChange={(e) =>
                                        setSortBy(e.target.value)
                                    }
                                >
                                    <option value="recent">
                                        Recently Applied
                                    </option>

                                    <option value="deadline">
                                        Deadline Soonest
                                    </option>

                                </select>

                            </label>

                        </div>
                    )}

                    {filteredApplications.length === 0 ? (
                        stats.total === 0 ? (
                            <div className="empty-state">
                                <p>You haven't applied to anything yet.</p>

                                <p>
                                    <Link to="/internships">
                                        Browse Internships
                                    </Link>{" "}
                                    or{" "}
                                    <Link to="/scholarships">
                                        Browse Scholarships
                                    </Link>
                                </p>

                            </div>
                        ) : (
                            <p>No applications in this category yet.</p>
                        )
                    ) : (
                        sortedApplications.map((app) => (
                            <div
                                key={app._id}
                                className="application-row"
                            >
                                <div>

                                    <span className="type-badge">
                                        {app.opportunityType}
                                    </span>

                                    <h3>
                                        {app.opportunity
                                            ? app.opportunity.title
                                            : "Opportunity no longer available"}
                                    </h3>

                                    <p>
                                        {app.opportunity &&
                                            (app.opportunityType ===
                                            "Internship"
                                                ? app.opportunity.company
                                                : app.opportunity.university)}
                                    </p>

                                    <p>
                                        Applied on{" "}
                                        {new Date(
                                            app.createdAt
                                        ).toLocaleDateString()}
                                    </p>

                                    {app.opportunity && (
                                        <p>
                                            Deadline:{" "}
                                            {new Date(
                                                app.opportunity.deadline
                                            ).toLocaleDateString()}
                                        </p>
                                    )}

                                </div>

                                <div className="application-status">

                                    <span
                                        className={
                                            app.status === "accepted"
                                                ? "badge-success"
                                                : app.status === "pending"
                                                ? "badge-pending"
                                                : app.status === "rejected"
                                                ? "badge-danger"
                                                : "badge-neutral"
                                        }
                                    >
                                        {app.status}
                                    </span>

                                    {(app.status === "pending" ||
                                        app.status === "accepted") && (
                                        <button
                                            onClick={() =>
                                                handleWithdraw(app._id)
                                            }
                                        >
                                            Withdraw
                                        </button>
                                    )}

                                </div>

                            </div>
                        ))
                    )}

                </div>
            )}

        </div>
    );
}

export default StudentDashboard;