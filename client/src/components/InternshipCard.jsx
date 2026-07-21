import { useState, useEffect } from "react";
import "../styles/cards.css";
import InternshipForm from "./InternshipForm";
import { updateInternship, deleteInternship } from "../services/internshipService";
import { applyForOpportunity, getApplicationsForOpportunity, updateApplicationStatus, withdrawApplication } from "../services/applicationService";

function InternshipCard({ internship, refresh, myApplication }) {

    const user = JSON.parse(localStorage.getItem("user"));
    const isOwner = internship.createdBy === user.id;

    const [isEditing, setIsEditing] = useState(false);
    const [showApplicants, setShowApplicants] = useState(false);
    const [applicants, setApplicants] = useState([]);
    const [isApplying, setIsApplying] = useState(false);

    const daysLeft = Math.ceil((new Date(internship.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    const isClosingSoon = daysLeft >= 0 && daysLeft <= 7;
    const isExpired = daysLeft < 0;

    useEffect(() => {

        if (isOwner) loadApplicants();

    }, []);

    const handleUpdate = async (data) => {

        try {

            await updateInternship(internship._id, data);

            setIsEditing(false);

            refresh();

        }

        catch (err) {

            console.log(err);

        }

    };

    const handleDelete = async () => {

        if (!window.confirm("Delete this internship posting?")) return;

        try {

            await deleteInternship(internship._id);

            refresh();

        }

        catch (err) {

            console.log(err);

        }

    };

    const loadApplicants = async () => {

        try {

            const res = await getApplicationsForOpportunity(internship._id);

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

        if (!window.confirm("Apply to this internship?")) return;

        setIsApplying(true);

        try {

            await applyForOpportunity({
                student: user.id,
                opportunity: internship._id,
                opportunityType: "Internship"
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

                <InternshipForm
                    initialValues={internship}
                    onSubmit={handleUpdate}
                    submitLabel="Save Changes"
                    onCancel={() => setIsEditing(false)}
                />

            </div>

        );

    }

    return (

        <div className="post-card">

            <h3>{internship.title}</h3>

            {
                isClosingSoon && (
                    <span className="badge-warning">⏰ Closing Soon</span>
                )
            }

            <p><b>{internship.company}</b> — {internship.location}</p>

            <p>{internship.description}</p>

            <p>Work Type: {internship.workType}</p>

            <p>Stipend: {internship.stipend ? internship.stipend : "Unpaid"}</p>

            <p>Duration: {internship.duration}</p>

            <p>Deadline: {new Date(internship.deadline).toLocaleDateString()}</p>

            {
                internship.skills?.length > 0 && (
                    <p>Skills: {internship.skills.join(", ")}</p>
                )
            }

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

export default InternshipCard;