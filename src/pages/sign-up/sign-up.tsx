import { useForm, type SubmitHandler } from 'react-hook-form';
import { Row, Col } from 'antd';
import { SignUpHeader } from './sign-up-header';
import type { SignUp } from './sign-up.types';
import { yupResolver } from '@hookform/resolvers/yup';
import { signUpSchema } from './sign-up-validation-schema';
import { USE_SIGN_IN_TEXT, USE_SIGN_IN_BUTTON } from './sign-up.constants';
import { SubmitButton } from '../../components/form';
import { SIGN_IN_PATH } from '../../constants/routes.constant';
import { useNavigate } from 'react-router';
import { AuthLayout } from '../../layouts';
import { FooterText } from '../../components/footer-text';
import { InputField, InputPasswordField } from '../../components/form';
import { showAlert, hideAlert } from '../../store';
import { sendRequest } from '../../modules/auth-axios';
import { SERVER_REGISTER_ADRESS } from '../../constants/env';
import { HttpError } from '../../modules/http-error';
import { useAppDispatch } from '../../store/hooks';
import { logIn } from '../../store/user-slice';

export const SignUpForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { handleSubmit, control } = useForm<SignUp>({
    mode: 'onSubmit',
    resolver: yupResolver(signUpSchema),
  });

  const onSubmit: SubmitHandler<SignUp> = async (data) => {
    const user = await sendRequest(data.email, data.password, SERVER_REGISTER_ADRESS);
    if (user instanceof HttpError) {
      dispatch(showAlert({ type: 'warning', message: user.message }));
      return;
    }
    dispatch(hideAlert());
    dispatch(logIn(user));
  };

  const handleClick = () => {
    navigate(`/${SIGN_IN_PATH}`);
  };

  return (
    <AuthLayout footer={<FooterText text={USE_SIGN_IN_TEXT} subText={USE_SIGN_IN_BUTTON} onClick={handleClick} />}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row gutter={[0, 32]}>
          <Col span={24}>
            <SignUpHeader />
          </Col>
          <Col span={24}>
            <Row gutter={[0, 16]}>
              <Col span={24}>
                <InputField<SignUp>
                  control={control}
                  controllerName="email"
                  label="Email"
                  placeholder="Введите email пользователя"
                  required={true}
                />
              </Col>

              <Col span={24}>
                <InputPasswordField<SignUp>
                  control={control}
                  controllerName="password"
                  label="Пароль"
                  placeholder="Введите пароль"
                  required={true}
                />
              </Col>

              <Col span={24}>
                <InputPasswordField<SignUp>
                  control={control}
                  controllerName="confirmPassword"
                  label="Подтвердите пароль"
                  placeholder="Введите пароль"
                  required={true}
                />
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <SubmitButton>Зарегистрироваться</SubmitButton>
          </Col>
        </Row>
      </form>
    </AuthLayout>
  );
};
