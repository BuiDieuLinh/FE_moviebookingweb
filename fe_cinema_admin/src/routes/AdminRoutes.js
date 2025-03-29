import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminPage from "../pages/admin";

const AdminRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AdminRoutes;
