import { useState, useEffect } from "react";
import { apicall } from "../lib";
import "./Profile.css";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    apicall("/authservice/profile").then((res) => {
      if (res.code === 200) setProfile(res);
    });
  }, []);

  if (!profile) return <div className="prof-loading">Loading profile...</div>;

  return (
    <div className="prof-wrap">
      <div className="prof-card">
        <div className="prof-avatar">
          {profile.fullname?.charAt(0).toUpperCase()}
        </div>
        <h2>{profile.fullname}</h2>
        <p className="prof-role">{profile.role === 2 ? "Administrator" : "User"}</p>
        <div className="prof-details">
          <div className="prof-item">
            <span className="prof-label">📧 Email</span>
            <span className="prof-value">{profile.email}</span>
          </div>
          <div className="prof-item">
            <span className="prof-label">📱 Phone</span>
            <span className="prof-value">{profile.phone || "—"}</span>
          </div>
          <div className="prof-item">
            <span className="prof-label">🏷️ Role</span>
            <span className="prof-value">
              <span className={`role-badge role-${profile.role}`}>
                {profile.role === 2 ? "Admin" : "User"}
              </span>
            </span>
          </div>
          <div className="prof-item">
            <span className="prof-label">🔑 User ID</span>
            <span className="prof-value">#{profile.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
