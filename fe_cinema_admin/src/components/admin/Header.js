import React, { useState, useEffect } from "react";
import "./header.css";

export const Header = ({ collapsed }) => {
  const [bgColor, setBgColor] = useState("bg-transparent");

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 50) {
        setBgColor("rgba(0, 0, 0, 0.1)"); // Màu tối hơn khi cuộn xuống
      } else {
        setBgColor("bg-transparent"); // Màu nhạt khi ở đầu trang
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="text-dark header-fixed "
      style={{
        backgroundColor: bgColor,
        transition: "background-color 0.3s ease, width 0.3s ease",
        width: collapsed ? "calc(100% - 70px)" : "calc(100% - 250px)", // Phụ thuộc vào trạng thái sidebar
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
          <i className="far fa-bell"></i>
          <i className="far fa-moon"></i>
          <img
            src="user_default.jpg"
            width={32}
            height={32}
            className="rounded-pill"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
