import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '@components/button';
import { useAppDispatch } from '@hooks/use-store';
import { loginAction } from '@store/api-actions';

import './login-form.css';

type FormFields = {
  email: string;
  password: string;
};

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();
  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<FormFields> = async ({ email, password }) => {
    await dispatch(
      loginAction({
        login: email,
        password,
      }),
    );
  };

  return (
    <form className="login__form" onSubmit={handleSubmit(onSubmit)}>
      <p className="login__field">
        <label className="login__label" htmlFor="email">
          E-mail
        </label>
        <input
          className="login__input"
          id="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              message: 'Invalid email address',
            },
          })}
          placeholder="example@mail.com"
          type="email"
        />
        {errors.email && (
          <span className="login__error">{errors.email.message}</span>
        )}
      </p>
      <p className="login__field">
        <label className="login__label" htmlFor="password">
          Password
        </label>
        <input
          className="login__input"
          id="password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters long',
            },
            pattern: {
              value: /^(?=.*[A-Za-z])(?=.*\d).+$/,
              message:
                'Password must contain at least one letter and one number',
            },
          })}
          placeholder="Your password"
          type="password"
        />
        {errors.password && (
          <span className="login__error">{errors.password.message}</span>
        )}
      </p>
      <Button
        className="login__button"
        disabled={isSubmitting}
        label={isSubmitting ? 'Logging in...' : 'Log in'}
        type="submit"
      />
    </form>
  );
};

export default LoginForm;
