import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export const PrivateRoutes = ({ children }) => {
  // retrieve token from cookies
  const accessToken = Cookies.get("accessToken");
  return accessToken ? children : <Navigate to={"/"} replace={true} />;
};
