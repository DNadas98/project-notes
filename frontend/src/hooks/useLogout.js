import { useCallback } from "react";
import useAuth from "./useAuth";

function useLogout() {
  const { setAuth } = useAuth();
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
      setAuth({});
    }
  }, [setAuth]);

  return logout;
}

export default useLogout;
