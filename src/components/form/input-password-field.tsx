import { type FieldValues } from 'react-hook-form';
import { Input } from 'antd';
import { FormField, type FormFieldProps } from './form-field';
import type { PasswordProps } from 'antd/es/input';

type InputPasswordFieldProps<T extends FieldValues> = PasswordProps & Omit<FormFieldProps<T>, 'children'>;

export const InputPasswordField = <T extends FieldValues>({
  control,
  controllerName,
  required,
  ...props
}: InputPasswordFieldProps<T>) => {
  return (
    <FormField control={control} controllerName={controllerName} label={props.label} required={required}>
      {({ field, fieldState }) => (
        <Input.Password status={fieldState.error === undefined ? '' : 'error'} {...field} {...props} />
      )}
    </FormField>
  );
};
