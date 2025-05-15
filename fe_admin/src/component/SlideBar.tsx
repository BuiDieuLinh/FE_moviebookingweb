import React, { useState } from "react";
import { Navigate, NavLink, Routes, Route } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  colors,
} from "@mui/material";
import {
  Home as HomeIcon,
  Movie as MovieIcon,
  GridOn as GridIcon,
  CalendarToday as CalendarIcon,
  ConfirmationNumber as TicketIcon,
  PersonOutline as PersonIcon,
  Menu as MenuIcon,
  PriceChange as PriceIcon,
} from "@mui/icons-material";
import Header from "./Header";
import Home from "../pages/Home";
import MovieManagement from "../pages/MovieManagement";
import RoomManagement from "../pages/RoomManagement";
import ShowTimesManagement from "../pages/ShowTimesManagement";
import PricesManagement from "../pages/PricesManagement";
import OrderManagement from "../pages/OrderManagement";
import UserManagement from "../pages/UserManagement";

const SidebarContainer = styled(Box)(({ theme }) => ({
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  display: "flex",
  height: "100vh",
}));

const SidebarDrawer = styled(Drawer)<{ collapsed: boolean }>(({ collapsed }) => ({
  "& .MuiDrawer-paper": {
    width: collapsed ? 70 : 220,
    backgroundColor: "white",
    transition: "width 0.3s ease-in-out",
    height: "100vh",
    overflowX: "hidden",
    padding: "10px"
  },
}));

const SidebarHeader = styled(Box)({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
});

const MenuButton = styled(IconButton)({
  background: "none",
  fontSize: "1.5rem",
  color: "black"
});

const NavLinkStyled = styled(NavLink)<{ collapsed: boolean }>(({ collapsed }) => ({
  display: "flex",
  alignItems: "center",
  padding: "7px 15px",
  color: "black !important",
  transition: "background 0.3s ease",
  fontSize: "14px !important",
  textDecoration: "none",
  width: "100%",
  borderRadius: '5px',
  justifyContent: collapsed ? "center" : "flex-start",
  "& .MuiListItemIcon-root": {
    fontSize: "14px !important",
    marginRight: collapsed ? 0 : "20px",
    minWidth: "unset",
  },
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  "&.active": {
    backgroundColor: "rgba(0, 0, 0, 0.2) !important",
      color: "black !important",
    borderRadius: '5px',
  },
}));

const ContentArea = styled(Box)<{ collapsed: boolean }>(({ collapsed }) => ({
  width: collapsed ? "calc(100% - 70px)" : "calc(100% - 220px)",
  backgroundColor: "#f7f7f7",
  overflowY: "auto",
  overflowX: "hidden",
  height: "100vh",
  transition: "width 0.3s ease-in-out",
  marginLeft: collapsed ? "70px" : "220px", 
  paddingTop: '64px'
}));

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  // Kiểm tra đăng nhập
//   const admin = localStorage.getItem("user_id");
//   if (!admin || admin === "") {
//     console.log("No user_id, redirecting to /login");
//     return <Navigate to="/login" replace />;
//   }

  const navItems = [
    { path: "/dashboard", label: "Home", icon: <HomeIcon />, component: Home },
    { path: "/movies", label: "Movie", icon: <MovieIcon />, component: MovieManagement },
    { path: "/rooms", label: "Room", icon: <GridIcon />, component: RoomManagement },
    { path: "/showtimes", label: "Showtimes", icon: <CalendarIcon />, component: ShowTimesManagement },
    { path: "/prices", label: "Prices", icon: <PriceIcon />, component: PricesManagement },
    { path: "/orders", label: "Orders", icon: <TicketIcon />, component: OrderManagement },
    { path: "/customers", label: "Customers", icon: <PersonIcon />, component: UserManagement },
  ];

  return (
    <SidebarContainer>
      <SidebarDrawer variant="permanent" collapsed={collapsed}>
        <SidebarHeader>
          {!collapsed && (
            <img
              src="logo-removebg-preview.png"
              width={100}
              height={50}
              style={{ objectFit: "cover" }}
              alt="Logo"
            />
          )}
          <MenuButton onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">
            <MenuIcon fontSize="medium" />
          </MenuButton>
        </SidebarHeader>
        <List sx={{ mt: 1 }}>
          {navItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <NavLinkStyled to={item.path} collapsed={collapsed} end>
                <ListItemIcon>{item.icon}</ListItemIcon>
                {!collapsed && <ListItemText primary={item.label} />}
              </NavLinkStyled>
            </ListItem>
          ))}
        </List>
      </SidebarDrawer>
      <ContentArea collapsed={collapsed}>
        <Header collapsed={collapsed} />
        <Box sx={{ p: 3, height: "100%" }}>
          <Routes>
            {navItems.map((item) => (
              <Route key={item.path} path={item.path} element={<item.component />} />
            ))}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Box>
      </ContentArea>
    </SidebarContainer>
  );
};

export default Sidebar;