export interface UserInput {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string; // hashed
}