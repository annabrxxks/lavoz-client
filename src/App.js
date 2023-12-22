import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Notifs from "./pages/notifications/Notifs";
import PostPage from "./pages/post/PostPage";
import Messages from "./pages/messages/Messages";
import Category from "./components/category/Category";
import Tamu from "./pages/tamu/Tamu";
import Users from "./pages/users/Users";
import News from "./pages/news/News";
import Market from "./pages/market/Market";
import FirstLogin from "./pages/firstLogin/FirstLogin";
import "./style.scss";
import { useContext, useState } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
  const { currentUser } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);

  const queryClient = new QueryClient();

  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <div className={`theme-${darkMode ? "dark" : "light"}`}>
          <Navbar />
          <div style={{ display: "flex" }}>
            <LeftBar />
            <div style={{ flex: 8 }}>
              <Outlet />
            </div>
            {/* <RightBar /> */}
          </div>
        </div>
      </QueryClientProvider>
    );
  };

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/firstLogin",
          element: <FirstLogin />,
        },
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/:name",
          element: <Category />,
        },
        {
          path: "/news",
          element: <News />
        },
        {
          path: "/market",
          element: <Market />
        },
        {
          path: "/profile/:id",
          element: <Profile />,
        },
        {
          path: "/notifications",
          element: <Notifs />,
        },
        {
          path: "/post/:id",
          element: <PostPage />,
        },
        {
          path: "/messages",
          element: <Messages />,
        },
        {
          path: "/users",
          element: <Users />
        },
        {
          path: "/tamu",
          element: <Tamu />
        }
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },

  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
