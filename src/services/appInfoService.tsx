import {api} from "./api";


export const getDbStats = () => {
    return api.get("info/stats");
}

export const getBackendVersion = () => {
    return api.get("info/version");
}




