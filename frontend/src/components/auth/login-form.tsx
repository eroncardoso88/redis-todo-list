// frontend/src/components/auth/login-form.tsx

import { appForm } from "@/src/components/form";
import authService from "@/src/services/auth-service";
import { useState } from "react";
import { z } from "zod";

const { useAppForm } = appForm;

export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const LoginFormObject = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().default(false),
});

export type InputName = z.infer<typeof LoginFormObject>;
export type InputRenderForm = {
  name: keyof InputName;
  textFieldProps: HTMLInputElement & { label: string };
};

export function LoginForm() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validators: {
      onSubmit: LoginFormObject,
    },
    onSubmit: async ({ value }) => {
      setError("");
      setIsLoading(true);

      console.log(`value `, value)
      try {
        // Transform the data for the backend which expects username instead of email
        const loginData = {
          email: value.email, // Email is used as username
          password: value.password,
          rememberMe: value.rememberMe
        };
        
        await authService.loginUser(loginData);
        
        window.location.href = '/dashboard';
      } catch (err: any) {
        setError(err.message || "Login failed. Please try again.");
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
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Email Field */}
      <form.AppField
        name="email"
        validators={{
          onBlur: (evt) => {
            const result = LoginFormObject.shape.email.safeParse(evt.value);
            return result.success
              ? undefined
              : result.error.errors[0].message;
          },
        }}
        children={(field) => (
          <field.TextField
            field={field}
            label="Email"
            type="email"
            placeholder="your@email.com"
          />
        )}
      />

      {/* Password Field */}
      <form.AppField
        name="password"
        validators={{
          onBlur: (evt) => {
            const result = LoginFormObject.shape.password.safeParse(evt.value);
            return result.success
              ? undefined
              : result.error.errors[0].message;
          },
        }}
        children={(field) => (
          <field.TextField
            field={field}
            label="Password"
            type="password"
            placeholder="Enter your password"
          />
        )}
      />

      {/* Remember Me Checkbox */}
      <form.AppField
        name="rememberMe"
        children={(field) => (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={field.state.value}
                onChange={(e) => field.handleChange(e.target.checked)}
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            
            <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
              Forgot password?
            </a>
          </div>
        )}
      />

      {/* Submit Button */}
      <form.Subscribe
        selector={(state) => [
          state.canSubmit,
          state.isSubmitting,
          state.isDirty,
        ]}
        children={([canSubmit, isSubmitting, isDirty]) => (
          <form.SubmitButton disabled={!canSubmit || !isDirty}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </form.SubmitButton>
        )}
      />

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign up
          </a>
        </p>
      </div>
    </form>
  );
}