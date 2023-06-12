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
      console.log(httpResponse, "REFRESH");
      if (responseObject?.accessToken) {
        setAuth((previousState) => {
          return { ...previousState, accessToken: responseObject.accessToken };
        });
        return responseObject.accessToken;
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
