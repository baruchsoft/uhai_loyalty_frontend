import Cookies from "js-cookie";
const accessToken = Cookies.get("accessToken");
export const config = {
  headers: {
    Authorization: `Bearer ${accessToken ? accessToken : ""}`,
    Accept: "application/json",
  },
};
