// import { axiosInstance } from '.'
import { IUser } from "@/types";
import { AxiosResponse } from "axios";
import axiosInstance from "./axios";

// NOTE: Recupera la información del usuario basado en su jwt token
function GetUserInfo(): Promise<AxiosResponse> {
  return axiosInstance().get("/user");
}

function GetUserEvents(): Promise<AxiosResponse> {
  return axiosInstance().get("/user/events");
}

interface IUpsertUser {
  names: string,
  lastNames: string,
  nickname: string,
  birthday: string,
  rol: string,
  image?: File,
}
// NOTE: Inserta o actualiza la información del usuario
function UpsertUserInfo(userInfo: IUpsertUser): Promise<AxiosResponse> {
    let formData = new FormData();
    formData.append("names", userInfo.names);
    formData.append("lastNames", userInfo.lastNames);
    formData.append("nickname", userInfo.nickname);
    formData.append("birthday", userInfo.birthday);
    formData.append("rol", userInfo.rol);
    if (userInfo.image) {
        formData.append("image", userInfo.image);
    }
    return axiosInstance().post("/user/bind-new-user", formData);
}

export default {
  GetUserInfo,
  UpsertUserInfo,
  GetUserEvents
};
