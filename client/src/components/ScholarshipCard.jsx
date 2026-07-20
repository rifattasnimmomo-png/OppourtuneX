import { useState } from "react";
import "../styles/cards.css";
import ScholarshipForm from "./ScholarshipForm";
import { updateScholarship, deleteScholarship } from "../services/scholarshipService";

function ScholarshipCard({ scholarship, refresh }) {

    const user = JSON.parse(localStorage.getItem("user"));
    const isOwner = scholarship.createdBy === user.id;

    const [isEditing, setIsEditing] = useState(false);

    const daysLeft = Math.ceil((new Date(scholarship.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    const isClosingSoon = daysLeft >= 0 && daysLeft <= 7;

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

export default ScholarshipCard;