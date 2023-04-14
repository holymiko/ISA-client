import {Roles} from "../enums/roles";

export class UserCreateDto {
    account?: Account;
    email?:	string;
    firstName?:	string;
    lastName?:	string;
    midName?:	string;
    phoneNumber?:	string;
}

export class UserDto {
    id?: number
    email?:	string;
    firstName?:	string;
    lastName?:	string;
    midName?:	string;
    phoneNumber?:	string;
}

export class Account {
    username?:	string;
    password?:	string;
    role?:	Roles;
}

