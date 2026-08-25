import { useEffect, useState } from "react";

import { Link, useLocation } from "react-router-dom";

import { getMyBookmarks } from "../services/bookmarkService";
import { getUnreadMessageCount } from "../services/messageService";
import { getUnreadNotificationCount } from "../services/notificationService";

import "../styles/sidebar.css";

function Sidebar() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const location = useLocation();

    const [bookmarkCount, setBookmarkCount] = useState(0);
    const [messageCount, setMessageCount] = useState(0);
    const [notificationCount, setNotificationCount] = useState(0);

    useEffect(() => {
        loadBookmarkCount();
        loadMessageCount();
        loadNotificationCount();

        const handleCounterRefresh = () => {
            loadMessageCount();
            loadNotificationCount();
        };

        window.addEventListener(
            "dashboard-counters-updated",
            handleCounterRefresh
        );

        const intervalId = window.setInterval(() => {
            loadMessageCount();
            loadNotificationCount();
        }, 5000);

        return () => {
            window.removeEventListener(
                "dashboard-counters-updated",
                handleCounterRefresh
            );

            window.clearInterval(intervalId);
        };
    }, [location.pathname]);

    const loadBookmarkCount = async () => {
        if (!user?.id) return;

        try {
            const res = await getMyBookmarks(user.id);
            setBookmarkCount(res.data.length);
        } catch (err) {
            console.log(err);
        }
    };

    const loadMessageCount = async () => {
        if (!user?.id) return;

        try {
            const res = await getUnreadMessageCount(user.id);
            setMessageCount(res.data.count || 0);
        } catch (err) {
            console.log(err);
        }
    };

    const loadNotificationCount = async () => {
        if (!user?.id) return;

        try {
            const res = await getUnreadNotificationCount(user.id);
            setNotificationCount(res.data.count || 0);
        } catch (err) {
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
                <span className="sidebar-link-label">
                    Bookmarks
                </span>

                {bookmarkCount > 0 ? (
                    <span className="sidebar-count">
                        ({bookmarkCount})
                    </span>
                ) : null}
            </Link>

            <Link to="/messages">
                <span className="sidebar-link-label">
                    Messages
                </span>

                {messageCount > 0 ? (
                    <span className="sidebar-count">
                        ({messageCount})
                    </span>
                ) : null}
            </Link>

            <Link to="/calendar">
                Calendar
            </Link>

            <Link to="/matching-score">
                Matching Score
            </Link>

            <Link to="/resume-builder">
                Resume Builder
            </Link>

            <Link to="/notifications">
                <span className="sidebar-link-label">
                    Notifications
                </span>

                {notificationCount > 0 ? (
                    <span className="sidebar-count">
                        ({notificationCount})
                    </span>
                ) : null}
            </Link>

            <Link to="/profile">
                Profile
            </Link>
        </aside>
    );
}

export default Sidebar;