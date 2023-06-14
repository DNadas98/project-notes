import { useContext } from "react";
import AuthContext from "../../context/auth/AuthProvider";

function useAuth() {
  return useContext(AuthContext);
}
export default useAuth;
