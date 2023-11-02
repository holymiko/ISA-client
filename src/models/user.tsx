import {Role} from "../types/enums/role";

export class Account {
    id?: number;
    role?:	Role;
    username?:	string;
    personId?: number;
}

export class AccountCreateDto {
    role?:	Role;
    username?:	string;
    password?: string;
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

export class PersonAccountCreateDto {
    account?: AccountCreateDto;
    firstName?:	string;
    lastName?:	string;
    midName?:	string;
    email?:	string;
    phone?:	string;
}


