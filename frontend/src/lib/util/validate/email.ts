import { z } from "zod";

export const validateEmail = (value: string) => {
  const result = z.string().email("Please enter a valid email address").safeParse(value);
  return result.success ? undefined : result.error.errors[0].message;
};