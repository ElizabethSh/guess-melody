import { FormEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '../../hooks';
import { loginAction } from '../../store/api-actions';
import { AppRoute } from '../../settings';


const Login = () => {
  const loginRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // TODO: should redirect to welcome screen after autorization
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
        <img src="img/melody-logo.png" alt="Guess melody logo" width="186" height="83" />
      </div>
      <h2 className="login__title">You are a real music lover!</h2>
      <p className="login__text">Do you want to know your result? Introduce yourself!</p>
      <form className="login__form" action="" onSubmit={handleSubmit}>
        <p className="login__field">
          <label className="login__label" htmlFor="name">Login</label>
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
            type="text"
          />
          {/* TODO: how we define that password is invalid? */}
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
