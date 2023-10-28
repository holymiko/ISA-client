import {Role} from "../types/enums/role";

export class UserCreateDto {
    account?: Account;
    email?:	string;
    firstName?:	string;
    lastName?:	string;
    midName?:	string;
    phoneNumber?:	string;
}

export class PersonAccountDto {
    id?: number;
    account?: Account;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
}

export class Account {
    id?: number;
    role?:	Role;
    username?:	string;
    personId?: number;
}

