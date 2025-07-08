import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@components/layout';
import LoginForm from '@components/login-form';
import { useAppSelector } from '@hooks/use-store';
import { AppRoute } from '@settings';
import { selectQuestions } from '@store/slices/data/data';
import { selectStep } from '@store/slices/game-process/game-process';
import { selectUserEmail } from '@store/slices/user/user';

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
  }, [step, email, navigate, questions.length]);

  return (
    <Layout>
      <section className="login" style={{ marginTop: '3rem' }}>
        <h2 className="login__title">
          Would you like to know your result?
          <br />
          Please introduce yourself!
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
    </Layout>
  );
};

export default Login;
