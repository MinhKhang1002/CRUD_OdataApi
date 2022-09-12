import { Address } from './address.model';

export interface People {
  UserName: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  Emails: string[];
  AddressInfo: Address[];
}
