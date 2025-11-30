import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { SignIn } from './sign-in-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Col, Row, Typography } from 'antd';
import { SubmitButton } from '../../components/form';
import { signInSchema } from './sign-in-validation-schema';
import styles from '@pages/sign-in/sign-in.module.css';
import { WarningFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { SIGN_UP_PATH } from '../../constants/routes.constant';
import { AuthLayout } from '../../layouts';
import { FooterText } from '../../components/footer-text';
import { USE_SIGN_UP_TEXT, USE_SIGN_UP_BUTTON } from './sign-in.constants';
import { InputField, InputPasswordField } from '../../components/form';
import { INVALID_CREDENTIAL } from '../../constants/validation';
import { showAlert, hideAlert } from '../../store';
import { sendRequest } from '../../modules/auth-axios';
import { HttpError } from '../../modules/http-error';
import { SERVER_LOGIN_ADRESS } from '../../constants/env';
import { useAppDispatch } from '../../store/hooks';
import { logIn } from '../../store/user-slice';

const { Title } = Typography;

export const SignInForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { handleSubmit, control } = useForm<SignIn>({
    mode: 'onSubmit',
    resolver: yupResolver(signInSchema),
  });
  const [isInvalidCredentials, setIsInvalidCredentials] = useState(false);

  const onSubmit: SubmitHandler<SignIn> = async (data) => {
    const user = await sendRequest(data.email, data.password, SERVER_LOGIN_ADRESS);
    if (user instanceof HttpError) {
      dispatch(showAlert({ type: 'warning', message: user.message }));
      if (user.status === 401) setIsInvalidCredentials(true);
      return;
    }
    setIsInvalidCredentials(false);
    dispatch(hideAlert());
    dispatch(logIn(user));
  };

  const handleClick = () => {
    navigate(`/${SIGN_UP_PATH}`);
  };

  return (
    <AuthLayout footer={<FooterText text={USE_SIGN_UP_TEXT} subText={USE_SIGN_UP_BUTTON} onClick={handleClick} />}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row gutter={[0, 32]}>
          <Col span={24}>
            <Title level={4}>Добро пожаловать!</Title>
          </Col>
          {isInvalidCredentials && (
            <Col span={24}>
              <Alert
                message={INVALID_CREDENTIAL}
                type="error"
                className={styles.alert}
                icon={<WarningFilled className={styles.alertIcon} />}
                showIcon
              />
            </Col>
          )}
          <Col span={24}>
            <Row gutter={[0, 16]}>
              <Col span={24}>
                <InputField<SignIn>
                  control={control}
                  controllerName="email"
                  label="Email"
                  placeholder="Введите email пользователя"
                  required={true}
                  type="input"
                />
              </Col>

              <Col span={24}>
                <InputPasswordField<SignIn>
                  control={control}
                  controllerName="password"
                  label="Пароль"
                  placeholder="Введите пароль"
                  required={true}
                  type="input"
                />
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <SubmitButton>Авторизоваться</SubmitButton>
          </Col>
        </Row>
      </form>
    </AuthLayout>
  );
};
