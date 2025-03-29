import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Home from "./Home";
import MovieManagement from "./MovieManagement";
import Showtimes from "./Showtimes";
import TicketManagement from "./TicketManagement";
import UserManagement from "./UserManegement";
// import "./Admin.css";

const Admin = () => {
  return (
    <Router>
      <div fluid>
        <Row>
          {/* Sidebar */}
          <Col md={2} className="sidebar">
            <h4 className="text-center text-white mt-3">🎬 Admin Panel</h4>
            <nav>
              <ul>
                <li><Link to="/admin">📊 Home</Link></li>
                <li><Link to="/admin/movies">🎥 Quản lý phim</Link></li>
                <li><Link to="/admin/showtimes">⏰ Lịch chiếu</Link></li>
                <li><Link to="/admin/tickets">🎫 Quản lý vé</Link></li>
                <li><Link to="/admin/users">👥 Người dùng</Link></li>
              </ul>
            </nav>
          </Col>
          
          {/* Nội dung chính */}
          <Col md={10} className="content p-4">
            <Routes>
              <Route path="/admin" element={<Home />} />
              <Route path="/admin/movies" element={<MovieManagement />} />
              <Route path="/admin/showtimes" element={<Showtimes />} />
              <Route path="/admin/tickets" element={<TicketManagement />} />
              <Route path="/admin/users" element={<UserManagement />} />
            </Routes>
          </Col>
        </Row>
      </div>
    </Router>
  );
};

export default Admin;
