import type { PrismaClient } from "@prisma/client";
import type { IUserRepository, UserCredentialsRow } from "./user.interface.js";

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<UserCredentialsRow | null> {
    const row = await this.prisma.user.findUnique({
      where: { email },
      select: { email: true, password: true },
    });
    return row;
  }
}
