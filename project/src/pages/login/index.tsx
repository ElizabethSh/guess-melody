import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '../../hooks';
import { AppRoute } from '../../settings';
import Logo from '../../components/logo/logo';
import { selectUserEmail } from '../../store/slices/user/user';
import { selectQuestions } from '../../store/slices/data/data';
import { selectStep } from '../../store/slices/game-process/game-process';
import LoginForm from '../../components/login-form';

const Login: React.FC = () => {
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

  return (
    <section className="login">
      <div className="login__logo">
        <Logo />
      </div>
      <h2 className="login__text" style={{ marginTop: '3.75rem' }}>
        Do you want to know your result? Introduce yourself!
      </h2>

      <LoginForm />

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
