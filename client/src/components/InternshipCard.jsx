import { useState } from "react";
import "../styles/cards.css";
import InternshipForm from "./InternshipForm";
import { updateInternship, deleteInternship } from "../services/internshipService";

function InternshipCard({ internship, refresh }) {

    const user = JSON.parse(localStorage.getItem("user"));
    const isOwner = internship.createdBy === user.id;

    const [isEditing, setIsEditing] = useState(false);

    const daysLeft = Math.ceil((new Date(internship.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    const isClosingSoon = daysLeft >= 0 && daysLeft <= 7;

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
                isOwner && (

                    <div>

                        <button onClick={() => setIsEditing(true)}>
                            Edit
                        </button>

                        <button onClick={handleDelete}>
                            Delete
                        </button>

                    </div>

                )
            }

        </div>

    );

}

export default InternshipCard;