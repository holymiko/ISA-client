import {api} from "./api";
import {LinkCountDto} from "../types/LinkCountDto";


export const getLinkCountAsDto = async (): Promise<LinkCountDto[]> => {
    const { data } = await api.get<LinkCountDto[]>('link/count');
    return data;
};

