import { useState, useEffect } from "react";
import { apicall } from "../lib";
import "./UserManager.css";

const EMPTY = { fullname: "", phone: "", email: "", password: "", role: 1, status: 1 };

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const SIZE = 8;

  const load = () => {
    apicall(`/authservice/getallusers/${page}/${SIZE}`).then((res) => {
      if (res.code === 200) { setUsers(res.users || []); setTotal(res.total || 0); }
    });
  };

  useEffect(() => { load(); }, [page]);

  const handleSearch = async () => {
    if (!search.trim()) { load(); return; }
    const res = await apicall(`/authservice/searchuser/${search.trim()}`);
    if (res.code === 200) setUsers(res.users || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId ? `/authservice/updateuser/${editId}` : "/authservice/saveuser";
    const method = editId ? "PUT" : "POST";
    const res = await apicall(url, method, form);
    setMsg(res.message || (res.code === 200 ? "Saved!" : "Error"));
    if (res.code === 200) { setShowForm(false); setForm(EMPTY); setEditId(null); load(); }
  };

  const handleEdit = async (id) => {
    const res = await apicall(`/authservice/getuser/${id}`);
    if (res.code === 200) {
      const u = res.user;
      setForm({ fullname: u.fullname, phone: u.phone, email: u.email, password: "", role: u.role, status: u.status });
      setEditId(id);
      setShowForm(true);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    const res = await apicall(`/authservice/deleteuser/${id}`, "DELETE");
    if (res.code === 200) load();
  };

  const totalPages = Math.ceil(total / SIZE);

  return (
    <div className="um-wrap">
      {msg && <div className="um-msg">{msg} <button onClick={() => setMsg("")}>×</button></div>}

      <div className="um-toolbar">
        <div className="um-search">
          <input placeholder="Search by name or email..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
          <button onClick={handleSearch}>🔍</button>
          <button onClick={() => { setSearch(""); load(); }} className="clear-btn">Clear</button>
        </div>
        <button className="add-btn" onClick={() => { setForm(EMPTY); setEditId(null); setShowForm(true); }}>
          + Add User
        </button>
      </div>

      {showForm && (
        <div className="um-form-card">
          <h3>{editId ? "Edit User" : "Add New User"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="um-grid-2">
              <div className="form-group">
                <label>Full Name *</label>
                <input value={form.fullname} onChange={(e) => setForm({ ...form, fullname: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Password {editId ? "(leave blank to keep)" : "*"}</label>
                <input type="password" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required={!editId} />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: Number(e.target.value) })}>
                  <option value={1}>User</option>
                  <option value={2}>Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: Number(e.target.value) })}>
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>
            </div>
            <div className="um-form-actions">
              <button type="button" onClick={() => setShowForm(false)} className="cancel-btn">Cancel</button>
              <button type="submit" className="save-btn">💾 Save User</button>
            </div>
          </form>
        </div>
      )}

      <table className="um-table">
        <thead>
          <tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={u.id}>
              <td>{(page - 1) * SIZE + i + 1}</td>
              <td>{u.fullname}</td>
              <td>{u.email}</td>
              <td>{u.phone || "—"}</td>
              <td><span className={`role-badge role-${u.role}`}>{u.role === 2 ? "Admin" : "User"}</span></td>
              <td><span style={{ color: u.status === 1 ? "#2e7d32" : "#c62828", fontWeight: 600, fontSize: 12 }}>{u.status === 1 ? "Active" : "Inactive"}</span></td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(u.id)}>✏️ Edit</button>
                <button className="del-btn" onClick={() => handleDelete(u.id)}>🗑️</button>
              </td>
            </tr>
          ))}
          {users.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", color: "#999", padding: 32 }}>No users found</td></tr>}
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
