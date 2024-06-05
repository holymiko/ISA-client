import {Role} from "../types/enums/role";
import {PersonAccountDto} from "../types/PersonAccountDto";
import {NavigateFunction} from "react-router-dom";
import {Availability} from "../types/enums/availability";
import {ChipISA} from "../components/ChipISA";
import {t} from "i18next";

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

export function getAvailabilityChipComponent(x: Availability): any {
    switch (x) {
        case Availability.IN_STORE:
        case Availability.IN_STOCK:
            return <ChipISA label={t(x.toLowerCase())} color="success" />
        case Availability.ON_DEMAND:
        case Availability.ON_ORDER:
            return <ChipISA label={t(x.toLowerCase())} color="warning" />
        case Availability.SOLD_OUT:
        case Availability.UNAVAILABLE:
            return <ChipISA label={t(x.toLowerCase())} color="error" />
        default:
            return undefined
    }
}

export function capitalizeFirstLetter(string: string|undefined): string{
    if(string === undefined) {
        return "";
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
}


export const excludeDigits = (value: string): string => {
    return value.replace(/\d/g, '');
}

export const excludeNonDigits = (value: string): string => {
    return value.replaceAll(/\D/g, '').trim()
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

export const isAdmin = (role: Role|undefined): boolean => {
    return role === Role.ADMIN || role === Role.SUPER_ADMIN
}

export const logOutMemClean = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
}

export const getSessionUser = (navigate: NavigateFunction): PersonAccountDto|undefined => {
    const stringUser = localStorage.getItem('user');

    if(isEmpty(stringUser)) {
        logOutMemClean();
        navigate("/login");
    } else {
        return JSON.parse(stringUser!);
    }
}

export const getSessionUser2 = (): PersonAccountDto|undefined => {
    const stringUser = localStorage.getItem('user');

    if(isEmpty(stringUser)) {
        return undefined
    } else {
        return JSON.parse(stringUser!);
    }
}

