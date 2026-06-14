import { useState, useEffect } from "react";
import { apicall } from "../lib";
import "./ResourceManager.css";

const EMPTY = { name: "", category: "Room", description: "", location: "", capacity: "", amenities: "", status: 1 };
const CATEGORIES = ["Room", "Lab", "Studio", "Hall", "Equipment", "Other"];

export default function ResourceManager() {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const SIZE = 8;

  const load = () => {
    apicall(`/resourceservice/getallresources/${page}/${SIZE}`).then((res) => {
      if (res.code === 200) { setResources(res.resources || []); setTotal(res.total || 0); }
    });
  };

  useEffect(() => { load(); }, [page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId ? `/resourceservice/updateresource/${editId}` : "/resourceservice/createresource";
    const method = editId ? "PUT" : "POST";
    const res = await apicall(url, method, { ...form, capacity: Number(form.capacity) });
    setMsg(res.message || (res.code === 200 ? "Saved!" : "Error"));
    if (res.code === 200) { setShowForm(false); setForm(EMPTY); setEditId(null); load(); }
  };

  const handleEdit = (r) => {
    setForm({ name: r.name, category: r.category, description: r.description || "", location: r.location || "", capacity: r.capacity || "", amenities: r.amenities || "", status: r.status });
    setEditId(r._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this resource?")) return;
    const res = await apicall(`/resourceservice/deleteresource/${id}`, "DELETE");
    if (res.code === 200) load();
  };

  const totalPages = Math.ceil(total / SIZE);

  return (
    <div className="rm-wrap">
      {msg && <div className="rm-msg">{msg} <button onClick={() => setMsg("")}>×</button></div>}

      <div className="rm-toolbar">
        <div className="rm-count">Total Resources: <strong>{total}</strong></div>
        <button className="add-btn" onClick={() => { setForm(EMPTY); setEditId(null); setShowForm(true); }}>
          + Add Resource
        </button>
      </div>

      {showForm && (
        <div className="rm-form-card">
          <h3>{editId ? "Edit Resource" : "Add New Resource"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="rm-grid-2">
              <div className="form-group">
                <label>Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Capacity</label>
                <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>
            <div className="form-group">
              <label>Amenities (comma-separated)</label>
              <input value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} placeholder="Projector, Whiteboard, AC" />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: Number(e.target.value) })}>
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>
            <div className="rm-form-actions">
              <button type="button" onClick={() => setShowForm(false)} className="cancel-btn">Cancel</button>
              <button type="submit" className="save-btn">💾 Save Resource</button>
            </div>
          </form>
        </div>
      )}

      <table className="rm-table">
        <thead>
          <tr><th>Name</th><th>Category</th><th>Location</th><th>Capacity</th><th>Amenities</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {resources.map((r) => (
            <tr key={r._id}>
              <td><strong>{r.name}</strong><br /><small style={{ color: "#888" }}>{r.description}</small></td>
              <td><span className="cat-badge">{r.category}</span></td>
              <td>{r.location || "—"}</td>
              <td>{r.capacity || "—"}</td>
              <td style={{ fontSize: "12px", color: "#666" }}>{r.amenities || "—"}</td>
              <td>
                <span style={{ color: r.status === 1 ? "#2e7d32" : "#c62828", fontWeight: 600, fontSize: 12 }}>
                  {r.status === 1 ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(r)}>✏️</button>
                <button className="del-btn" onClick={() => handleDelete(r._id)}>🗑️</button>
              </td>
            </tr>
          ))}
          {resources.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", color: "#999", padding: 32 }}>No resources</td></tr>}
        </tbody>
      </table>

      <div className="rb-pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>◀ Prev</button>
        <span>Page {page} of {totalPages || 1}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next ▶</button>
      </div>
    </div>
  );
}
