import { Route, Routes } from "react-router-dom";
import "./style/App.css";
import Layout from "./components/Layout";
import Public from "./components/Public";
import ApiLayout from "./components/ApiLayout";
import Login from "./components/auth/Login";
import Welcome from "./components/auth/Welcome";
import NotesList from "./components/notes/NotesList";
import UsersList from "./components/users/UsersList";
import NotFound from "./components/404";
import ErrorBoundary from "./components/500";

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/*public*/}
          <Route index element={<Public />} />
          <Route path="login" element={<Login />} />
          {/*restricted*/}
          <Route path="api" element={<ApiLayout />}>
            <Route index element={<Welcome />} />
            <Route path="notes" element={<NotesList />} />
            <Route path="users" element={<UsersList />} />
          </Route>
          {/*error*/}
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
