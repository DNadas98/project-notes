import { Route, Routes } from "react-router-dom";
import "./style/App.css";
import RequireAuth from "./components/auth/RequireAuth";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import UserLayout from "./components/user/UserLayout";
import UserHome from "./components/user/UserHome";
import UserDetails from "./components/user/UserSettings";
import UserNotesList from "./components/notes/UserNotesList";
import EditNote from "./components/notes/EditNote";
import CreateNote from "./components/notes/CreateNote";
import AdminHome from "./components/admin/AdminHome";
import UsersList from "./components/admin/users/UsersList";
import EditUser from "./components/admin/users/EditUser";
import Error from "./components/Error";
import NotFound from "./components/404";
import ErrorBoundary from "./components/500";
import AdminNotesList from "./components/admin/notes/AdminNotesList";
import AdminNoteEditor from "./components/admin/notes/AdminNoteEditor";

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
        {/*user*/}
        <Route element={<RequireAuth allowedRoles={["User"]} />}>
          <Route path="user" element={<UserLayout />}>
            <Route index element={<UserHome />} />
            <Route path="notes" element={<UserNotesList />} />
            <Route path="notes/create" element={<CreateNote />} />
            <Route path="notes/edit" element={<EditNote />} />
            <Route path="settings" element={<UserDetails />} />
          </Route>
        </Route>
        {/*admin*/}
        <Route element={<RequireAuth allowedRoles={["Admin"]} />}>
          <Route path="admin" element={<UserLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="users" element={<UsersList />} />
            <Route path="users/edit" element={<EditUser />} />
            <Route path="users/notes" element={<AdminNotesList />} />
            <Route path="users/notes/edit" element={<AdminNoteEditor />} />
            <Route path="notes/all" element={<AdminNotesList />} />
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
