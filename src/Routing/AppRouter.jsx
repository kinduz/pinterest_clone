import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { privateRoutes, publicRoutes } from "./router";
import Header from "../Components/UI/Header/Header";

const AppRouter = () => {

  const email = useSelector((state) => state.auth.email);

  return email ? (
    <div className="content">
      <Header/>
      <div className="main__content">
      <Routes>
        {privateRoutes.map((route) => (
          <Route
            Component={route.component}
            path={route.path}
            exact={route.path}
            key={route.path}
          />
        ))}
        <Route path="/*" element={<Navigate to="/posts" />} />

      </Routes>
      </div>

    </div>
  ) : (
    <Routes>
      <>
        {publicRoutes.map((route) => (
          <Route
            Component={route.component}
            path={route.path}
            exact={route.path}
            key={route.path}
          />
        ))}

        <Route path="/*" element={<Navigate to="/login" />} />
      </>
    </Routes>
  );
};

export default AppRouter;
