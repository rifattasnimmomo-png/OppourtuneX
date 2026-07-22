import { useState, useEffect } from "react";
import "../styles/cards.css";
import InternshipForm from "./InternshipForm";
import { updateInternship, deleteInternship } from "../services/internshipService";
import { applyForOpportunity, getApplicationsForOpportunity, updateApplicationStatus, withdrawApplication } from "../services/applicationService";
import { addBookmark, removeBookmark, updateBookmarkNote } from "../services/bookmarkService";

function InternshipCard({ internship, refresh, myApplication, myBookmark }) {

    const user = JSON.parse(localStorage.getItem("user"));
    const isOwner = internship.createdBy === user.id;
    const isBookmarked = !!myBookmark;

    const [isEditing, setIsEditing] = useState(false);
    const [showApplicants, setShowApplicants] = useState(false);
    const [applicants, setApplicants] = useState([]);
    const [isApplying, setIsApplying] = useState(false);
    const [isEditingNote, setIsEditingNote] = useState(false);
    const [draftNote, setDraftNote] = useState("");

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

    const handleToggleBookmark = async () => {

        try {

            if (myBookmark) {

                await removeBookmark(myBookmark._id);

            }

            else {

                await addBookmark({
                    user: user.id,
                    opportunity: internship._id,
                    opportunityType: "Internship"
                });

            }

            refresh();

        }

        catch (err) {

            console.log(err);

        }

    };

    const handleSaveNote = async () => {

        try {

            await updateBookmarkNote(myBookmark._id, draftNote);

            setIsEditingNote(false);

            refresh();

        }

        catch (err) {

            console.log(err);

        }

    };

    const formatRelativeDays = (dateString) => {

        const days = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));

        if (days === 0) return "today";
        if (days === 1) return "1 day ago";

        return `${days} days ago`;

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

            <button
                className={isBookmarked ? "bookmark-btn active" : "bookmark-btn"}
                onClick={handleToggleBookmark}
            >
                {isBookmarked ? "★ Bookmarked" : "☆ Bookmark"}
            </button>

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
                                    <span className="badge-danger">Rejected</span>{" "}
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
                                                            app.status === "rejected" ? "badge-danger" :
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

            {
                isBookmarked && (

                    <div className="bookmark-note">

                        <p className="bookmark-meta">
                            Bookmarked {formatRelativeDays(myBookmark.createdAt)}
                        </p>

                        {
                            isEditingNote ?
                            (
                                <div>

                                    <textarea
                                        rows="2"
                                        value={draftNote}
                                        onChange={(e) => setDraftNote(e.target.value)}
                                        placeholder="Add a note..."
                                    />

                                    <button onClick={handleSaveNote}>
                                        Save Note
                                    </button>

                                    <button onClick={() => setIsEditingNote(false)}>
                                        Cancel
                                    </button>

                                </div>
                            )
                            :
                            (
                                <p>
                                    {myBookmark.note ? `Note: ${myBookmark.note}` : "No note added"}{" "}
                                    <button
                                        onClick={() => {
                                            setDraftNote(myBookmark.note || "");
                                            setIsEditingNote(true);
                                        }}
                                    >
                                        {myBookmark.note ? "Edit Note" : "Add Note"}
                                    </button>
                                </p>
                            )
                        }

                    </div>

                )
            }

        </div>

    );

}

export default InternshipCard;