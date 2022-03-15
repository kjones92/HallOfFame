import { Layout, Navigation } from "./components";

import { Route, Routes, Navigate } from "react-router-dom";
import {
  Home,
  PendingReviews,
  Users,
  Albums,
  Profile,
  Favourite,
  Owned,
} from "./pages";
import { NavigationRoutes } from "./constants";

function App() {
  return (
    <>
      <Navigation />
      <Layout>
        <Routes>
          <Route path={NavigationRoutes.Home} exact={true} element={<Home />} />
          <Route
            path={NavigationRoutes.PendingReviews}
            element={<PendingReviews />}
          />
          <Route path={NavigationRoutes.Users} element={<Users />} />
          <Route path={NavigationRoutes.Albums} element={<Albums />} />
          <Route path={NavigationRoutes.Profile} element={<Profile />} />
          <Route path={NavigationRoutes.Favourite} element={<Favourite />} />
          <Route path={NavigationRoutes.Owned} element={<Owned />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
