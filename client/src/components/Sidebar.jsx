import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getMyBookmarks } from "../services/bookmarkService";
import "../styles/sidebar.css";

function Sidebar() {

    const user = JSON.parse(localStorage.getItem("user"));
    const location = useLocation();

    const [bookmarkCount, setBookmarkCount] = useState(0);

    useEffect(() => {

        loadBookmarkCount();

    }, [location.pathname]);

    const loadBookmarkCount = async () => {

        try {

            const res = await getMyBookmarks(user.id);

            setBookmarkCount(res.data.length);

        }

        catch (err) {

            console.log(err);

        }

    };

    return (

        <aside className="sidebar">

            <Link to="/student-dashboard">
                Dashboard
            </Link>

            <Link to="/feed">
                Feed
            </Link>

            <Link to="/internships">
                Internships
            </Link>

            <Link to="/scholarships">
                Scholarships
            </Link>

            <Link to="/bookmarks">
                Bookmarks{bookmarkCount > 0 ? ` (${bookmarkCount})` : ""}
            </Link>

            <Link to="/profile">
                Profile
            </Link>

        </aside>

    );

}

export default Sidebar;