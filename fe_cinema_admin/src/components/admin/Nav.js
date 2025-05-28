import React, { useState } from "react";
import { NavLink, Navigate } from "react-router-dom";
import { Col, Row, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./nav.css";
import Header from "./Header";

const Sidebar = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const admin = localStorage.getItem("user_id");
  if (!admin || admin === "") {
    console.log("No user_id, redirecting to /login");
    return <Navigate to="/login" replace />;
  }
  return (
    <Container fluid className="vh-100">
      <Row className="vh-100">
        {/* Sidebar */}
        <Col
          sm={collapsed ? 1 : 2}
          className={`sidebar ${collapsed ? "collapsed" : ""}`}
        >
          <div className="sidebar-header py-3 px-2">
            {!collapsed && (
              <img
                src="logo-removebg-preview.png"
                width={120}
                height={50}
                style={{ objectFit: "cover" }}
                alt="Logo"
              />
            )}
            <button
              className="menu-btn"
              onClick={() => setCollapsed(!collapsed)}
            >
              <i className="fas fa-bars fs-5"></i>
            </button>
          </div>
          <nav className="flex-column mt-3">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <i className="fas fa-home"></i> {!collapsed && <span>Home</span>}
            </NavLink>
            <NavLink
              to="/movie"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <i className="fas fa-film"></i> {!collapsed && <span>Movie</span>}
            </NavLink>
            <NavLink
              to="/room"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <i className="fa-solid fa-grip"></i>{" "}
              {!collapsed && <span>Room</span>}
            </NavLink>
            <NavLink
              to="/showtimes"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <i className="fa-regular fa-calendar"></i>{" "}
              {!collapsed && <span>Showtimes</span>}
            </NavLink>
            <NavLink
              to="/order"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <i className="fa-solid fa-ticket"></i>{" "}
              {!collapsed && <span>Order</span>}
            </NavLink>
            <NavLink
              to="/customer"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <i className="fa-regular fa-user"></i>{" "}
              {!collapsed && <span>Customers</span>}
            </NavLink>
          </nav>
        </Col>

        {/* Nội dung */}
        <Col
          sm={collapsed ? 11 : 10}
          className={`content p-3 ${collapsed ? "expanded" : ""}`}
        >
          <Header collapsed={collapsed} />
          <div>{children}</div> {/* Render nội dung từ Routes */}
        </Col>
      </Row>
    </Container>
  );
};

export default Sidebar;
