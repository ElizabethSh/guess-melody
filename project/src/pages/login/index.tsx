import React, { FormEvent, useRef } from 'react';
import { useAppDispatch } from '../../hooks';
import { loginAction } from '../../store/actions/api-actions';


const Login = () => {
  const loginRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const dispatch = useAppDispatch();

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (loginRef.current && passwordRef.current) {
      dispatch(loginAction({
        login: loginRef.current.value,
        password: passwordRef.current.value,
      }));
    }
  };

  return (
    <section className="login">
      <div className="login__logo">
        <img src="img/melody-logo.png" alt="Угадай мелодию" width="186" height="83" />
      </div>
      <h2 className="login__title">Вы настоящий меломан!</h2>
      <p className="login__text">Хотите узнать свой результат? Представтесь!</p>
      <form className="login__form" action="" onSubmit={handleSubmit}>
        <p className="login__field">
          <label className="login__label" htmlFor="name">Логин</label>
          <input
            className="login__input"
            id="name"
            name="name"
            ref={loginRef}
            type="text"
          />
        </p>
        <p className="login__field">
          <label className="login__label" htmlFor="password">Пароль</label>
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
        <button className="login__button button" type="submit">Log in</button>
      </form>
      <button className="replay" type="button">Сыграть ещё раз</button>
    </section>
  );
};

export default Login;
