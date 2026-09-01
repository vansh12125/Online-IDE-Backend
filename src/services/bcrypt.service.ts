import bcrypt from "bcrypt";

const SALT_ROUNDS: number = Number(process.env.SALT_ROUNDS) || 11;

const hashPassword = async (rawPassword: string): Promise<string> => {
  return await bcrypt.hash(rawPassword, SALT_ROUNDS);
};

const verifyPassword = async (
  rawPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(rawPassword, hashedPassword);
};

export { hashPassword, verifyPassword };
