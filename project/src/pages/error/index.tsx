import './error.css';

type ErrorPageProps = {
  onButtonClick: () => void;
};

const ErrorPage: React.FC<ErrorPageProps> = ({ onButtonClick }) => {
  return (
    <div className="error-page">
      <h1 className="error-page-title">Error</h1>
      <p>Something went wrong. Please try again.</p>
      <button
        className="game__submit button error-page-button"
        type="button"
        onClick={onButtonClick}
      >
        Try again
      </button>
    </div>
  );
};

export default ErrorPage;
