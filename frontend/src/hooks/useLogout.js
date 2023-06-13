import { useCallback } from "react";
import useAuth from "./useAuth";
import { useLocation, useNavigate } from "react-router-dom";

function useLogout() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useCallback(async () => {
    try {
      const apiUrl = "http://127.0.0.1:3501/api";
      const url = `${apiUrl}/auth/logout`;
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
    } catch (err) {
      console.error(err);
    } finally {
      navigate("/login", { state: { from: location }, replace: true });
      setAuth({});
    }
  }, [setAuth, location, navigate]);

  return logout;
}

export default useLogout;
