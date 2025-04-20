import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminPage from "../pages/admin";
import Login from "../components/admin/Login"

const AdminRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AdminRoutes;
