import { AxiosResponse } from "axios";
import axiosInstance from "./axios";

function Login(email: string, password: string): Promise<AxiosResponse> {
  return axiosInstance().post("/auth/login", { email, password });
}

function Register(email: string, password: string): Promise<AxiosResponse> {
  return axiosInstance().post("/auth/register", { email, password });
}

function Recover(email: string): Promise<AxiosResponse> {
  return axiosInstance().post("/auth/recover", { email });
}

export default { Login, Register, Recover };
