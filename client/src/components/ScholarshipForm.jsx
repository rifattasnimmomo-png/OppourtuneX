import { useState } from "react";
import "../styles/opportunity-form.css";

function ScholarshipForm({ initialValues, onSubmit, submitLabel, onCancel }) {

    const [formData, setFormData] = useState({
        title: initialValues?.title || "",
        university: initialValues?.university || "",
        description: initialValues?.description || "",
        amount: initialValues?.amount || "",
        deadline: initialValues?.deadline ? initialValues.deadline.slice(0, 10) : "",
        eligibility: initialValues?.eligibility || ""
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

            amount: Number(formData.amount) || 0

        });

    };

    return (

        <form className="opportunity-form" onSubmit={handleSubmit}>

            <input
                type="text"
                name="title"
                placeholder="Scholarship Title"
                value={formData.title}
                onChange={handleChange}
                required
            />

            <input
                type="text"
                name="university"
                placeholder="University Name"
                value={formData.university}
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
                type="number"
                name="amount"
                placeholder="Amount"
                value={formData.amount}
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
                name="eligibility"
                placeholder="Eligibility criteria"
                value={formData.eligibility}
                onChange={handleChange}
                required
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

export default ScholarshipForm;