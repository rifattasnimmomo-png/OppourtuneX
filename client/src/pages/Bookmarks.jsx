import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyBookmarks, removeBookmark } from "../services/bookmarkService";
import { getInternships } from "../services/internshipService";
import { getScholarships } from "../services/scholarshipService";
import { getMyApplications } from "../services/applicationService";
import InternshipCard from "../components/InternshipCard";
import ScholarshipCard from "../components/ScholarshipCard";
import "../styles/filters.css";
import "../styles/dashboard-applications.css";

function Bookmarks() {

    const user = JSON.parse(localStorage.getItem("user"));

    const [bookmarks, setBookmarks] = useState([]);
    const [internships, setInternships] = useState([]);
    const [scholarships, setScholarships] = useState([]);
    const [myApplications, setMyApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [sortBy, setSortBy] = useState("recent");

    useEffect(() => {
        loadBookmarks();
    }, []);

    const loadBookmarks = async () => {

        setLoading(true);

        try {

            const requests = [
                getMyBookmarks(user.id),
                getInternships(),
                getScholarships()
            ];

            if (user.role === "student") {
                requests.push(getMyApplications(user.id));
            }

            const results = await Promise.all(requests);

            setBookmarks(results[0].data);
            setInternships(results[1].data);
            setScholarships(results[2].data);

            if (user.role === "student") {
                setMyApplications(results[3].data);
            }

        }

        catch (err) {

            console.log(err);

        }

        setLoading(false);

    };

    const handleClearAll = async () => {

        if (!window.confirm("Remove all bookmarks? This cannot be undone.")) return;

        try {

            await Promise.all(bookmarks.map((b) => removeBookmark(b._id)));

            loadBookmarks();

        }

        catch (err) {

            console.log(err);

        }

    };

    const bookmarkedInternships = bookmarks
        .filter((b) => b.opportunityType === "Internship")
        .map((b) => {

            const opportunity = internships.find((i) => i._id === b.opportunity);

            return opportunity ? { ...opportunity, _bookmarkCreatedAt: b.createdAt } : null;

        })
        .filter(Boolean);

    const bookmarkedScholarships = bookmarks
        .filter((b) => b.opportunityType === "Scholarship")
        .map((b) => {

            const opportunity = scholarships.find((s) => s._id === b.opportunity);

            return opportunity ? { ...opportunity, _bookmarkCreatedAt: b.createdAt } : null;

        })
        .filter(Boolean);

    const keyword = searchKeyword.toLowerCase();

    const filteredInternships = bookmarkedInternships.filter((i) =>
        i.title.toLowerCase().includes(keyword) ||
        i.company.toLowerCase().includes(keyword)
    );

    const filteredScholarships = bookmarkedScholarships.filter((s) =>
        s.title.toLowerCase().includes(keyword) ||
        s.university.toLowerCase().includes(keyword)
    );

    const sortFn = (a, b) => {

        if (sortBy === "deadline") {
            return new Date(a.deadline) - new Date(b.deadline);
        }

        return new Date(b._bookmarkCreatedAt) - new Date(a._bookmarkCreatedAt);

    };

    const sortedInternships = [...filteredInternships].sort(sortFn);
    const sortedScholarships = [...filteredScholarships].sort(sortFn);

    return (

        <div>

            <h1>Bookmarks</h1>

            {
                loading ?
                (
                    <p>Loading your bookmarks...</p>
                )
                :
                (
                    bookmarks.length === 0 ?
                    (
                        <div className="empty-state">

                            <p>You haven't bookmarked anything yet.</p>

                            <p>
                                <Link to="/internships">Browse Internships</Link>
                                {" "}or{" "}
                                <Link to="/scholarships">Browse Scholarships</Link>
                            </p>

                        </div>
                    )
                    :
                    (
                        <div>

                            <p className="bookmark-summary">
                                {bookmarkedInternships.length} Internship{bookmarkedInternships.length !== 1 ? "s" : ""}
                                {" "}·{" "}
                                {bookmarkedScholarships.length} Scholarship{bookmarkedScholarships.length !== 1 ? "s" : ""}
                                {" "}bookmarked
                            </p>

                            <div className="filter-bar">

                                <input
                                    type="text"
                                    placeholder="Search your bookmarks..."
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                />

                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <option value="recent">Recently Bookmarked</option>
                                    <option value="deadline">Deadline Soonest</option>
                                </select>

                                <button className="btn-danger" onClick={handleClearAll}>
                                    Clear All Bookmarks
                                </button>

                            </div>

                            <h2 className="section-header">
                                <span className="accent-bar"></span>
                                Internships
                                <span className="section-count">{sortedInternships.length}</span>
                            </h2>

                            {
                                bookmarkedInternships.length === 0 ?
                                (
                                    <p>No bookmarked internships yet.</p>
                                )
                                :
                                sortedInternships.length === 0 ?
                                (
                                    <p>No internships match your search.</p>
                                )
                                :
                                (
                                    sortedInternships.map((internship) => (
                                        <InternshipCard
                                            key={internship._id}
                                            internship={internship}
                                            refresh={loadBookmarks}
                                            myApplication={myApplications.find((a) => a.opportunity === internship._id)}
                                            myBookmark={bookmarks.find((b) => b.opportunity === internship._id)}
                                        />
                                    ))
                                )
                            }

                            <h2 className="section-header">
                                <span className="accent-bar"></span>
                                Scholarships
                                <span className="section-count">{sortedScholarships.length}</span>
                            </h2>

                            {
                                bookmarkedScholarships.length === 0 ?
                                (
                                    <p>No bookmarked scholarships yet.</p>
                                )
                                :
                                sortedScholarships.length === 0 ?
                                (
                                    <p>No scholarships match your search.</p>
                                )
                                :
                                (
                                    sortedScholarships.map((scholarship) => (
                                        <ScholarshipCard
                                            key={scholarship._id}
                                            scholarship={scholarship}
                                            refresh={loadBookmarks}
                                            myApplication={myApplications.find((a) => a.opportunity === scholarship._id)}
                                            myBookmark={bookmarks.find((b) => b.opportunity === scholarship._id)}
                                        />
                                    ))
                                )
                            }

                        </div>
                    )
                )
            }

        </div>

    );

}

export default Bookmarks;