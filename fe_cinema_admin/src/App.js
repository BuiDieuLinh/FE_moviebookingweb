import './App.css';
import React from "react";
import AdminRoutes from './pages/admin'
import {ToastProvider}   from "./components/admin/ToastContext";

function App() {
  return (
    <div className="App">
      <ToastProvider>
        <AdminRoutes/>
      </ToastProvider>
    </div>
  );
}

export default App;
