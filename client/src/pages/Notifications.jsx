import { useEffect, useMemo, useState } from "react";
import {
    getNotifications,
    getUnreadNotificationCount,
    markAllNotificationsRead,
    markNotificationRead
} from "../services/notificationService";
import "../styles/notifications.css";

function Notifications() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    const parseOpportunityNameFromTitle = (title) => {
        if (!title) return null;
        const match = title.match(/Your application for (.+?) is/i);
        return match?.[1] || null;
    };

    const parseSenderNameFromTitle = (title) => {
        if (!title) return null;
        const match = title.match(/Unread message from (.+)/i);
        return match?.[1] || null;
    };

    const getNotificationTitle = (item) => {
        if (item.displayTitle) {
            return item.displayTitle;
        }

        if (item.type === "message") {
            const senderName = item.senderName || item.fromUser?.companyName || item.fromUser?.universityName || item.fromUser?.name || parseSenderNameFromTitle(item.title);
            if (senderName) {
                return `Unread message from ${senderName}`;
            }

            return item.title || "New message";
        }

        if (item.type === "application") {
            const opportunityName = item.opportunityName || parseOpportunityNameFromTitle(item.title) || item.relatedApplication?.opportunityName || item.relatedApplication?.opportunity?.title || item.relatedApplication?.opportunity?.name;
            const status = item.title?.toLowerCase().includes("accepted")
                ? "accepted"
                : item.title?.toLowerCase().includes("rejected")
                    ? "rejected"
                    : item.read ? "updated" : "pending";

            if (opportunityName) {
                return `Your application for ${opportunityName} is ${status}`;
            }

            return item.title || "Application update";
        }

        return item.title || "Notification";
    };

    const loadNotifications = async () => {
        if (!user?.id) return;

        setLoading(true);

        try {
            const [notificationsRes, unreadRes] = await Promise.all([
                getNotifications(user.id),
                getUnreadNotificationCount(user.id)
            ]);

            setNotifications(notificationsRes.data || []);
            setUnreadCount(unreadRes.data?.count || 0);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, [user?.id]);

    const filteredNotifications = useMemo(() => {
        return notifications.filter((item) => {
            if (filter === "all") return true;
            return item.type === filter;
        });
    }, [filter, notifications]);

    const handleMarkRead = async (id) => {
        try {
            await markNotificationRead(id);
            await loadNotifications();
            window.dispatchEvent(new Event("dashboard-counters-updated"));
        }
        catch (error) {
            console.log(error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead(user.id);
            await loadNotifications();
            window.dispatchEvent(new Event("dashboard-counters-updated"));
        }
        catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="notifications-page">
            <div className="notifications-header">
                <div>
                    <h1>Notifications & Circulars</h1>
                    <p>Track message alerts, application updates, and official announcements.</p>
                </div>
                <div className="notifications-header-actions">
                    <div className="notifications-badge">{unreadCount} unread</div>
                    <button className="notifications-mark-all" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
                        Mark all read
                    </button>
                </div>
            </div>

            <div className="notifications-toolbar">
                <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All</button>
                <button className={filter === "message" ? "active" : ""} onClick={() => setFilter("message")}>Messages</button>
                <button className={filter === "application" ? "active" : ""} onClick={() => setFilter("application")}>Applications</button>
            </div>

            <div className="notifications-list">
                {loading ? (
                    <p className="notifications-empty">Loading notifications...</p>
                ) : filteredNotifications.length === 0 ? (
                    <p className="notifications-empty">No notifications yet.</p>
                ) : (
                    filteredNotifications.map((item) => (
                        <button
                            key={item._id}
                            type="button"
                            className={item.read ? "notification-card" : "notification-card unread"}
                            onClick={() => handleMarkRead(item._id)}
                        >
                            <div className="notification-icon">
                                {item.type === "message" ? "💬" : "📌"}
                            </div>
                            <div className="notification-content">
                                <div className="notification-top">
                                    <strong>{getNotificationTitle(item)}</strong>
                                    <span>{new Date(item.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="notification-detail">
                                    {item.displayMessage || item.message || (item.type === "message"
                                        ? (item.fromUser?.companyName || item.fromUser?.universityName || item.fromUser?.name || "New message")
                                        : (item.opportunityName || parseOpportunityNameFromTitle(item.title) || item.relatedApplication?.opportunityName || item.relatedApplication?.opportunity?.title || item.relatedApplication?.opportunity?.name || "Application update"))}
                                </div>
                                <div className="notification-meta">
                                    <span className="notification-type">{item.type === "message" ? "Unread message" : "Application update"}</span>
                                    {!item.read ? <span className="notification-unread-dot">Unread</span> : null}
                                </div>
                            </div>
                        </button>
                    ))
                )}
            </div>

            <div className="notifications-footer">
                <p>Welcome back, {user?.name || "User"}.</p>
            </div>
        </div>
    );
}

export default Notifications;
