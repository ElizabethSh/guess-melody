import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@components/layout';
import LoginForm from '@components/login-form';
import { useAppDispatch, useAppSelector } from '@hooks/use-store';
import { AppRoute } from '@settings';
import { selectQuestions } from '@store/slices/data/data';
import { resetGame, selectStep } from '@store/slices/game-process/game-process';
import { selectUserEmail } from '@store/slices/user/user';

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const email = useAppSelector(selectUserEmail);
  const questions = useAppSelector(selectQuestions);
  const step = useAppSelector(selectStep);

  useEffect(() => {
    if (email) {
      if (step && step === questions.length) {
        navigate(AppRoute.Result);
      } else {
        navigate(AppRoute.Root);
      }
    }
  }, [step, email, navigate, questions.length]);

  const onReplayClick = () => {
    dispatch(resetGame());
    navigate(AppRoute.Game);
  };

  return (
    <Layout>
      <section className="login">
        <h2 className="main__title">
          Would you like to know your result?
          <br />
          Please introduce yourself!
        </h2>

        <LoginForm />

        <button className="replay" onClick={onReplayClick} type="button">
          Play again
        </button>
      </section>
    </Layout>
  );
};

export default LoginScreen;
