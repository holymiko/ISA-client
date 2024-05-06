import {Role} from "./enums/role";


export class AccountCreateDto {
    role?:	Role;
    username?:	string;
    password?: string;
}
