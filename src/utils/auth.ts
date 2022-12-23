import Cookies from "js-cookie";
import { isJSON } from ".";

const TokenKey = "Authorization";

export const getCookies = (name: string) => {
  const data = Cookies.get(name) || "";

  if (isJSON(data)) return JSON.parse(data);

  return data;
};

export const setCookies = (name: string, value: any) => Cookies.set(name, value);
export const removeCookies = (name: string) => Cookies.remove(name);

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token: string) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function checkToken() {
  if (Cookies.get(TokenKey)) return true;

  return false;
}
