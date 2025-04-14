import { z } from "zod";

export const validatePassword = (value: string) => {
  const result = z.string().min(8, "Password must be at least 8 characters").safeParse(value);
  return result.success ? undefined : result.error.errors[0].message;
};