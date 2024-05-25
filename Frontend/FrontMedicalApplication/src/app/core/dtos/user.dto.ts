export class UserDto {
  userId?: number;
  username: string;
  password?: string;
  emailAddress: string;
  roleId: number;
  name: string;
  surname: string;
  cnp?: string;
  age?: number;
  address?: string;
  phoneNumber?: string;
  token?: string;
  description?: string;

  constructor(
    username: string = '',
    emailAddress: string = '',
    roleId: number,
    name: string = '',
    surname: string = '',
    cnp?: string,
    age?: number,
    userId?: number,
    password?: string,
    address?: string,
    phoneNumber?: string,
    token? : string
  ) {
    this.username = username;
    this.emailAddress = emailAddress;
    this.roleId = roleId;
    this.name = name;
    this.surname = surname;
    this.cnp = cnp;
    this.age = age;
    if (userId) {
      this.userId = userId;
    }
    this.password = password;
    this.address = address;
    this.phoneNumber = phoneNumber; 
    this.token = token;
  }
}
