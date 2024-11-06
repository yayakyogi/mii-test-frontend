import {
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import SettingsIcon from "@mui/icons-material/Settings";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useApp } from "../../providers/app.provider";
import { ProtectedRoute } from "../../guards/app.guard";

const MainLayout: React.FC = () => {
  const { setLogout } = useApp();
  const navigate = useNavigate();
  const [expand, setExpand] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ProtectedRoute>
      <div className="h-screen w-full overflow-hidden bg-slate-100">
        <div className="w-full py-2 px-5 bg-slate-50 fixed top-0 z-10 shadow flex items-center justify-between">
          <img src="/images/logo.png" className="h-7" />
          <div className="flex items-center gap-2">
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleClick}
                size="small"
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleClose}>
                <Avatar /> My account
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <MenuItem onClick={() => setLogout()}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </div>
        </div>
        <div className="flex">
          <div className="h-full w-[220px] fixed top-[65px] pt-4 shadow-sm bg-white">
            <Stack>
              <button
                className="px-2 py-4 cursor-pointer hover:bg-slate-100 text-left flex items-center gap-1"
                onClick={() => navigate("/dashboard")}
              >
                <DashboardIcon />
                <span>Dashboard</span>
              </button>
              <button
                className="px-2 py-4 cursor-pointer hover:bg-slate-100 text-left flex items-center justify-between gap-1"
                onClick={() => setExpand(!expand)}
              >
                <AnalyticsIcon />
                <span className="flex-1">Laporan Lalin</span>
                <KeyboardArrowDownIcon />
              </button>
              {expand && (
                <div className="flex flex-col">
                  <button
                    className="pl-8 py-4 cursor-pointer hover:bg-slate-100 text-left"
                    onClick={() => navigate("/lalin")}
                  >
                    Lalin per hari
                  </button>
                </div>
              )}
              <button
                className="px-2 py-4 w-full cursor-pointer hover:bg-slate-100 flex items-center gap-1"
                onClick={() => navigate("/master-gerbang")}
              >
                <SettingsIcon />
                <span>Master Gerbang</span>
              </button>
            </Stack>
          </div>
          <div className="ml-[235px] mt-20 mr-4 bg-white w-full p-5 rounded shadow">
            <Outlet />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default MainLayout;
