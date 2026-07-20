import { useState } from "react";
import "../styles/opportunity-form.css";

function InternshipForm({ initialValues, onSubmit, submitLabel, onCancel }) {

    const [formData, setFormData] = useState({
        title: initialValues?.title || "",
        company: initialValues?.company || "",
        description: initialValues?.description || "",
        location: initialValues?.location || "",
        workType: initialValues?.workType || "Onsite",
        stipend: initialValues?.stipend || "",
        duration: initialValues?.duration || "",
        deadline: initialValues?.deadline ? initialValues.deadline.slice(0, 10) : "",
        skills: initialValues?.skills ? initialValues.skills.join(", ") : ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSubmit({

            ...formData,

            stipend: Number(formData.stipend) || 0,

            skills: formData.skills
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s)

        });

    };

    return (

        <form className="opportunity-form" onSubmit={handleSubmit}>

            <input
                type="text"
                name="title"
                placeholder="Internship Title"
                value={formData.title}
                onChange={handleChange}
                required
            />

            <input
                type="text"
                name="company"
                placeholder="Company Name"
                value={formData.company}
                onChange={handleChange}
                required
            />

            <textarea
                rows="3"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
            />

            <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                required
            />

            <select
                name="workType"
                value={formData.workType}
                onChange={handleChange}
            >
                <option value="Onsite">Onsite</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
            </select>

            <input
                type="number"
                name="stipend"
                placeholder="Stipend (0 if unpaid)"
                value={formData.stipend}
                onChange={handleChange}
            />

            <input
                type="text"
                name="duration"
                placeholder="Duration (e.g. 3 months)"
                value={formData.duration}
                onChange={handleChange}
                required
            />

            <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
            />

            <input
                type="text"
                name="skills"
                placeholder="Skills (comma separated)"
                value={formData.skills}
                onChange={handleChange}
            />

            <div>

                <button type="submit">
                    {submitLabel}
                </button>

                {
                    onCancel && (
                        <button type="button" onClick={onCancel}>
                            Cancel
                        </button>
                    )
                }

            </div>

        </form>

    );

}

export default InternshipForm;