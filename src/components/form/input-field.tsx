import { type FieldValues } from 'react-hook-form';
import { Input, type InputProps } from 'antd';
import { FormField, type FormFieldProps } from './form-field';

export type InputFieldProps<T extends FieldValues> = InputProps & Omit<FormFieldProps<T>, 'children'>;

export const InputField = <T extends FieldValues>({
  control,
  controllerName,
  label,
  required,
  ...props
}: InputFieldProps<T>) => {
  return (
    <FormField control={control} controllerName={controllerName} label={label} required={required}>
      {({ field, fieldState }) => (
        <Input status={fieldState.error === undefined ? '' : 'error'} {...field} {...props} />
      )}
    </FormField>
  );
};
