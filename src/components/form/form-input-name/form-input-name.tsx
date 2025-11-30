import { Typography } from 'antd';
import formStyles from './form-input-name.module.css';

const { Title } = Typography;

interface FormInputnameProps {
  name: string;
  required: boolean;
}

export const FormInputName = (props: FormInputnameProps) => {
  return (
    <Title level={5} className={formStyles.formInputName}>
      {props.name}
      {props.required && <span className={formStyles.requiredIndicator}> *</span>}
    </Title>
  );
};
