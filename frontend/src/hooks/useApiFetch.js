import { useCallback } from "react";
import useAuth from "./useAuth";
import useLogout from "./useLogout";

function useApiFetch() {
  const { auth, setAuth } = useAuth();
  const logout = useLogout();
  const apiUrl = "http://127.0.0.1:3501/api";
  const apiFetch = useCallback(
    async (reqMethod, reqPath, reqBody) => {
      try {
        const url = `${apiUrl}/${reqPath}`;
        const reqConfig = {
          method: `${reqMethod}`,
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include"
        };
        if (auth?.accessToken) {
          reqConfig.headers.Authorization = `Bearer ${auth.accessToken}`;
        }
        if (reqBody) {
          reqConfig.body = JSON.stringify(reqBody);
        }
        const httpResponse = await fetch(url, reqConfig);
        if (httpResponse.status === 401 || httpResponse.status === 403) {
          await logout();
        }
        const responseObject = await httpResponse.json();
        return { "httpResponse": httpResponse, "responseObject": responseObject };
      } catch (err) {
        console.error(err);
      }
    },
    [setAuth, logout]
  );

  return apiFetch;
}

export default useApiFetch;
