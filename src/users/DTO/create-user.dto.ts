export interface CreateUserDto {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  age: number;
  role: string;
  isGithub: boolean;
}
