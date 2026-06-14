import { useState } from "react";
import { apicall } from "../lib";
import "./Login.css";

export default function Register({ onBack }) {
  const [form, setForm] = useState({
    fullname: "",
    phone: "",
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMsg("");

    try {
      const res = await apicall(
        "/authservice/signup",
        "POST",
        form
      );

      if (res.code === 200) {
        alert("Registration successful! Please login.");
        onBack();
      } else {
        setMsg(res.message || "Registration failed");
      }
    } catch {
      setMsg("Cannot connect to server");
    }

    setLoading(false);
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">📅</div>
          <h1>Resource Booking System</h1>
          <p>Create a new account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter full name"
              value={form.fullname}
              onChange={(e) =>
                setForm({ ...form, fullname: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />
          </div>

          {msg && <div className="error-msg">{msg}</div>}

          <button
            type="submit"
            disabled={loading}
            className="login-btn"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="login-footer">
          <button
            type="button"
            className="login-btn"
            onClick={onBack}
            style={{ marginTop: "10px" }}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}