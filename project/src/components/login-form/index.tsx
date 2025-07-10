import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '@components/button';
import { useAppDispatch } from '@hooks/use-store';
import { eyeClosed, eyeOpen } from '@icons';
import { loginAction } from '@store/api-actions';

import './login-form.css';

const VALIDATION_RULES = {
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
      message: 'Invalid email address',
    },
  },
  password: {
    required: 'Password is required',
    minLength: {
      value: 6,
      message: 'Password must be at least 6 characters long',
    },
    pattern: {
      value: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
      message: 'Password must contain at least one letter and one number',
    },
  },
} as const;

type FormFields = {
  email: string;
  password: string;
};

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="login__field">
        <label className="login__label" htmlFor="email">
          E-mail
        </label>
        <input
          className="login__input"
          id="email"
          {...register('email', VALIDATION_RULES.email)}
          placeholder="example@mail.com"
          type="email"
        />
        {errors.email && (
          <span className="login__error" role="alert">
            {errors.email.message}
          </span>
        )}
      </div>
      <div className="login__field">
        <label className="login__label" htmlFor="password">
          Password
        </label>
        <div className="login__input-container">
          <input
            className="login__input"
            id="password"
            {...register('password', VALIDATION_RULES.password)}
            placeholder="Your password"
            type={showPassword ? 'text' : 'password'}
          />
          <button
            type="button"
            className="login__password-toggle"
            onClick={() => {
              setShowPassword((prev) => !prev);
            }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? eyeClosed : eyeOpen}
          </button>
        </div>
        {errors.password && (
          <span className="login__error" role="alert">
            {errors.password.message}
          </span>
        )}
      </div>
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
