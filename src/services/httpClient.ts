import { attachInterceptors } from "./interceptors/apiInterceptor"
import { ip } from "../config/ip"
import axios from "axios"

export const authApi = axios.create({
  baseURL: `${ip}:2399`
});

export const api = axios.create({
  baseURL: `${ip}:3043`,
  withCredentials: true
});

attachInterceptors(api, authApi);