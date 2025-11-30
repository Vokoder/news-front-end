import { Typography } from 'antd';

const { Text } = Typography;

interface ErrorMessageProps {
  message: string | undefined;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = (props) => {
  return props.message && <Text type="danger">{props.message}</Text>;
};
