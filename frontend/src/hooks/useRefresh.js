import useAuth from "./useAuth";
import useLogout from "./useLogout";

function useRefresh() {
  const { setAuth } = useAuth();
  const logout = useLogout();
  async function refresh() {
    try {
      const apiUrl = "http://127.0.0.1:3501/api";
      const url = `${apiUrl}/auth/refresh`;
      const httpResponse = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
      const responseObject = await httpResponse.json();
      console.log("refresh\n", responseObject, "\n");
      if (
        httpResponse?.status === 200 &&
        responseObject?.username &&
        responseObject?.roles &&
        responseObject.accessToken
      ) {
        setAuth({
          "username": responseObject.username,
          "roles": responseObject.roles,
          "accessToken": responseObject?.accessToken
        });
        return responseObject;
      } else {
        await logout();
        return null;
      }
    } catch (err) {
      console.error(err);
      await logout();
      return null;
    }
  }
  return refresh;
}

export default useRefresh;
