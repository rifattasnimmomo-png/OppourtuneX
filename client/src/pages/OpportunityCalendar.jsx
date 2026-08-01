import { useEffect, useMemo, useState } from "react";
import "../styles/opportunity-calendar.css";

const STORAGE_KEY = "opportunex-calendar-events";

const DEFAULT_EVENTS = [
    { id: 1, title: "Internship Deadline", type: "Deadline", date: "2026-08-12", time: "11:59", notes: "Submit the software internship application." },
    { id: 2, title: "Scholarship Interview", type: "Interview", date: "2026-08-15", time: "14:30", notes: "Bring academic documents and portfolio." },
    { id: 3, title: "University Webinar", type: "Event", date: "2026-08-18", time: "16:00", notes: "Attend the virtual information session." }
];

const TYPE_STYLES = {
    Deadline: "deadline",
    Interview: "interview",
    Event: "event"
};

function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function OpportunityCalendar() {
    const today = new Date();
    const [monthOffset, setMonthOffset] = useState(0);
    const [events, setEvents] = useState(DEFAULT_EVENTS);
    const [form, setForm] = useState({
        title: "",
        type: "Deadline",
        date: formatDateKey(today),
        time: "09:00",
        notes: ""
    });

    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
            if (saved) {
                setEvents(saved);
            }
        }
        catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }, [events]);

    const visibleMonth = useMemo(() => {
        return new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    }, [monthOffset]);

    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const monthLabel = visibleMonth.toLocaleString("default", { month: "long", year: "numeric" });
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const visibleMonthKey = `${year}-${String(month + 1).padStart(2, "0")}`;

    const monthCells = [];
    for (let i = 0; i < firstDayIndex; i += 1) {
        monthCells.push(null);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
        monthCells.push(new Date(year, month, day));
    }

    const monthEvents = events
        .filter((event) => event.date.startsWith(visibleMonthKey))
        .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

    const upcomingEvents = [...events]
        .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
        .slice(0, 6);

    const addEvent = (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.date) return;

        const newEvent = {
            id: Date.now(),
            title: form.title.trim(),
            type: form.type,
            date: form.date,
            time: form.time,
            notes: form.notes.trim()
        };

        setEvents((current) => [...current, newEvent]);
        setForm({
            title: "",
            type: "Deadline",
            date: formatDateKey(today),
            time: "09:00",
            notes: ""
        });
    };

    return (
        <div className="calendar-page">
            <div className="calendar-header">
                <div>
                    <h1>Opportunity Calendar</h1>
                    <p>Track deadlines, interviews, and upcoming platform events in one calendar view.</p>
                </div>
                <div className="calendar-controls">
                    <button onClick={() => setMonthOffset((current) => current - 1)}>Prev</button>
                    <strong>{monthLabel}</strong>
                    <button onClick={() => setMonthOffset((current) => current + 1)}>Next</button>
                </div>
            </div>

            <div className="calendar-layout">
                <section className="calendar-board">
                    <div className="weekday-row">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                            <span key={day}>{day}</span>
                        ))}
                    </div>

                    <div className="day-grid">
                        {monthCells.map((dayDate, index) => {
                            if (!dayDate) {
                                return <div key={`empty-${index}`} className="day-cell empty" />;
                            }

                            const key = formatDateKey(dayDate);
                            const dayEvents = events.filter((event) => event.date === key);
                            const eventTypeClass = dayEvents.length > 0 ? dayEvents[0].type.toLowerCase() : "";

                            return (
                                <div key={key} className={`day-cell${dayEvents.length > 0 ? ` has-event ${eventTypeClass}` : ""}`}>
                                    <div className="day-number">{dayDate.getDate()}</div>
                                    <div className="day-events">
                                        {dayEvents.slice(0, 2).map((event) => (
                                            <span key={event.id} className={`event-pill ${TYPE_STYLES[event.type]}`}>{event.title}</span>
                                        ))}
                                        {dayEvents.length > 2 && <span className="event-pill more">+{dayEvents.length - 2} more</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <aside className="calendar-sidebar">
                    <form className="calendar-form" onSubmit={addEvent}>
                        <h2>Add Event</h2>
                        <input
                            type="text"
                            placeholder="Title"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                        <select
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                        >
                            <option value="Deadline">Deadline</option>
                            <option value="Interview">Interview</option>
                            <option value="Event">Event</option>
                        </select>
                        <input
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                        />
                        <input
                            type="time"
                            value={form.time}
                            onChange={(e) => setForm({ ...form, time: e.target.value })}
                        />
                        <textarea
                            rows="4"
                            placeholder="Notes"
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        />
                        <button type="submit">Save Event</button>
                    </form>

                    <div className="calendar-list">
                        <h2>Upcoming</h2>
                        {upcomingEvents.map((event) => (
                            <div key={event.id} className="calendar-item">
                                <div className={`calendar-dot ${TYPE_STYLES[event.type]}`} />
                                <div>
                                    <strong>{event.title}</strong>
                                    <p>{event.date} at {event.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="calendar-summary">
                        <h2>This Month</h2>
                        <p>{monthEvents.length} event{monthEvents.length === 1 ? "" : "s"} scheduled.</p>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default OpportunityCalendar;
