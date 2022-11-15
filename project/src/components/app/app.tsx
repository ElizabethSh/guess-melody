import WelcomeScreen from '../../pages/welcome-screen';

type AppProps = {
  errorsCount: number
};

function App({errorsCount}: AppProps): JSX.Element {
  return <WelcomeScreen errorsCount={errorsCount} />;
}

export default App;
