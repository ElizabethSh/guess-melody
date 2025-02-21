import { Link } from 'react-router-dom';

import { AppRoute } from '../../settings';

const Logo = (): JSX.Element => (
  <Link className="game__back" style={{marginLeft: '0'}} to={AppRoute.Root}>
    <span className="visually-hidden">Play again</span>
    <img
      alt="Guess melody logo"
      className="game__logo"
      height="83"
      src="img/melody-logo-ginger.png"
      width="186"
    />
  </Link>
);

export default Logo;
