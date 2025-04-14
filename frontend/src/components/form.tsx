// frontend/src/components/form.tsx
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { defaultPrimaryButtonClasses } from "./ui";
import { FieldInfo } from "./ui/field-info";
import { Input } from "./ui/text-field";

// Assuming FieldApi type is correctly inferred or imported if needed
import type { FieldApi } from '@tanstack/react-form';

const { fieldContext, formContext } = createFormHookContexts();

// Define the props your custom TextField component will accept
type CustomTextFieldProps = {
  label: string;
  type?: string;
  placeholder?: string;
};

export const appForm = createFormHook({
  fieldComponents: {
    // Explicitly type the props for the custom component using FieldApi generic
    TextField: <TData, TFormValidator>(
      // The 'field' prop is automatically provided by @tanstack/react-form
      // The 'props' are the additional props you pass when using the component (like 'label')
      { field, ...props }: { field: FieldApi<TData, TFormValidator, any, any>; } & CustomTextFieldProps
    ) => (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={field?.name}
          className="block text-sm font-medium text-gray-700"
        >
          {/* Use the 'label' from the passed props */}
          {props.label}
        </label>
        <Input
          id={field?.name} 
          name={field?.name}
          type={props.type || "text"}
          value={field?.state.value ?? ''}
          onBlur={field?.handleBlur} 
          onChange={(e) => field.handleChange(e.target?.value)}
          placeholder={props?.placeholder} 
        />
        <FieldInfo field={field} />
      </div>
    ),
  },
  formComponents: {
    SubmitButton: (props) => (
      <button {...props} type={'submit'} className={defaultPrimaryButtonClasses} />
    ),
  },
  fieldContext,
  formContext,
});
