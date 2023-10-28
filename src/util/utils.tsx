import {Role} from "../types/enums/role";

export function getTextYield(params: number): string {
    return params >= 1 ?
        "+" + Math.round(((+params)-1)*1_000_000)/10_000 + "%" :
        "-" + Math.round((1-(+params))*1_000_000)/10_000 + "%"
}

export function numberWithSpaces(x: number): string {
    const parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts[0]
}

export function priceWithSpaces(x: number): string {
    const parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
}

export function capitalizeFirstLetter(string: string|undefined): string{
    if(string === undefined) {
        return "";
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
}


export const excludeNumbers = (value: string): string => {
    return value.replace(/\d/g, '');
}

/**
 * Filters everything expect Unicode + whitespace + ,.'-
 * @param value
 */
export const filterNonLetters = (value: string): string => {
    return value.replace(/[^\p{L}\s,.'-]+/gu, '');
}



export const isEmpty = (value: string|null|undefined): boolean => {
    return value === '' || value === null || value === undefined;
}

export const filterPhoneNonDigit = (phoneVar: string): string => {
    phoneVar = phoneVar.trim();
    phoneVar = phoneVar.replaceAll(' ', '');
    phoneVar = phoneVar.replaceAll('(', '');
    phoneVar = phoneVar.replaceAll(')', '');
    phoneVar = phoneVar.replaceAll('+', '');
    return phoneVar;
}

/**
 * Returns string keys of Subordinate roles
 * @param roleIndex
 */
export const getSubordinateRoles = (roleIndex: number): string[] => {
    const result: string[] = [];
    for (let i = 0; i < roleIndex; i++) {
        result.push(Object.keys(Role)[i])
    }
    return result;
}

export const getIndexOfHighestRole = (roles: Role[]): number => {
    let index = 0;
    roles.forEach(role => {
        const i = Object.keys(Role).indexOf(role as unknown as Role);
        if(i > index) {
            index = i;
        }
    })
    return index;
}

export const getHighestRole = (roles: Role[]): Role => {
    return Object.values(Role)[getIndexOfHighestRole(roles)];
}

export const isSuperAdmin = (roles: Role[]): boolean => {
    return getIndexOfHighestRole(roles) === Object.values(Role).indexOf(Role.SUPER_ADMIN);
}

export const logOutMemClean = () => {
    // TODO Unite the locations to one & Test
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("user")
}

