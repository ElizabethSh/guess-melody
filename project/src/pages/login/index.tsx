import { FormEvent, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { loginAction } from '../../store/api-actions';
import { AppRoute } from '../../settings';
import Logo from '../../components/logo/logo';
import { selectQuestions, selectStep } from '../../store/game/selectors';
import { selectUserEmail } from '../../store/user-process/user-process';

import './login.css';

const Login = () => {
  const loginRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const email = useAppSelector(selectUserEmail);
  const questions = useAppSelector(selectQuestions);
  const step = useAppSelector(selectStep);

  useEffect(() => {
    if (step && step === questions.length) {
      navigate(AppRoute.Result);
    } else if (email) {
      navigate(AppRoute.Root);
    }
  }, [step, email]);

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (loginRef.current && passwordRef.current) {
      dispatch(loginAction({
        login: loginRef.current?.value,
        password: passwordRef.current?.value,
      }));
    }
  };

  return (
    <section className="login">
      <div className="login__logo">
        <Logo />
      </div>
      <h2 className="login__text">Do you want to know your result? Introduce yourself!</h2>
      <form className="login__form" action="" onSubmit={handleSubmit}>
        <p className="login__field">
          <label className="login__label" htmlFor="name">E-mail</label>
          <input
            className="login__input"
            id="name"
            name="name"
            ref={loginRef}
            type="text"
          />
        </p>
        <p className="login__field">
          <label className="login__label" htmlFor="password">Password</label>
          <input
            className="login__input"
            id="password"
            name="password"
            ref={passwordRef}
            type="password"
          />
          {/* TODO: how we define that password is invalid (should have at least 1 letter)? */}
          {/* <span className="login__error">Неверный пароль</span> */}
        </p>
        <button
          className="login__button button"
          type="submit"
        >
          Log in
        </button>
      </form>
      <button
        className="replay"
        onClick={() => navigate(AppRoute.Game)}
        type="button"
      >
        Play again
      </button>
    </section>
  );
};

export default Login;
