import { z } from "zod";

export const validateName = (value: string) => {
  const result = z.string().min(2, "Name must be at least 2 characters").safeParse(value);
  return result.success ? undefined : result.error.errors[0].message;
};