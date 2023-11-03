import {api} from "./api";
import {PersonAccountCreateDto, PersonAccountDto} from "../models/user";


export const getUserList = async (): Promise<PersonAccountDto[]> => {
  const { data } = await api.get<PersonAccountDto[]>('person');
  return data;
};

export const getCurrentUser = async (): Promise<PersonAccountDto> => {
  const { data } = await api.get<PersonAccountDto>('person/me');
  return data;
}

export const createUser = async (user: PersonAccountCreateDto): Promise<any> => {
  return await api.post<PersonAccountCreateDto>('person/account', user);
}

export const deleteUser = async (id: number): Promise<null> => {
  return await api.delete('person/' + id);
}

export const deleteAccount = async (id: number): Promise<null> => {
  return await api.delete('account/' + id);
}