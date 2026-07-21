import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyApplications, withdrawApplication } from "../services/applicationService";
import { getInternships } from "../services/internshipService";
import { getScholarships } from "../services/scholarshipService";
import "../styles/cards.css";
import "../styles/filters.css";
import "../styles/dashboard-applications.css";

function StudentDashboard() {

    const user = JSON.parse(localStorage.getItem("user"));

    const [applications, setApplications] = useState([]);
    const [internships, setInternships] = useState([]);
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("all");
    const [sortBy, setSortBy] = useState("recent");

    useEffect(() => {

        if (user.role === "student") {
            loadDashboard();
        }

    }, []);

    const loadDashboard = async () => {

        setLoading(true);

        try {

            const [applicationsRes, internshipsRes, scholarshipsRes] = await Promise.all([
                getMyApplications(user.id),
                getInternships(),
                getScholarships()
            ]);

            setApplications(applicationsRes.data);
            setInternships(internshipsRes.data);
            setScholarships(scholarshipsRes.data);

        }

        catch (err) {

            console.log(err);

        }

        setLoading(false);

    };

    const handleWithdraw = async (applicationId) => {

        if (!window.confirm("Withdraw this application?")) return;

        try {

            await withdrawApplication(applicationId);

            loadDashboard();

        }

        catch (err) {

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

        const source = app.opportunityType === "Internship" ? internships : scholarships;

        const opportunity = source.find((o) => o._id === app.opportunity);

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

    const filteredApplications = activeFilter === "all"
        ? enrichedApplications
        : enrichedApplications.filter((a) => a.status === activeFilter);

    const sortedApplications = [...filteredApplications].sort((a, b) => {

        if (sortBy === "deadline") {

            if (!a.opportunity) return 1;
            if (!b.opportunity) return -1;

            return new Date(a.opportunity.deadline) - new Date(b.opportunity.deadline);

        }

        return new Date(b.createdAt) - new Date(a.createdAt);

    });

    return (

        <div>

            <h1>Student Dashboard</h1>

            <h2>My Applications</h2>

            {
                loading ?
                (
                    <p>Loading your applications...</p>
                )
                :
                (
                    <div>

                        <div className="stats-row">

                            <div
                                className={activeFilter === "all" ? "stat-box active" : "stat-box"}
                                onClick={() => setActiveFilter("all")}
                            >
                                <p className="stat-number">{stats.total}</p>
                                <p className="stat-label">Total</p>
                            </div>

                            <div
                                className={activeFilter === "pending" ? "stat-box stat-pending active" : "stat-box stat-pending"}
                                onClick={() => setActiveFilter("pending")}
                            >
                                <p className="stat-number">{stats.pending}</p>
                                <p className="stat-label">Pending</p>
                            </div>

                            <div
                                className={activeFilter === "accepted" ? "stat-box stat-accepted active" : "stat-box stat-accepted"}
                                onClick={() => setActiveFilter("accepted")}
                            >
                                <p className="stat-number">{stats.accepted}</p>
                                <p className="stat-label">Accepted</p>
                            </div>

                            <div
                                className={activeFilter === "rejected" ? "stat-box stat-rejected active" : "stat-box stat-rejected"}
                                onClick={() => setActiveFilter("rejected")}
                            >
                                <p className="stat-number">{stats.rejected}</p>
                                <p className="stat-label">Rejected</p>
                            </div>

                            <div
                                className={activeFilter === "withdrawn" ? "stat-box active" : "stat-box"}
                                onClick={() => setActiveFilter("withdrawn")}
                            >
                                <p className="stat-number">{stats.withdrawn}</p>
                                <p className="stat-label">Withdrawn</p>
                            </div>

                        </div>

                        <div className="filter-tabs">

                            <button
                                className={activeFilter === "all" ? "filter-tab active" : "filter-tab"}
                                onClick={() => setActiveFilter("all")}
                            >
                                All
                            </button>

                            <button
                                className={activeFilter === "pending" ? "filter-tab active" : "filter-tab"}
                                onClick={() => setActiveFilter("pending")}
                            >
                                Pending
                            </button>

                            <button
                                className={activeFilter === "accepted" ? "filter-tab active" : "filter-tab"}
                                onClick={() => setActiveFilter("accepted")}
                            >
                                Accepted
                            </button>

                            <button
                                className={activeFilter === "rejected" ? "filter-tab active" : "filter-tab"}
                                onClick={() => setActiveFilter("rejected")}
                            >
                                Rejected
                            </button>

                            <button
                                className={activeFilter === "withdrawn" ? "filter-tab active" : "filter-tab"}
                                onClick={() => setActiveFilter("withdrawn")}
                            >
                                Withdrawn
                            </button>

                        </div>

                        {
                            filteredApplications.length > 0 && (

                                <div className="results-bar">

                                    <span>{filteredApplications.length} application{filteredApplications.length !== 1 ? "s" : ""}</span>

                                    <label>
                                        Sort by:
                                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                            <option value="recent">Recently Applied</option>
                                            <option value="deadline">Deadline Soonest</option>
                                        </select>
                                    </label>

                                </div>

                            )
                        }

                        {
                            filteredApplications.length === 0 ?
                            (
                                stats.total === 0 ?
                                (
                                    <div className="empty-state">

                                        <p>You haven't applied to anything yet.</p>

                                        <p>
                                            <Link to="/internships">Browse Internships</Link>
                                            {" "}or{" "}
                                            <Link to="/scholarships">Browse Scholarships</Link>
                                        </p>

                                    </div>
                                )
                                :
                                (
                                    <p>No applications in this category yet.</p>
                                )
                            )
                            :
                            (
                                sortedApplications.map((app) => (

                                    <div key={app._id} className="application-row">

                                        <div>

                                            <span className="type-badge">{app.opportunityType}</span>

                                            <h3>
                                                {app.opportunity ? app.opportunity.title : "Opportunity no longer available"}
                                            </h3>

                                            <p>
                                                {
                                                    app.opportunity && (
                                                        app.opportunityType === "Internship" ?
                                                        app.opportunity.company :
                                                        app.opportunity.university
                                                    )
                                                }
                                            </p>

                                            <p>Applied on {new Date(app.createdAt).toLocaleDateString()}</p>

                                            {
                                                app.opportunity && (
                                                    <p>Deadline: {new Date(app.opportunity.deadline).toLocaleDateString()}</p>
                                                )
                                            }

                                        </div>

                                        <div className="application-status">

                                            <span className={
                                                app.status === "accepted" ? "badge-success" :
                                                app.status === "pending" ? "badge-pending" :
                                                app.status === "rejected" ? "badge-danger" :
                                                "badge-neutral"
                                            }>
                                                {app.status}
                                            </span>

                                            {
                                                (app.status === "pending" || app.status === "accepted") && (
                                                    <button onClick={() => handleWithdraw(app._id)}>
                                                        Withdraw
                                                    </button>
                                                )
                                            }

                                        </div>

                                    </div>

                                ))
                            )
                        }

                    </div>
                )
            }

        </div>

    );

}

export default StudentDashboard;