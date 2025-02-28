import { Link } from 'react-router-dom';

import Logo from '../../components/logo/logo';
import { AppRoute } from '../../settings';


const NotFoundPage = () => (
  <section className='game'>
    <header className='game__header'>
      <Logo />
    </header>
    <main>
      <h1>Page not found</h1>
      <Link to={AppRoute.Root}>
        Go back to the main page
      </Link>
    </main>
  </section>
);

export default NotFoundPage;
