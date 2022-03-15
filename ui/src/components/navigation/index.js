import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  IconButton,
  Typography,
  InputBase,
  MenuItem,
  Tooltip,
  Button,
  Avatar,
  Container,
  Menu,
  Toolbar,
  Box,
  AppBar,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { Search, Person } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { NavigationRoutes } from "../../constants";

const adminPages = [
  {
    display: "Pending Reviews",
    nav: NavigationRoutes.PendingReviews,
  },
  {
    display: "Users",
    nav: NavigationRoutes.Users,
  },
  {
    display: "Albums",
    nav: NavigationRoutes.Albums,
  },
];

const settings = [
  {
    display: "Profile",
    nav: NavigationRoutes.Profile,
  },
  {
    display: "Favourite Music",
    nav: NavigationRoutes.Favourite,
  },
  {
    display: "Owned Music",
    nav: NavigationRoutes.Owned,
  },
];

const isLoggedIn = true;
const isAdmin = true;

const SearchEntry = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("xs")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const logout = () => {
  // logout handled here later.
};

const MainNavigation = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);

  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  return (
    <AppBar position="static">
      <Container maxWidth="xxl">
        <Toolbar disableGutters>
          <Link
            to={NavigationRoutes.Home}
            style={{
              color: "inherit",
              textDecoration: "none",
              visited: "none",
            }}
          >
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
            >
              Hall Of Fame
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            {isAdmin && (
              <>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {adminPages.map(({ display, nav }) => (
                    <MenuItem key={nav} onClick={handleCloseNavMenu}>
                      <Link
                        to={nav}
                        style={{
                          color: "#000",
                          textDecoration: "none",
                          visited: "none",
                        }}
                      >
                        <Typography textAlign="center">{display}</Typography>
                      </Link>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <Link
              to={NavigationRoutes.Home}
              style={{
                color: "inherit",
                textDecoration: "none",
                visited: "none",
              }}
            >
              <Typography variant="h6" noWrap component="div">
                Hall Of Fame
              </Typography>
            </Link>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {isAdmin &&
              adminPages.map(({ display, nav }) => (
                <Link to={nav} style={{ textDecoration: "none" }}>
                  <Button
                    key={nav}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {display}
                  </Button>
                </Link>
              ))}
          </Box>

          <Box display="contents">
            <SearchEntry style={{ marginRight: "8px" }}>
              <SearchIconWrapper>
                <Search />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </SearchEntry>

            {isLoggedIn ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar>KJ</Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map(({ display, nav }) => (
                    <MenuItem key={nav} onClick={handleCloseUserMenu}>
                      <Link
                        to={nav}
                        style={{
                          color: "#000",
                          textDecoration: "none",
                          visited: "none",
                        }}
                      >
                        <Typography textAlign="center">{display}</Typography>
                      </Link>
                    </MenuItem>
                  ))}
                  <MenuItem
                    key="logout"
                    onClick={() => {
                      alert("Logout clicked");
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Tooltip title="Login">
                <Link to="/login">
                  <Person style={{ color: "#FFF", fontSize: 35 }} />
                </Link>
              </Tooltip>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default MainNavigation;
