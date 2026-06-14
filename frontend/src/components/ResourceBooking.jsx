import { useState, useEffect } from "react";
import { apicall } from "../lib";
import "./ResourceBooking.css";

const STATUS_LABELS = ["Pending", "Confirmed", "Cancelled"];
const STATUS_COLORS = ["#f59e0b", "#10b981", "#ef4444"];

export default function ResourceBooking() {
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [form, setForm] = useState({
    resourceId: "", resourceName: "", slotDate: "", startTime: "", endTime: "", purpose: ""
  });
  const [msg, setMsg] = useState("");
  const [tab, setTab] = useState("browse");
  const SIZE = 6;

  const loadResources = () => {
    apicall(`/resourceservice/getallresources/1/50`).then((res) => {
      if (res.code === 200) setResources(res.resources || []);
    });
  };

  const loadBookings = () => {
    apicall(`/bookingservice/getallbookings/${page}/${SIZE}`).then((res) => {
      if (res.code === 200) { setBookings(res.bookings || []); setTotal(res.total || 0); }
    });
  };

  useEffect(() => { loadResources(); loadBookings(); }, [page]);

  const handleSearch = async () => {
    if (!search.trim()) { loadResources(); return; }
    const res = await apicall(`/resourceservice/vectorsearch/${encodeURIComponent(search.trim())}`);
    if (res.code === 200) setResources(res.resources || []);
  };

  const openBooking = async (resource) => {
    setSelectedResource(resource);
    setForm({ ...form, resourceId: resource._id, resourceName: resource.name });
    setShowModal(true);
    setAvailability([]);
  };

  const checkAvailability = async () => {
    if (!form.slotDate) return;
    const res = await apicall(`/bookingservice/availability/${form.resourceId}/${form.slotDate}`);
    if (res.code === 200) setAvailability(res.bookings || []);
  };

  const handleBook = async (e) => {
    e.preventDefault();

    // Time validation
    if (form.startTime >= form.endTime) {
        setMsg("End time must be after start time");
        return;
    }

    const res = await apicall("/bookingservice/createbooking", "POST", form);

    setMsg(
        res.message ||
        (res.code === 200 ? "Booking successful!" : "Booking failed")
    );

    if (res.code === 200) {
        setShowModal(false);
        loadBookings();
        setTab("mybookings");
    }
};
const cancelBooking = async (id) => {
  if (!window.confirm("Cancel this booking?")) return;

  const res = await apicall(
    `/bookingservice/cancelbooking/${id}`,
    "DELETE"
  );

  console.log("Cancel response:", res);

  if (res.code === 200) {
    setMsg("Booking cancelled successfully");
    loadBookings();
  } else {
    setMsg(res.message || "Failed to cancel booking");
  }
};

  const confirmBooking = async (id) => {
    const res = await apicall(`/bookingservice/updatebooking/${id}`, "PUT", { status: 1 });
    if (res.code === 200) loadBookings();
  };

 

  const totalPages = Math.ceil(total / SIZE);

  return (
    <div className="rb-wrap">
      {msg && <div className="rb-msg">{msg} <button onClick={() => setMsg("")}>×</button></div>}

      <div className="rb-tabs">
        <button className={tab === "browse" ? "active" : ""} onClick={() => setTab("browse")}>🏢 Browse Resources</button>
        <button className={tab === "mybookings" ? "active" : ""} onClick={() => setTab("mybookings")}>📋 My Bookings</button>
      </div>

      {tab === "browse" && (
        <>
          <div className="rb-search-bar">
            <input
              placeholder='Search e.g. "Available meeting rooms with projector"'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button onClick={handleSearch}>🔍 Search</button>
            <button onClick={() => { setSearch(""); loadResources(); }} className="clear-btn">Clear</button>
          </div>
          <div className="rb-grid">
            {resources.map((r) => (
              <div key={r._id} className="rb-card">
                <div className="rb-card-header">
                  <span className="rb-category">{r.category}</span>
                  <span className={`rb-status ${r.status === 1 ? "available" : "unavailable"}`}>
                    {r.status === 1 ? "Available" : "Unavailable"}
                  </span>
                </div>
                <h3>{r.name}</h3>
                <p className="rb-desc">{r.description}</p>
                <div className="rb-meta">
                  <span>📍 {r.location}</span>
                  <span>👥 Capacity: {r.capacity}</span>
                </div>
                <div className="rb-amenities">{r.amenities}</div>
                <button className="rb-book-btn" onClick={() => openBooking(r)} disabled={r.status !== 1}>
                  📅 Book Now
                </button>
              </div>
            ))}
            {resources.length === 0 && <div className="rb-empty">No resources found</div>}
          </div>
        </>
      )}

      {tab === "mybookings" && (
        <>
          <table className="rb-table">
            <thead>
              <tr><th>Resource</th><th>Date</th><th>Time</th><th>Purpose</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.resourceName}</td>
                  <td>{b.slotDate}</td>
                  <td>{b.startTime} – {b.endTime}</td>
                  <td>{b.purpose || "—"}</td>
                  <td>
                    <span className="status-badge" style={{ background: STATUS_COLORS[b.status] + "22", color: STATUS_COLORS[b.status] }}>
                      {STATUS_LABELS[b.status]}
                    </span>
                  </td>
                 <td>
  <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
    {b.status !== 2 && (
      <button
        className="cancel-btn"
        onClick={() => cancelBooking(b._id)}
      >
        ❌ Cancel
      </button>
    )}
  </div>
</td>
                </tr>
              ))}
              {bookings.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "#999" }}>No bookings yet</td></tr>}
            </tbody>
          </table>
          <div className="rb-pagination">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>◀ Prev</button>
            <span>Page {page} of {totalPages || 1}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next ▶</button>
          </div>
        </>
      )}

      {showModal && (
        <div className="rb-modal-bg" onClick={() => setShowModal(false)}>
          <div className="rb-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rb-modal-header">
              <h3>📅 Book: {selectedResource?.name}</h3>
              <button onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleBook}>
              <div className="form-row">
                <label>Date</label>
                <input type="date" value={form.slotDate} min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setForm({ ...form, slotDate: e.target.value })}
                  onBlur={checkAvailability} required />
              </div>
              {availability.length > 0 && (
                <div className="availability-warning">
                  ⚠️ Already booked: {availability.map(b => `${b.startTime}–${b.endTime}`).join(", ")}
                </div>
              )}
              <div className="form-row two-col">
                <div>
                  <label>Start Time</label>
                  <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required />
                </div>
                <div>
                  <label>End Time</label>
                  <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} required />
                </div>
              </div>
              <div className="form-row">
                <label>Purpose</label>
                <textarea value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} rows={3} placeholder="Purpose of booking..." />
              </div>
              <div className="rb-modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
                <button type="submit" className="rb-book-btn">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
