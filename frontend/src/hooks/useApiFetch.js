import { useCallback } from "react";
import useAuth from "./useAuth";
import useLogout from "./useLogout";
import useRefresh from "./useRefresh";

function useApiFetch() {
  const { auth } = useAuth();
  const logout = useLogout();
  const refresh = useRefresh();
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
        let httpResponse = await fetch(url, reqConfig);
        if (httpResponse.status === 401 || httpResponse.status === 403) {
          const refreshResponse = await refresh();
          const refreshedAccessToken = refreshResponse?.accessToken;
          if (refreshedAccessToken) {
            reqConfig.headers.Authorization = `Bearer ${refreshedAccessToken}`;
            httpResponse = await fetch(url, reqConfig);
            if (httpResponse.status === 401 || httpResponse.status === 403) {
              await logout();
              return null;
            }
          }
        }
        const responseObject = await httpResponse.json();
        return { "httpResponse": httpResponse, "responseObject": responseObject };
      } catch (err) {
        console.error(err);
      }
    },
    [auth.accessToken, logout]
  );

  return apiFetch;
}

export default useApiFetch;
