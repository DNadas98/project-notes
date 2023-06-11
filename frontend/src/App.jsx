import { Route, Routes } from "react-router-dom";
import "./style/App.css";
import RequireAuth from "./components/auth/RequireAuth";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import UserLayout from "./components/user/UserLayout";
import UserHome from "./components/user/UserHome";
import UserNotesList from "./components/user/notes/UserNotesList";
import UserDetails from "./components/user/users/UserSettings";
import Error from "./components/Error";
import NotFound from "./components/404";
import ErrorBoundary from "./components/500";

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/*public*/}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        {/*restricted*/}
        <Route element={<RequireAuth />}>
          <Route path="user" element={<UserLayout />}>
            <Route index element={<UserHome />} />
            <Route path="notes" element={<UserNotesList />} />
            <Route path="settings" element={<UserDetails />} />
          </Route>
        </Route>
        {/*Error*/}
        <Route path="err" element={<Error />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
