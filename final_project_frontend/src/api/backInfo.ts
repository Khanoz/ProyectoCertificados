import { AxiosResponse } from "axios";
import axiosInstance from "./axios";

function GetUserRols(email: string, password: string): Promise<AxiosResponse> {
  return axiosInstance().get("/view/user-rols");
}

export default { GetUserRols };
