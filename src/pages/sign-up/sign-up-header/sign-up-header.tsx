import { Typography } from 'antd';
import styles from './sign-up-header.module.css';

const { Title, Text } = Typography;

export const SignUpHeader = () => {
  return (
    <>
      <Title level={4} className={styles.header}>
        Добро пожаловать!
      </Title>
      <Text type="secondary" className={styles.header}>
        Пожалуйста, пройдите регистрацию
      </Text>
    </>
  );
};
