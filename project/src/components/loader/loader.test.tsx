import { render, screen } from '@testing-library/react';

import Loader from '.';

describe('Component: Loader', () => {
  test('should render correctly', () => {
    render(<Loader />);

    expect(screen.getByText('Loading...')).toBeVisible();
  });
});
