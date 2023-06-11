import { Route, Routes } from "react-router-dom";
import "./style/App.css";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ApiLayout from "./components/api/ApiLayout";
import ApiHome from "./components/api/ApiHome";
import NotesList from "./components/api/notes/NotesList";
import UserDetails from "./components/api/users/UserDetails";
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
        <Route path="api" element={<ApiLayout />}>
          <Route index element={<ApiHome />} />
          <Route path="notes" element={<NotesList />} />
          <Route path="users" element={<UserDetails />} />
        </Route>
        {/*Error*/}
        <Route path="err" element={<Error />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
