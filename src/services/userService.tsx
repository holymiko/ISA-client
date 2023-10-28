import {api} from "./api";
import {UserCreateDto, PersonAccountDto} from "../models/user";


export const getUserList = async (): Promise<PersonAccountDto[]> => {
  const { data } = await api.get<PersonAccountDto[]>('/person');
  return data;
};

export const getCurrentUser = async (): Promise<PersonAccountDto> => {
  const { data } = await api.get<PersonAccountDto>('/person/me');
  return data;
}

export const createUser = async (username: string, user: UserCreateDto): Promise<any> => {
  return await api.post<UserCreateDto>('/user/' + username, user);
}

export const deleteUser = async (id: number): Promise<null> => {
  return await api.delete('/user/' + id);
}