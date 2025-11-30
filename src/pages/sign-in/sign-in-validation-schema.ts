import * as yup from 'yup';
import { REQUIRED } from '../../constants/validation';

export const signInSchema = yup
  .object({
    email: yup
      .string()
      .transform((originalValue) => (originalValue ? originalValue.trim() : originalValue))
      .email()
      .required(REQUIRED),

    password: yup.string().required(REQUIRED),
  })
  .required();
