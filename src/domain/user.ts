interface UserProperties {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  username: string;
  email?: string;
  phone?: string;
}

export class User implements UserProperties {
  public readonly id: string;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly avatar: string;
  public readonly username: string;
  public readonly email?: string;
  public readonly phone?: string;

  constructor(input: UserProperties) {
    this.id = input.id;
    this.firstName = input.firstName;
    this.lastName = input.lastName;
    this.avatar = input.avatar;
    this.username = input.username;
    this.email = input.email;
    this.phone = input.phone;
  }
}
