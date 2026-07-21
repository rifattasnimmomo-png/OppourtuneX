import { useState, useEffect } from "react";
import "../styles/cards.css";
import ScholarshipForm from "./ScholarshipForm";
import { updateScholarship, deleteScholarship } from "../services/scholarshipService";
import { applyForOpportunity, getApplicationsForOpportunity, updateApplicationStatus, withdrawApplication } from "../services/applicationService";

function ScholarshipCard({ scholarship, refresh, myApplication }) {

    const user = JSON.parse(localStorage.getItem("user"));
    const isOwner = scholarship.createdBy === user.id;

    const [isEditing, setIsEditing] = useState(false);
    const [showApplicants, setShowApplicants] = useState(false);
    const [applicants, setApplicants] = useState([]);
    const [isApplying, setIsApplying] = useState(false);

    const daysLeft = Math.ceil((new Date(scholarship.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    const isClosingSoon = daysLeft >= 0 && daysLeft <= 7;
    const isExpired = daysLeft < 0;

    useEffect(() => {

        if (isOwner) loadApplicants();

    }, []);

    const handleUpdate = async (data) => {

        try {

            await updateScholarship(scholarship._id, data);

            setIsEditing(false);

            refresh();

        }

        catch (err) {

            console.log(err);

        }

    };

    const handleDelete = async () => {

        if (!window.confirm("Delete this scholarship posting?")) return;

        try {

            await deleteScholarship(scholarship._id);

            refresh();

        }

        catch (err) {

            console.log(err);

        }

    };

    const loadApplicants = async () => {

        try {

            const res = await getApplicationsForOpportunity(scholarship._id);

            setApplicants(res.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    const toggleApplicants = () => {

        if (!showApplicants) loadApplicants();

        setShowApplicants(!showApplicants);

    };

    const handleDecision = async (applicationId, status) => {

        try {

            await updateApplicationStatus(applicationId, status);

            loadApplicants();

        }

        catch (err) {

            console.log(err);

        }

    };

    const handleApply = async () => {

        if (!window.confirm("Apply to this scholarship?")) return;

        setIsApplying(true);

        try {

            await applyForOpportunity({
                student: user.id,
                opportunity: scholarship._id,
                opportunityType: "Scholarship"
            });

            refresh();

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setIsApplying(false);

        }

    };

    const handleWithdraw = async () => {

        if (!window.confirm("Withdraw this application?")) return;

        try {

            await withdrawApplication(myApplication._id);

            refresh();

        }

        catch (err) {

            console.log(err);

        }

    };

    if (isEditing) {

        return (

            <div className="post-card">

                <ScholarshipForm
                    initialValues={scholarship}
                    onSubmit={handleUpdate}
                    submitLabel="Save Changes"
                    onCancel={() => setIsEditing(false)}
                />

            </div>

        );

    }

    return (

        <div className="post-card">

            <h3>{scholarship.title}</h3>

            {
                isClosingSoon && (
                    <span className="badge-warning">⏰ Closing Soon</span>
                )
            }

            <p><b>{scholarship.university}</b></p>

            <p>{scholarship.description}</p>

            <p>Amount: {scholarship.amount}</p>

            <p>Eligibility: {scholarship.eligibility}</p>

            <p>Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</p>

            {
                user.role === "student" && (

                    <div>

                        {
                            isExpired && (!myApplication || myApplication.status === "withdrawn" || myApplication.status === "rejected") && (
                                <p><span className="badge-neutral">Applications Closed</span></p>
                            )
                        }

                        {
                            !isExpired && (!myApplication || myApplication.status === "withdrawn" || myApplication.status === "rejected") && (
                                <button onClick={handleApply} disabled={isApplying}>
                                    {isApplying ? "Applying..." : "Apply"}
                                </button>
                            )
                        }

                        {
                            myApplication && myApplication.status === "pending" && (

                                <p>
                                    <span className="badge-pending">Pending</span>{" "}
                                    Applied on {new Date(myApplication.createdAt).toLocaleDateString()}{" "}
                                    <button onClick={handleWithdraw}>
                                        Withdraw
                                    </button>
                                </p>

                            )
                        }

                        {
                            myApplication && myApplication.status === "accepted" && (

                                <p>
                                    <span className="badge-success">Accepted</span>{" "}
                                    Applied on {new Date(myApplication.createdAt).toLocaleDateString()}{" "}
                                    <button onClick={handleWithdraw}>
                                        Withdraw
                                    </button>
                                </p>

                            )
                        }

                        {
                            myApplication && myApplication.status === "rejected" && (

                                <p>
                                    <span className="badge-neutral">Rejected</span>{" "}
                                    Applied on {new Date(myApplication.createdAt).toLocaleDateString()}
                                </p>

                            )
                        }

                        {
                            myApplication && myApplication.status === "withdrawn" && (

                                <p>
                                    <span className="badge-neutral">Withdrawn</span>{" "}
                                    Applied on {new Date(myApplication.createdAt).toLocaleDateString()}
                                </p>

                            )
                        }

                    </div>

                )
            }

            {
                isOwner && (

                    <div>

                        <button onClick={() => setIsEditing(true)}>
                            Edit
                        </button>

                        <button onClick={handleDelete}>
                            Delete
                        </button>

                        <button onClick={toggleApplicants}>
                            {showApplicants ? "Hide Applicants" : `View Applicants (${applicants.length})`}
                        </button>

                        {
                            showApplicants && (

                                <div>

                                    {
                                        applicants.length === 0 ?
                                        (
                                            <p>No applicants yet.</p>
                                        )
                                        :
                                        (
                                            applicants.map((app) => (

                                                <div key={app._id} className="applicant-row">

                                                    <p>
                                                        {app.student?.name} ({app.student?.email}){" "}
                                                        <span className={
                                                            app.status === "accepted" ? "badge-success" :
                                                            app.status === "pending" ? "badge-pending" :
                                                            "badge-neutral"
                                                        }>
                                                            {app.status}
                                                        </span>
                                                    </p>

                                                    {
                                                        app.status === "pending" && (

                                                            <div>

                                                                <button onClick={() => handleDecision(app._id, "accepted")}>
                                                                    Accept
                                                                </button>

                                                                <button onClick={() => handleDecision(app._id, "rejected")}>
                                                                    Reject
                                                                </button>

                                                            </div>

                                                        )
                                                    }

                                                </div>

                                            ))
                                        )
                                    }

                                </div>

                            )
                        }

                    </div>

                )
            }

        </div>

    );

}

export default ScholarshipCard;