// frontend/src/components/auth/signup-form.tsx

import { appForm } from "@/src/components/form";
import { useState } from "react";
import { z } from "zod";

const { useAppForm } = appForm;
export interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type SignupFormProps = {
  onSubmit: (values: SignupFormValues) => Promise<void>;
};

export const SignupFormObject = z.object({
  name: z.string().min(4, "Name must be at least 4 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupFormSchema = SignupFormObject.refine((data) => {
  return data.password === data.confirmPassword;
});

export type InputName = z.infer<typeof SignupFormObject>
export type InputRenderForm = {
  name: keyof InputName
  textFieldProps: HTMLInputElement & { label: string };
}

export function SignupForm({ onSubmit }: SignupFormProps) {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fixed useForm with proper generic type
  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: signupFormSchema,
      onBlur: signupFormSchema,
    },
    onSubmit: async ({ value }) => {
      if (value.password !== value.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      setError("");
      setIsLoading(true);

      try {
        await onSubmit(value);
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

      {([
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
          name: "confirm password",
          textFieldProps: {
            label: "Confirm password",
            type: "password",
            placeholder: "Confirme",
          },
        },
      ] as InputRenderForm[]).map(
        ({
          name,
          textFieldProps,
        }) => (
          <form.AppField
            name={name}
            validators={{
              onBlur: (evt) => SignupFormObject.shape[name].safeParse(evt.value),
            }}
            // disableErrorFlat={true}
            children={(field) => (
              <field.TextField
                field={field}
                {...textFieldProps}
              />
            )}
          />
        )
      )}

      <div>
        <button
          type="submit"
          disabled={isLoading || !form.state.canSubmit}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? "Creating account..." : "Create account"}
        </button>
      </div>

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
