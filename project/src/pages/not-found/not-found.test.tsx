import { render, screen } from "@testing-library/react";
import NotFoundPage from ".";
import { MemoryRouter } from "react-router-dom";

describe('Page: NotFound', () => {
  it('should render correctly', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', {name: /Page not found/i})).toBeVisible();
    expect(screen.getByRole('link', {name: /Go back to the main page/i})).toBeVisible();
  });
});
