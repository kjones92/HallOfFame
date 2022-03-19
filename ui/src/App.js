import { Layout, Navigation } from "./components";
import { Route, Routes, Navigate } from "react-router-dom";
import {
  Home,
  PendingReviews,
  Users,
  Profile,
  Favourite,
  Owned,
  AlbumDetails,
  Login,
  CreateAccount,
  UserDetails,
} from "./pages";
import { NavigationRoutes } from "./constants";
import { AuthContext } from "./contexts";
import { LoginUtils } from "./utils";

const adminRoutes = () => {
  return (
    <>
      <Route path={NavigationRoutes.Users} element={<Users />} />
      <Route path={NavigationRoutes.UserDetails} element={<UserDetails />} />
      <Route
        path={NavigationRoutes.PendingReviews}
        element={<PendingReviews />}
      />
    </>
  );
};

const loggedInRoutes = () => {
  return (
    <>
      <Route path={NavigationRoutes.Profile} element={<Profile />} />
    </>
  );
};

function App() {
  const { state } = AuthContext.useLogin();
  const loggedIn = state.access && !LoginUtils.isTokenExpired(state);
  const isAdminUser = loggedIn && LoginUtils.isAdminUser(state.access);

  return (
    <>
      <Navigation />
      <Layout>
        <Routes>
          <Route path={NavigationRoutes.Home} element={<Home />} />
          <Route path={NavigationRoutes.Login} element={<Login />} />
          <Route
            path={NavigationRoutes.CreateAccount}
            element={<CreateAccount />}
          />
          <Route
            path={NavigationRoutes.AlbumDetails}
            element={<AlbumDetails />}
          />
          {loggedIn && loggedInRoutes()}
          {isAdminUser && adminRoutes()}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
