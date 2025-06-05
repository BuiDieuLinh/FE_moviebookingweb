import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "react-bootstrap";
import axios from "axios";
import "./header.css";

const API_URL = process.env.REACT_APP_PORT || "http://localhost:5000";

export const Header = ({ collapsed }) => {
  const [user, setUser] = useState({});
  const [bgColor, setBgColor] = useState("bg-transparent");
  const [notificationCount, setNotificationCount] = useState(5);
  const [userInfoVisible, setUserInfoVisible] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const admin = sessionStorage.getItem("admin_id");
  console.log("Admin ID:", admin);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (admin) {
          const response = await axios.get(`${API_URL}/users/${admin}`);
          setUser(response.data[0] || {});
          console.log("User data:", response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [admin]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 50) {
        setBgColor("rgba(0, 0, 0, 0.1)");
      } else {
        setBgColor("bg-transparent");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sửa hàm toggleLogoutModal để chuyển đổi trạng thái
  const toggleLogoutModal = () => {
    console.log("Toggling modal, current state:", isLogoutModalOpen);
    setIsLogoutModalOpen((prevState) => !prevState);
  };

  // Sửa handleLogout để đóng modal trước khi chuyển hướng
  const handleLogout = () => {
    sessionStorage.clear();
    setIsLogoutModalOpen(false); // Đóng modal
    navigate("/login", { replace: true });
  };

  return (
    <div
      className="text-dark header-fixed"
      style={{
        backgroundColor: bgColor,
        transition: "background-color 0.3s ease, width 0.3s ease",
        width: collapsed ? "calc(100% - 90px)" : "calc(100% - 250px)",
      }}
    >
      <div className="d-flex justify-content-between align-items-center p-2">
        <h3 className="m-0">Dashboard</h3>
        <div className="header-right d-flex gap-3 p-2 align-items-center rounded-pill border-0">
          <div className="input-group input-group-sm rounded-pill overflow-hidden border">
            <span className="input-group-text border-0">
              <i className="fas fa-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-0 shadow-sm"
              placeholder="Search ..."
            />
          </div>
          {/* Biểu tượng chuông với số thông báo */}
          <div className="position-relative">
            <i className="far fa-bell"></i>
            {notificationCount > 0 && (
              <span className="badge bg-danger rounded-circle position-absolute notification-badge">
                {notificationCount}
              </span>
            )}
          </div>
          <i className="far fa-moon"></i>
          {/* Ảnh user với hover để hiển thị thông tin */}
          <div
            className="position-relative"
            onMouseEnter={() => setUserInfoVisible(true)}
            onMouseLeave={() => setUserInfoVisible(false)}
          >
            <img
              src="user_default.jpg"
              width={32}
              height={32}
              className="rounded-pill cursor-pointer"
              alt="User"
            />
            {userInfoVisible && (
              <div
                className="user-info-dropdown bg-white shadow-sm p-2 rounded"
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  zIndex: 1000,
                  minWidth: "200px",
                }}
              >
                <p className="m-0 fw-bold">{user.fullname || "Chưa có dữ liệu"}</p>
                <p className="m-0 text-muted">Quyền: {user.role || "Không xác định"}</p>
                <button
                  className="btn btn-danger btn-sm mt-2 w-100"
                  onClick={toggleLogoutModal}
                >
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal xác nhận đăng xuất */}
      <Modal show={isLogoutModalOpen} onHide={toggleLogoutModal}>
        <ModalHeader closeButton>
          <Modal.Title>Xác nhận đăng xuất</Modal.Title>
        </ModalHeader>
        <ModalBody>Bạn có chắc chắn muốn đăng xuất không?</ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={toggleLogoutModal}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Đăng xuất
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Header;