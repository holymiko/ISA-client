import {api} from "./api";
import {UserCreateDto, UserDto} from "../models/user";

const version = process.env.REACT_APP_VERSION_URL;

export const getUserList = async (): Promise<UserDto[]> => {
  const { data } = await api.get<UserDto[]>(version + '/user/list');
  return data;
};

export const getCurrentUser = async (): Promise<UserDto> => {
  const { data } = await api.get<UserDto>(version + '/user/');
  return data;
}

export const createUser = async (username: string, user: UserCreateDto): Promise<any> => {
  return await api.post<UserCreateDto>(version + '/user/' + username, user);
}

export const deleteUser = async (id: number): Promise<null> => {
  return await api.delete(version + '/user/' + id);
}