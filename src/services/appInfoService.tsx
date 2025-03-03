import {api} from "./api";

export const getBackendVersion = () => {
    return api.get("info/version");
}




