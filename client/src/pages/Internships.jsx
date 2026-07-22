import { useEffect, useState } from "react";
import { getInternships, createInternship } from "../services/internshipService";
import { getMyApplications } from "../services/applicationService";
import { getMyBookmarks } from "../services/bookmarkService";
import InternshipCard from "../components/InternshipCard";
import InternshipForm from "../components/InternshipForm";
import "../styles/filters.css";

function Internships() {

    const user = JSON.parse(localStorage.getItem("user"));

    const [internships, setInternships] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [sortBy, setSortBy] = useState("newest");
    const [myApplications, setMyApplications] = useState([]);
    const [myBookmarks, setMyBookmarks] = useState([]);

    const [filters, setFilters] = useState({
        keyword: "",
        location: "",
        workType: "",
        minStipend: "",
        maxStipend: "",
        deadlineBefore: ""
    });

    useEffect(() => {
        loadInternships();
        loadMyBookmarks();

        if (user.role === "student") {
            loadMyApplications();
        }
    }, []);

    const loadMyBookmarks = async () => {

        try {

            const res = await getMyBookmarks(user.id);

            setMyBookmarks(res.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    const loadMyApplications = async () => {

        try {

            const res = await getMyApplications(user.id);

            setMyApplications(res.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    const refreshAll = () => {

        loadInternships(filters);
        loadMyBookmarks();

        if (user.role === "student") {
            loadMyApplications();
        }

    };

    const loadInternships = async (params = filters) => {

        try {

            const res = await getInternships(params);

            setInternships(res.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        loadInternships(filters);
    };

    const handleReset = () => {

        const cleared = {
            keyword: "",
            location: "",
            workType: "",
            minStipend: "",
            maxStipend: "",
            deadlineBefore: ""
        };

        setFilters(cleared);

        loadInternships(cleared);

    };

    const handleCreate = async (data) => {

        try {

            await createInternship({
                ...data,
                createdBy: user.id
            });

            setShowForm(false);

            loadInternships(filters);

        }

        catch (err) {

            console.log(err);

        }

    };

    const sortedInternships = [...internships].sort((a, b) => {

        if (sortBy === "deadline") {
            return new Date(a.deadline) - new Date(b.deadline);
        }

        return new Date(b.createdAt) - new Date(a.createdAt);

    });

    return (

        <div>

            <h1>Internships</h1>

            {
                user.role === "company" && (

                    <div className="post-card">

                        {
                            showForm ?
                            (
                                <InternshipForm
                                    onSubmit={handleCreate}
                                    submitLabel="Post Internship"
                                    onCancel={() => setShowForm(false)}
                                />
                            )
                            :
                            (
                                <button onClick={() => setShowForm(true)}>
                                    + Post New Internship
                                </button>
                            )
                        }

                    </div>

                )
            }

            <form className="filter-bar" onSubmit={handleSearch}>

                <input
                    type="text"
                    name="keyword"
                    placeholder="Search title, company, skills..."
                    value={filters.keyword}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={filters.location}
                    onChange={handleChange}
                />

                <select
                    name="workType"
                    value={filters.workType}
                    onChange={handleChange}
                >
                    <option value="">All Work Types</option>
                    <option value="Remote">Remote</option>
                    <option value="Onsite">Onsite</option>
                    <option value="Hybrid">Hybrid</option>
                </select>

                <input
                    type="number"
                    name="minStipend"
                    placeholder="Min Stipend"
                    value={filters.minStipend}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="maxStipend"
                    placeholder="Max Stipend"
                    value={filters.maxStipend}
                    onChange={handleChange}
                />

                <input
                    type="date"
                    name="deadlineBefore"
                    value={filters.deadlineBefore}
                    onChange={handleChange}
                />

                <button type="submit">
                    Search
                </button>

                <button type="button" onClick={handleReset}>
                    Reset
                </button>

            </form>

            <div className="results-bar">

                <span>{internships.length} internships found</span>

                <label>
                    Sort by:
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="newest">Newest First</option>
                        <option value="deadline">Deadline Soonest</option>
                    </select>
                </label>

            </div>

            {
                sortedInternships.length === 0 ?
                (
                    <p>No internships found.</p>
                )
                :
                (
                    sortedInternships.map((internship) => (
                        <InternshipCard
                            key={internship._id}
                            internship={internship}
                            refresh={refreshAll}
                            myApplication={myApplications.find((a) => a.opportunity === internship._id)}
                            myBookmark={myBookmarks.find((b) => b.opportunity === internship._id)}
                        />
                    ))
                )
            }

        </div>

    );

}

export default Internships;