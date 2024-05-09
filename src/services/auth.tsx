import {api} from "./api";


export const authorization = async (credentials: {username: string, password: string}): Promise<any> => {
  const { data } = await api.auth('/auth/login', credentials, { skipAuthRefresh: true });
  return data;
}

