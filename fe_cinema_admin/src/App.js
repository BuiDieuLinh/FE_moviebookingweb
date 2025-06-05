import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/admin/ToastContext";
import Sidebar from "./components/admin/Nav"; // Sửa tên Slidebar thành Sidebar
import Login from "./components/admin/Login";
import ShowtimeDetail from "./components/admin/ShowtimeDetail";
import Home from "./components/admin/Home";
import MovieManagement from "./components/admin/MovieManagement";
import Room from "./components/admin/Room";
import Showtimes from "./components/admin/Showtimes";
import Order from "./components/admin/Order";
import Users from "./components/admin/UserManegement";
import RoomDetail from "./components/admin/RoomDetail";
import TicketPrice from "./components/admin/TicketPrice";

function App() {
  return (
    <div className="App">
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Route chính hiển thị Sidebar và các trang con */}
            <Route
              path="/*"
              element={
                <Sidebar>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/movie" element={<MovieManagement />} />
                    <Route path="/room" element={<Room />} />
                    <Route path="/room/:room_id" element={<RoomDetail/>}/>
                    <Route path="/showtimes" element={<Showtimes />} />
                    <Route path="/showtimes/:showtime_id" element={<ShowtimeDetail />}/>
                    <Route path="/order" element={<Order />} />
                    <Route path="/prices" element={<TicketPrice />} />
                    <Route path="/customer" element={<Users />} />
                  </Routes>
                </Sidebar>
              }
            />
            {/* Route cho Login */}
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </div>
  );
}

export default App;
