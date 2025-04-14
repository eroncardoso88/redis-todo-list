
// src/components/AuthForm.tsx
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { z } from "zod";



const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: ""
    },
    onSubmit: async ({ value }) => {
      setError("");
      setSuccess(false);
      setIsLoading(true);
      
      try {
        // await onSubmit(value);
        setSuccess(true);
      } catch (err: any) {
        setError(err.message || "Failed to send password reset email. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      Não implementado.
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Remember your password?{" "}
          <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Back to login
          </a>
        </p>
      </div>
    </form>
  );
}