// frontend/src/components/auth/signup-form.tsx

import { appForm } from "@/src/components/form";
import authService from "@/src/services/auth-service";
import { useState } from "react";
import { z } from "zod";

const { useAppForm } = appForm;
export interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const SignupFormObject = z.object({
  name: z.string().min(4, "Name must be at least 4 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupFormSchema = SignupFormObject.refine(
  (data) => {
    const assert = data.password === data.confirmPassword;
    return assert;
  },
  {
    // Apply the error to the 'confirmPassword' field for better UX
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);

export type InputName = z.infer<typeof SignupFormObject>;
export type InputRenderForm = {
  name: keyof InputName;
  textFieldProps: HTMLInputElement & { label: string };
};

export function SignupForm() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: signupFormSchema,
    },
    onSubmit: async ({ value }) => {
      if (value.password !== value.confirmPassword) {
        setError("Passwords do not match");
        return;

      }

      const backendData = {
        name: value.name,
        password: value.password,
        email: value.email,
      };

      setError("");
      setIsLoading(true);

      try {
        await authService.signupUser(backendData);
      } catch (err: any) {
        setError(err.message || "Signup failed. Please try again.");
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

      {(
        [
          {
            name: "name",
            textFieldProps: {
              label: "Full name",
            },
          },
          {
            name: "email",
            textFieldProps: {
              label: "Email",
              type: "email",
              placeholder: "exemplo@teste.com",
            },
          },
          {
            name: "password",
            textFieldProps: {
              label: "Password",
              type: "password",
              placeholder: "Telefone daquela namorada do passado",
            },
          },
          {
            name: "confirmPassword",
            textFieldProps: {
              label: "Confirm password",
              type: "password",
              placeholder: "Confirme",
            },
          },
        ] as InputRenderForm[]
      ).map(({ name, textFieldProps }) => (
        <form.AppField
          name={name}
          validators={{
            onBlur: (evt) => {
              const result = SignupFormObject.shape[name].safeParse(evt.value);
              return result.success
                ? undefined
                : result.error.errors[0].message;
            },
          }}
          children={(field) => (
            <field.TextField field={field} {...textFieldProps} />
          )}
        />
      ))}

      <form.Subscribe
        selector={(state) => [
          state.canSubmit,
          state.isSubmitting,
          state.isDirty,
        ]}
        children={([canSubmit, isSubmitting, isDirty]) => (
          <form.SubmitButton disabled={!canSubmit || !isDirty}>
            {isSubmitting ? "Creating Account..." : "Create Account"}{" "}
          </form.SubmitButton>
        )}
      />
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </a>
        </p>
      </div>
    </form>
  );
}
