import { useState } from "react";
import { apicall } from "../lib";
import "./Login.css";

export default function Login({
  onLogin,
  onRegister
}) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await apicall("/authservice/signin", "POST", form);
      if (res.code === 200) {
    onLogin(res.jwt);
} else {
    console.error("Login Failed:", res.message);
    setError(res.message || "Login failed");
}
    } catch (err) {
    console.error("Server Error:", err);
    setError("Cannot connect to server");
}
    setLoading(false);
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">📅</div>
          <h1>Resource Booking System</h1>
          <p>Sign in to manage and book resources</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@gmail.com"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          {error && <div className="error-msg">{error}</div>}
          <button type="submit" disabled={loading} className="login-btn">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
       <div className="login-footer">
  <p>Default admin: admin@gmail.com / admin123</p>

  <button
    type="button"
    className="register-link-btn"
    onClick={onRegister}
  >
    Don't have an account? Register
  </button>
</div>
      </div>
    </div>
  );
}
