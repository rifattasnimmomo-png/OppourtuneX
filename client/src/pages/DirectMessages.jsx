import { useEffect, useMemo, useState } from "react";
import {
    deleteMessage,
    getContacts,
    getConversation,
    markConversationRead,
    sendMessage
} from "../services/messageService";
import { searchUsers } from "../services/userService";
import "../styles/direct-messages.css";

function DirectMessages() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [activeContact, setActiveContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [draft, setDraft] = useState("");
    const [loadingContacts, setLoadingContacts] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);
    const [openMessageMenuId, setOpenMessageMenuId] = useState(null);

    const activeContactLabel = useMemo(() => {
        if (!activeContact) {
            return "Select a person, company, or university to start chatting.";
        }

        return activeContact.displayName || activeContact.companyName || activeContact.universityName || activeContact.name;
    }, [activeContact]);

    const getContactLabel = (contact) => {
        return contact?.displayName || contact?.companyName || contact?.universityName || contact?.name || contact?.email || "Unknown user";
    };

    const loadContacts = async () => {
        if (!user?.id) return;

        setLoadingContacts(true);

        try {
            const response = await getContacts(user.id);
            setContacts(response.data || []);

            setActiveContact((current) => {
                if (current) {
                    const updated = response.data.find((item) => String(item.user.id) === String(current.id));
                    return updated ? { ...current, ...updated.user } : current;
                }

                return null;
            });
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoadingContacts(false);
        }
    };

    const loadConversation = async (contact) => {
        if (!user?.id || !contact?.id) return;

        setLoadingMessages(true);

        try {
            const response = await getConversation(user.id, contact.id);
            setMessages(response.data || []);
            await markConversationRead({ userId: user.id, otherUserId: contact.id });
            await loadContacts();
            window.dispatchEvent(new Event("dashboard-counters-updated"));
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoadingMessages(false);
        }
    };

    const openConversation = async (contact) => {
        if (!contact?.id) return;

        setActiveContact(contact);
        setSearchTerm("");
        setSearchResults([]);
        await loadConversation(contact);
    };

    useEffect(() => {
        loadContacts();
    }, [user?.id]);

    useEffect(() => {
        const timer = window.setTimeout(async () => {
            if (!searchTerm.trim()) {
                setSearchResults([]);
                return;
            }

            try {
                const response = await searchUsers(searchTerm, user.id);
                setSearchResults(response.data || []);
            }
            catch (error) {
                console.log(error);
            }
        }, 250);

        return () => window.clearTimeout(timer);
    }, [searchTerm, user?.id]);

    useEffect(() => {
        if (activeContact?.id) {
            loadConversation(activeContact);
        }
    }, [activeContact?.id]);

    const handleSend = async () => {
        if (!draft.trim() || !activeContact?.id) return;

        setSending(true);

        try {
            await sendMessage({
                senderId: user.id,
                receiverId: activeContact.id,
                text: draft.trim()
            });

            setDraft("");
            await loadConversation(activeContact);
            await loadContacts();
            window.dispatchEvent(new Event("dashboard-counters-updated"));
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setSending(false);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        const confirmed = window.confirm("Delete this message for both sides?");

        if (!confirmed) {
            return;
        }

        try {
            closeMessageMenu();
            setMessages((currentMessages) => currentMessages.filter((message) => message._id !== messageId));

            await deleteMessage(messageId, user.id);

            await loadContacts();

            window.dispatchEvent(new Event("dashboard-counters-updated"));
        }
        catch (error) {
            console.log(error);
        }
    };

    const toggleMessageMenu = (messageId) => {
        setOpenMessageMenuId((current) => current === messageId ? null : messageId);
    };

    const closeMessageMenu = () => {
        setOpenMessageMenuId(null);
    };

    const visibleContacts = contacts.map((contact) => contact.user).filter(Boolean);

    return (
        <div className="messages-page">
            <div className="messages-header">
                <div>
                    <h1>Direct Messages</h1>
                    <p>Search any student, company, university, or admin and chat directly.</p>
                </div>
                <div className="messages-status">Real-time chat</div>
            </div>

            <div className="messages-layout">
                <aside className="messages-sidebar">
                    <div className="message-search-box">
                        <label>Search profiles</label>
                        <input
                            type="text"
                            placeholder="Search by name, company, university, or role"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {searchTerm.trim() ? (
                        <div className="messages-search-results">
                            <strong>Search Results</strong>
                            <div className="messages-contact-list">
                                {searchResults.length === 0 ? (
                                    <p className="messages-empty">No profiles found.</p>
                                ) : (
                                    searchResults.map((profile) => (
                                        <button
                                            key={profile.id}
                                            className={activeContact?.id === profile.id ? "contact-item active" : "contact-item"}
                                            onClick={() => openConversation(profile)}
                                        >
                                            <strong>{getContactLabel(profile)}</strong>
                                            <span>{profile.role}</span>
                                            <small>{profile.subtitle || profile.email}</small>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : null}

                    <div className="messages-search-results">
                        <strong>Recent Chats</strong>
                        <div className="messages-contact-list">
                            {loadingContacts ? (
                                <p className="messages-empty">Loading chats...</p>
                            ) : visibleContacts.length === 0 ? (
                                <p className="messages-empty">No conversations yet. Search for someone to start chatting.</p>
                            ) : (
                                visibleContacts.map((contact) => (
                                    <button
                                        key={contact.id}
                                        className={activeContact?.id === contact.id ? "contact-item active" : "contact-item"}
                                        onClick={() => openConversation(contact)}
                                    >
                                        <strong>{getContactLabel(contact)}</strong>
                                        <span>{contact.role}</span>
                                        <small>{contacts.find((item) => String(item.user.id) === String(contact.id))?.lastMessage || "No recent message"}</small>
                                        {contacts.find((item) => String(item.user.id) === String(contact.id))?.unreadCount > 0 ? (
                                            <span className="contact-unread">Unread: {contacts.find((item) => String(item.user.id) === String(contact.id)).unreadCount}</span>
                                        ) : null}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </aside>

                <section className="messages-thread">
                    <div className="thread-top">
                        <div>
                            <h2>{activeContactLabel}</h2>
                            <p>{activeContact?.role || "Search a profile to start a conversation."}</p>
                        </div>
                    </div>

                    <div className="thread-messages">
                        {loadingMessages ? (
                            <p className="messages-empty">Loading conversation...</p>
                        ) : messages.length === 0 ? (
                            <p className="messages-empty">No messages yet. Send the first message.</p>
                        ) : (
                            messages.map((message) => {
                                const isMine = String(message.sender?._id || message.sender) === String(user.id);
                                const senderLabel = message.sender?.companyName || message.sender?.universityName || message.sender?.name || (isMine ? "You" : "Unknown");

                                return (
                                    <div key={message._id} className={isMine ? "bubble bubble-me" : "bubble bubble-them"}>
                                        <div className="bubble-meta">
                                            <strong>{senderLabel}</strong>
                                            <div className="bubble-actions">
                                                <span>{new Date(message.createdAt).toLocaleString()}</span>
                                                {isMine ? (
                                                    <div className="bubble-menu-wrap">
                                                        <button
                                                            type="button"
                                                            className="bubble-menu-btn"
                                                            onClick={() => toggleMessageMenu(message._id)}
                                                            aria-label="Message options"
                                                        >
                                                            ⋮
                                                        </button>
                                                        {openMessageMenuId === message._id ? (
                                                            <div className="bubble-menu">
                                                                <button
                                                                    type="button"
                                                                    className="bubble-menu-item"
                                                                    onClick={() => {
                                                                        closeMessageMenu();
                                                                        handleDeleteMessage(message._id);
                                                                    }}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <p>{message.text}</p>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="thread-compose">
                        <textarea
                            rows="3"
                            placeholder={activeContact ? `Message ${activeContactLabel}...` : "Select a contact first"}
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            disabled={!activeContact}
                        />
                        <button onClick={handleSend} disabled={!activeContact || !draft.trim() || sending}>
                            {sending ? "Sending..." : "Send Message"}
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default DirectMessages;
