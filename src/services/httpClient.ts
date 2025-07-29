import { attachInterceptors } from "./interceptors/apiInterceptor"
import { ip } from "../config/ip"
import axios from "axios"

export const authApi = axios.create({
  baseURL: `${ip}:2399`
});

export const api = axios.create({
  baseURL: `${ip}:9137`,
  withCredentials: true
});

attachInterceptors(api, authApi);