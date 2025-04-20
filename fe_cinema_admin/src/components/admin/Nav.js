import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Col, Nav, Row, Tab, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./nav.css"; // File CSS riêng để quản lý hiệu ứng
import Home from "./Home";
import MovieManagement from "./MovieManagement";
import Header from "./Header";
import UserManagement from "./UserManegement";
import Showtimes from "./Showtimes";
import Room from "./Room";
import Order from "./Order";

const Sidebar = () => {
  const [collapsed, setcollapsed] = useState(false);
  // const admin = localStorage.getItem("user_id");
  // if (!admin || admin === "") {
  //   console.log("No user_id, redirecting to /login");
  //   return <Navigate to="/login" replace />;
  // }
  return (
    <Container fluid className="vh-100">
      <Tab.Container defaultActiveKey="home">
        <Row className="vh-100">
          {/* Sidebar */}
          <Col
            sm={collapsed ? 1 : 2}
            className={`sidebar ${collapsed ? "collapsed" : ""}`}
          >
            <div className="sidebar-header py-3 px-2">
              {!collapsed && <img src="logo-removebg-preview.png" width={120} height={50} style={{objectFit: 'cover'}}/>}
              <button
                className="menu-btn"
                onClick={() => setcollapsed(!collapsed)}
              >
                <i className="fas fa-bars fs-5"></i>
              </button>
            </div>
            <Nav variant="pills" className="flex-column mt-3">
              <Nav.Item>
                <Nav.Link eventKey="home">
                  <i className="fas fa-home"></i> {!collapsed && <span>Home</span>}
                </Nav.Link>
              </Nav.Item>
              
              <Nav.Item>
                <Nav.Link eventKey="movie">
                  <i className="fas fa-film"></i> {!collapsed && <span>Movie</span>}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="room">
                  <i class="fa-solid fa-grip"></i> {!collapsed && <span>Room</span>}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="showtimes">
                <i class="fa-regular fa-calendar"></i> {!collapsed && <span>Showtimes</span>}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="order">
                <i class="fa-solid fa-ticket"></i> {!collapsed && <span>Order</span>}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="customer">
                  <i class="fa-regular fa-user"></i> {!collapsed && <span>Customers</span>}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="settings">
                  <i className="fas fa-cog"></i> {!collapsed && <span>Settings</span>}
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          {/* Nội dung Tab - Phần content mở rộng khi sidebar thu nhỏ */}
          <Col
            sm={collapsed ? 11 : 10}
            className={`content p-3 ${collapsed ? "expanded" : ""}`}
            // style={{ width: collapsed ? "calc(100% - 70px)" : "calc(100% - 230px)" }}
          >
            <Header collapsed={collapsed } />
            <Tab.Content>
              <Tab.Pane eventKey="home">
                <Home/>
              </Tab.Pane>
              <Tab.Pane eventKey="movie">
                <MovieManagement/>
              </Tab.Pane>
              <Tab.Pane eventKey="room">
                <Room/>
              </Tab.Pane>
              <Tab.Pane eventKey="showtimes">
                <Showtimes/>
              </Tab.Pane>
              <Tab.Pane eventKey="customer">
                <UserManagement/>
              </Tab.Pane>
              <Tab.Pane eventKey="order">
                <Order/>
              </Tab.Pane>
              <Tab.Pane eventKey="settings">
                <h4>Settings</h4>
                <p>Nội dung Cài Đặt</p>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default Sidebar;
