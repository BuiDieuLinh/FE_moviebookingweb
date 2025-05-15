import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./component/SlideBar"; // Adjust if named Sidebar.tsx

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Sidebar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;