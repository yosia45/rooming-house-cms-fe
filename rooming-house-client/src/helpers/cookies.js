import Cookies from "js-cookie";

export const setUserCookies = ({ token }) => {
  Cookies.set("token", token);
};

export const removeUserCookies = () => {
  Cookies.remove("token");
};

export const setCookie = (key, value) => {
  const data = typeof value === "object" ? JSON.stringify(value) : value;
  // const encodeData = Buffer.from(data, "utf-8").toString("base64");

  Cookies.set(key, data);
};

export const getCookie = (key) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = Cookies.get(key);
  if (data) {
    // const decodeData = Buffer.from(data, "base64").toString("utf-8");
    try {
      return JSON.parse(data);
    } catch {
      return data || null;
    }
  }
  return null;
};

export function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );

  return JSON.parse(jsonPayload);
}

export const removeCookie = (key) => {
  Cookies.remove(key);
};
