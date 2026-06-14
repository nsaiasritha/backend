import { useState, useEffect } from "react";
import { apicall } from "../lib";
import ResourceManager from "./ResourceManager";
import ResourceBooking from "./ResourceBooking";
import UserManager from "./UserManager";
import Profile from "./Profile";
import "./Home.css";

const MENU_COMPONENTS = {
  3: ResourceBooking,
  4: UserManager,
  5: Profile,
  6: ResourceManager,
};

const MENU_ICONS = { 3: "📅", 4: "👥", 5: "👤", 6: "🏢" };

export default function Home({ onLogout }) {
  const [userInfo, setUserInfo] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    apicall("/authservice/uinfo").then((res) => {

      console.log("UINFO RESPONSE:", res);

      if (res.code === 200) {
        setUserInfo(res);

        if (res.menulist?.length > 0) {
          setActiveMenu(res.menulist[0].mid);
        }
      }
    });
  }, []);

  const ActiveComponent = activeMenu ? MENU_COMPONENTS[activeMenu] : null;

  return (
    <div className="home-layout">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">📅</div>
          <div className="sidebar-title">Resource Booking</div>
        </div>
        <nav className="sidebar-nav">
          {userInfo?.menulist?.map((m) => (
            <button
              key={m.mid}
              className={`nav-item ${activeMenu === m.mid ? "active" : ""}`}
              onClick={() => setActiveMenu(m.mid)}
            >
              <span className="nav-icon">{MENU_ICONS[m.mid] || "📌"}</span>
              <span>{m.menu}</span>
            </button>
          ))}
        </nav>
        <button className="logout-btn" onClick={onLogout}>
          🚪 Logout
        </button>
      </div>
      <div className="main-content">
        <div className="topbar">
          <h2>{userInfo?.menulist?.find((m) => m.mid === activeMenu)?.menu || "Dashboard"}</h2>
          <div className="user-badge">👤 {userInfo?.fullname}</div>
        </div>
        <div className="page-content">
          {ActiveComponent ? <ActiveComponent /> : <div className="welcome">Welcome to Resource Booking System</div>}
        </div>
      </div>
    </div>
  );
}
