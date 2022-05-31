import React, { Fragment, useState, useContext } from "react";
import { Link, NavLink, useMatch, useNavigate } from "react-router-dom";
//App Components
import Footer from "./Footer";
import Logo from "./Logo";
//MUI elements
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
//MUI icons
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import AccountCircle from "@mui/icons-material/AccountCircle";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsIcon from "@mui/icons-material/Settings";
//Custom scrollbar
import { Scrollbars } from "react-custom-scrollbars-2";
//Contexts
import { ResolutionContext } from "./contexts/ResolutionContext";
import { ThemeContext } from "./contexts/ThemeContext";

export default function Menus(props) {
  const navigate = useNavigate();

  //Contexts
  const { isLightTheme, switchTheme } = useContext(ThemeContext);

  //Check to hide menus on Login screen
  const isLoginScreen = useMatch("/");

  //Responsiveness
  const { mobileResolution } = useContext(ResolutionContext);

  //States
  const [anchorMenu, setAnchorMenu] = useState(null); //Opens top menu
  const [currentScreen, setCurrentScreen] = useState(0); //Selects screen in the bottom

  //Top menu functions
  const openMenu = (event) => {
    setAnchorMenu(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorMenu(null);
  };
  const gotoSettings = () => {
    closeMenu();
    navigate("/settings");
  };
  const gotoLogout = () => {
    closeMenu();
    navigate("/");
  };

  //Bottom menu functions
  const selectCurrentScreen = (e, v) => {
    setCurrentScreen(v);
  };

  return (
    <Fragment>
      <Box
        sx={
          mobileResolution
            ? { display: "none" }
            : {
                flexGrow: 1,
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 999,
                width: "100%",
                display: isLoginScreen ? "none" : null,
              }
        }
      >
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Box sx={{ display: "inline-block" }}>
                <Logo />
              </Box>
              <Button
                color="inherit"
                sx={{ marginLeft: 2 }}
                component={NavLink}
                to={"/finances"}
                style={({ isActive }) => {
                  return {
                    backgroundColor: isActive
                      ? "rgba(255, 255, 255, 0.3)"
                      : null,
                  };
                }}
              >
                <AttachMoneyIcon />
                Home
              </Button>
              <Button
                color="inherit"
                sx={{ marginLeft: 1 }}
                component={NavLink}
                to={"/statistics"}
                style={({ isActive }) => {
                  return {
                    backgroundColor: isActive
                      ? "rgba(255, 255, 255, 0.3)"
                      : null,
                  };
                }}
              >
                <QueryStatsIcon sx={{ marginRight: 1 }} />
                Stats
              </Button>
            </Typography>
            <IconButton size="large" color="inherit" onClick={switchTheme}>
              {isLightTheme ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
            <div>
              <IconButton size="large" onClick={openMenu} color="inherit">
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorMenu}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorMenu)}
                onClose={closeMenu}
              >
                <MenuItem onClick={gotoSettings}>Settings</MenuItem>
                <MenuItem onClick={gotoLogout}>Log out</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
      </Box>
      <Scrollbars
        style={{
          width: "100vw",
          height: "100vh",
        }}
      >
        {props.children}
        <Footer />
      </Scrollbars>
      <Box
        sx={
          mobileResolution
            ? {
                flexGrow: 1,
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                display: isLoginScreen ? "none" : null,
              }
            : { display: "none" }
        }
      >
        <BottomNavigation
          showLabels
          value={currentScreen}
          onChange={selectCurrentScreen}
        >
          <BottomNavigationAction
            label="Home"
            icon={<AttachMoneyIcon />}
            component={Link}
            to={"/finances"}
          />
          <BottomNavigationAction
            label="Stats"
            icon={<QueryStatsIcon />}
            component={Link}
            to={"/statistics"}
          />
          <BottomNavigationAction
            label="Settings"
            icon={<SettingsIcon />}
            component={Link}
            to={"/settings"}
          />
        </BottomNavigation>
      </Box>
    </Fragment>
  );
}
