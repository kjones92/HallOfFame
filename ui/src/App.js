import { Layout, Navigation } from "./components";
import { AuthContext } from "./contexts";
import { Route, Routes, Navigate } from "react-router-dom";
import {
  Home,
  PendingReviews,
  Users,
  Albums,
  Profile,
  Favourite,
  Owned,
  AlbumDetails,
  Login,
  CreateAccount,
} from "./pages";
import { NavigationRoutes } from "./constants";

// we need to set authenticated and unauthenticated routes.

function App() {
  return (
    <AuthContext.AuthProvider>
      <Navigation />
      <Layout>
        <Routes>
          <Route path={NavigationRoutes.Home} element={<Home />} />
          <Route
            path={NavigationRoutes.PendingReviews}
            element={<PendingReviews />}
          />
          <Route path={NavigationRoutes.Users} element={<Users />} />
          <Route path={NavigationRoutes.Albums} element={<Albums />} />
          <Route path={NavigationRoutes.Profile} element={<Profile />} />
          <Route path={NavigationRoutes.Favourite} element={<Favourite />} />
          <Route path={NavigationRoutes.Owned} element={<Owned />} />
          <Route path={NavigationRoutes.Login} element={<Login />} />
          <Route
            path={NavigationRoutes.CreateAccount}
            element={<CreateAccount />}
          />
          <Route
            path={NavigationRoutes.AlbumDetails}
            element={<AlbumDetails />}
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </AuthContext.AuthProvider>
  );
}

export default App;
