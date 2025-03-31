import { BrowserRouter as Router, Routes, Route, useLocation, BrowserRouter } from "react-router-dom";
import HomePage from "../pages/index";
import Movie from "../pages/moviedetail";
import Cinemas from "../pages/cinemas";
import Header from "../components/user/Header";
import Showtimepage from "../pages/showtime";
import Promotions from "../pages/promotions";
import Account from "../pages/account";
import Footer from "../components/user/Footer";
import CinemaAuth from "../components/user/Login";

function Layout() {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === "/auth"; // Kiểm tra nếu ở trang /auth

  return (
    <>
      {!hideHeaderFooter && <Header />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<Movie />} />
          <Route path="/showtime" element={<Showtimepage />} />
          <Route path="/info-cinemas" element={<Cinemas />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/account" element={<Account />} />
          <Route path="/auth" element={<CinemaAuth />} />
        </Routes>
      

      {!hideHeaderFooter && <Footer />}
    </>
  );
}

export default function UserRoutes() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
