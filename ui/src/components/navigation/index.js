import React, { useEffect, useState } from "react";
import {
  Link,
  createSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
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
import { AuthContext } from "../../contexts";
import { LoginUtils } from "../../utils";
import { TokenService } from "../../services";

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

const Navigation = () => {
  const { state, dispatch } = AuthContext.useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const logout = () => {
    dispatch({ type: "logout" });
    TokenService.removeAuth();
    navigate(NavigationRoutes.Home);
    toast.success("Logout Successful!");
  };

  useEffect(() => {
    const loggedIn = state.access && !LoginUtils.isTokenExpired(state);
    handleCloseUserMenu();
    setIsLoggedIn(loggedIn);
    setIsAdmin(loggedIn && LoginUtils.isAdminUser(state.access));
    const username = loggedIn ? LoginUtils.getUsername(state.access) : null;
    setUsername(username);
  }, [state]);

  const searchPerformed = (e) => {
    if (e.key === "Enter" && e.target.value && e.target.value.length > 1) {
      navigate({
        pathname: NavigationRoutes.Home,
        search: createSearchParams({
          album: e.target.value,
        }).toString(),
      });

      if (location.pathname == NavigationRoutes.Home) {
        navigate(0);
      }
    }
  };

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  return (
    <AppBar position="static">
      <Toaster />
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
                <Link key={nav} to={nav} style={{ textDecoration: "none" }}>
                  <Button
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
                placeholder="Search Album"
                inputProps={{ "aria-label": "search" }}
                onKeyDown={searchPerformed}
              />
            </SearchEntry>

            {isLoggedIn ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar>{username?.charAt(0).toUpperCase()} </Avatar>
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
                  <MenuItem key="logout" onClick={logout}>
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
export default Navigation;
