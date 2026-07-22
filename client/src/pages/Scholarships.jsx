import { useEffect, useState } from "react";
import { getScholarships, createScholarship } from "../services/scholarshipService";
import { getMyApplications } from "../services/applicationService";
import { getMyBookmarks } from "../services/bookmarkService";
import ScholarshipCard from "../components/ScholarshipCard";
import ScholarshipForm from "../components/ScholarshipForm";
import "../styles/filters.css";

function Scholarships() {

    const user = JSON.parse(localStorage.getItem("user"));

    const [scholarships, setScholarships] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [sortBy, setSortBy] = useState("newest");
    const [myApplications, setMyApplications] = useState([]);
    const [myBookmarks, setMyBookmarks] = useState([]);

    const [filters, setFilters] = useState({
        keyword: "",
        university: "",
        minAmount: "",
        maxAmount: "",
        deadlineBefore: ""
    });

    useEffect(() => {
        loadScholarships();
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

        loadScholarships(filters);
        loadMyBookmarks();

        if (user.role === "student") {
            loadMyApplications();
        }

    };

    const loadScholarships = async (params = filters) => {

        try {

            const res = await getScholarships(params);

            setScholarships(res.data);

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
        loadScholarships(filters);
    };

    const handleReset = () => {

        const cleared = {
            keyword: "",
            university: "",
            minAmount: "",
            maxAmount: "",
            deadlineBefore: ""
        };

        setFilters(cleared);

        loadScholarships(cleared);

    };

    const handleCreate = async (data) => {

        try {

            await createScholarship({
                ...data,
                createdBy: user.id
            });

            setShowForm(false);

            loadScholarships(filters);

        }

        catch (err) {

            console.log(err);

        }

    };

    const sortedScholarships = [...scholarships].sort((a, b) => {

        if (sortBy === "deadline") {
            return new Date(a.deadline) - new Date(b.deadline);
        }

        return new Date(b.createdAt) - new Date(a.createdAt);

    });

    return (

        <div>

            <h1>Scholarships</h1>

            {
                user.role === "university" && (

                    <div className="post-card">

                        {
                            showForm ?
                            (
                                <ScholarshipForm
                                    onSubmit={handleCreate}
                                    submitLabel="Post Scholarship"
                                    onCancel={() => setShowForm(false)}
                                />
                            )
                            :
                            (
                                <button onClick={() => setShowForm(true)}>
                                    + Post New Scholarship
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
                    placeholder="Search title, university, eligibility..."
                    value={filters.keyword}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="university"
                    placeholder="University"
                    value={filters.university}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="minAmount"
                    placeholder="Min Amount"
                    value={filters.minAmount}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="maxAmount"
                    placeholder="Max Amount"
                    value={filters.maxAmount}
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

                <span>{scholarships.length} scholarships found</span>

                <label>
                    Sort by:
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="newest">Newest First</option>
                        <option value="deadline">Deadline Soonest</option>
                    </select>
                </label>

            </div>

            {
                sortedScholarships.length === 0 ?
                (
                    <p>No scholarships found.</p>
                )
                :
                (
                    sortedScholarships.map((scholarship) => (
                        <ScholarshipCard
                            key={scholarship._id}
                            scholarship={scholarship}
                            refresh={refreshAll}
                            myApplication={myApplications.find((a) => a.opportunity === scholarship._id)}
                            myBookmark={myBookmarks.find((b) => b.opportunity === scholarship._id)}
                        />
                    ))
                )
            }

        </div>

    );

}

export default Scholarships;