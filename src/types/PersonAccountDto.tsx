import {Account} from "./Account";


export class PersonAccountDto {
    id?: number;
    account?: Account;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
}
