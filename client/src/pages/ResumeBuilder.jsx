import { useEffect, useMemo, useState } from "react";
import "../styles/resume-builder.css";

const STORAGE_KEY = "opportunex-resume";

function splitList(value) {
    return String(value || "")
        .split(/\n|,/)
        .map((item) => item.trim())
        .filter(Boolean);
}

function buildDefaultResume(user) {
    return {
        fullName: user?.name || "Your Name",
        title: "Aspiring Student Professional",
        email: user?.email || "",
        phone: "",
        location: "",
        summary: "Motivated student looking for internships, scholarships, and professional opportunities.",
        education: "Bachelor of Science in Computer Science\nOppourtuneX University • 2022 - 2026",
        experience: "Internship - Project Assistant\nSupported team tasks and documentation.",
        skillsText: "React, JavaScript, Node.js, MongoDB",
        projectsText: "Campus Connect Portal\nBuilt a student support platform with opportunities and notifications."
    };
}

function ResumeBuilder() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [resume, setResume] = useState(buildDefaultResume(user));
    const [saved, setSaved] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
            if (stored) {
                setResume((current) => ({ ...current, ...stored }));
            }
        }
        catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
    }, [resume]);

    const previewSkills = useMemo(() => splitList(resume.skillsText), [resume.skillsText]);
    const previewEducation = useMemo(() => splitList(resume.education), [resume.education]);
    const previewExperience = useMemo(() => splitList(resume.experience), [resume.experience]);
    const previewProjects = useMemo(() => splitList(resume.projectsText), [resume.projectsText]);

    const downloadResume = () => {
        const lines = [
            resume.fullName,
            resume.title,
            `Email: ${resume.email}`,
            `Phone: ${resume.phone}`,
            `Location: ${resume.location}`,
            "",
            "Summary",
            resume.summary,
            "",
            "Education",
            resume.education,
            "",
            "Experience",
            resume.experience,
            "",
            "Skills",
            resume.skillsText,
            "",
            "Projects",
            resume.projectsText
        ];

        const blob = new Blob([lines.join("\n")], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${resume.fullName || "resume"}.txt`;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const handleSave = (event) => {
        event.preventDefault();
        setSaved(true);
        setIsEditing(false);
        window.setTimeout(() => setSaved(false), 1800);
    };

    const startEditing = () => {
        setIsEditing(true);
        setSaved(false);
    };

    const updateField = (field, value) => {
        setResume((current) => ({ ...current, [field]: value }));
    };

    return (
        <div className="resume-page">
            <div className="resume-header">
                <div>
                    <h1>Resume / CV Builder</h1>
                    <p>Create and update a professional resume inside the platform.</p>
                </div>
                <div className={saved ? "resume-saved active" : "resume-saved"}>
                    {saved ? "Saved" : "Auto-saved"}
                </div>
            </div>

            <div className="resume-layout">
                <form className="resume-form" onSubmit={handleSave}>
                    <div className="resume-form-header">
                        <h2>Edit Details</h2>
                        <div className="resume-mode-actions">
                            <button
                                type="button"
                                className={isEditing ? "resume-mode-btn active" : "resume-mode-btn"}
                                onClick={startEditing}
                            >
                                {isEditing ? "Editing" : "Edit Resume"}
                            </button>
                            <button
                                type="submit"
                                className={saved ? "resume-mode-btn save active" : "resume-mode-btn save"}
                                disabled={!isEditing}
                            >
                                {saved ? "Saved" : "Save Resume"}
                            </button>
                        </div>
                    </div>
                    <div className={isEditing ? "resume-lock-note editing" : "resume-lock-note"}>
                        {isEditing ? "Editing is enabled. Save when you are done." : "Click Edit Resume to unlock the form."}
                    </div>
                    <label className="resume-field">
                        <span>Full Name</span>
                        <input type="text" placeholder="Full Name" value={resume.fullName} onChange={(e) => updateField("fullName", e.target.value)} disabled={!isEditing} />
                    </label>
                    <label className="resume-field">
                        <span>Professional Title</span>
                        <input type="text" placeholder="Professional Title" value={resume.title} onChange={(e) => updateField("title", e.target.value)} disabled={!isEditing} />
                    </label>
                    <label className="resume-field">
                        <span>Email / Gmail</span>
                        <input type="email" placeholder="Email" value={resume.email} onChange={(e) => updateField("email", e.target.value)} disabled={!isEditing} />
                    </label>
                    <label className="resume-field">
                        <span>Phone Number</span>
                        <input type="text" placeholder="Phone" value={resume.phone} onChange={(e) => updateField("phone", e.target.value)} disabled={!isEditing} />
                    </label>
                    <label className="resume-field">
                        <span>Address / Location</span>
                        <input type="text" placeholder="Location" value={resume.location} onChange={(e) => updateField("location", e.target.value)} disabled={!isEditing} />
                    </label>
                    <label className="resume-field">
                        <span>Professional Summary</span>
                        <textarea rows="4" placeholder="Professional Summary" value={resume.summary} onChange={(e) => updateField("summary", e.target.value)} disabled={!isEditing} />
                    </label>
                    <label className="resume-field">
                        <span>Education</span>
                        <textarea rows="4" placeholder="Education" value={resume.education} onChange={(e) => updateField("education", e.target.value)} disabled={!isEditing} />
                    </label>
                    <label className="resume-field">
                        <span>Experience</span>
                        <textarea rows="4" placeholder="Experience" value={resume.experience} onChange={(e) => updateField("experience", e.target.value)} disabled={!isEditing} />
                    </label>
                    <label className="resume-field">
                        <span>Skills</span>
                        <textarea rows="4" placeholder="Skills (comma or line separated)" value={resume.skillsText} onChange={(e) => updateField("skillsText", e.target.value)} disabled={!isEditing} />
                    </label>
                    <label className="resume-field">
                        <span>Projects</span>
                        <textarea rows="4" placeholder="Projects (comma or line separated)" value={resume.projectsText} onChange={(e) => updateField("projectsText", e.target.value)} disabled={!isEditing} />
                    </label>
                    <div className="resume-actions">
                        <button type="button" onClick={downloadResume}>Download TXT</button>
                        <button type="button" onClick={() => window.print()}>Print</button>
                    </div>
                </form>

                <aside className="resume-preview">
                    <div className="resume-sheet">
                        <header>
                            <h2>{resume.fullName}</h2>
                            <p>{resume.title}</p>
                            <span>{resume.email} {resume.phone ? `• ${resume.phone}` : ""} {resume.location ? `• ${resume.location}` : ""}</span>
                        </header>

                        <section>
                            <h3>Summary</h3>
                            <p>{resume.summary}</p>
                        </section>

                        <section>
                            <h3>Education</h3>
                            {previewEducation.map((item, index) => (
                                <p key={`${item}-${index}`}>{item}</p>
                            ))}
                        </section>

                        <section>
                            <h3>Experience</h3>
                            {previewExperience.map((item, index) => (
                                <p key={`${item}-${index}`}>{item}</p>
                            ))}
                        </section>

                        <section>
                            <h3>Skills</h3>
                            <div className="resume-tags">
                                {previewSkills.map((skill) => <span key={skill}>{skill}</span>)}
                            </div>
                        </section>

                        <section>
                            <h3>Projects</h3>
                            {previewProjects.map((item, index) => (
                                <p key={`${item}-${index}`}>{item}</p>
                            ))}
                        </section>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default ResumeBuilder;
