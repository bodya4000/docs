export type UserCredentialsRow = {
  email: string;
  password: string;
};

export interface IUserRepository {
  findByEmail(email: string): Promise<UserCredentialsRow | null>;
}
