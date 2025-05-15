import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, InputBase, Box, IconButton, Avatar, Badge } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

interface HeaderProps {
  collapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({ collapsed }) => {
  const [bgColor, setBgColor] = useState<string>("transparent");

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 50) {
        setBgColor("rgba(0, 0, 0, 0.1)");
      } else {
        setBgColor("transparent");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: bgColor,
        transition: "background-color 0.3s ease, width 0.3s ease",
        width: collapsed ? "calc(100% - 70px)" : "calc(100% - 220px)",
        boxShadow: "none",
        color: "text.primary",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 1 }}>
        <Typography variant="h6" sx={{ m: 0 }}>
          Dashboard
        </Typography>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center", py: 0.5, px: 1, borderRadius: "50px", border: "1px solid", borderColor: "divider", bgcolor: "background.paper", boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
          <Box sx={{ display: "flex", alignItems: "center", border: "1px solid", borderColor: "divider", borderRadius: "50px", overflow: "hidden", bgcolor: "background.paper" }}>
            <IconButton size="small">
              <SearchIcon fontSize="small" color="action" />
            </IconButton>
            <InputBase
              placeholder="Search ..."
              sx={{ px: 1, fontSize: "12px" }}
            />
          </Box>
          <IconButton size="small">
            <Badge badgeContent={10} color="error" >
                <NotificationsNoneIcon fontSize="medium" />
            </Badge>
          </IconButton>
          <IconButton size="small">
            <DarkModeOutlinedIcon fontSize="medium" />
          </IconButton>
          <Avatar
            src="user_default.jpg"
            sx={{ width: 28, height: 28 }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;