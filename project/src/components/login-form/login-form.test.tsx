import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createMockStore } from '@test-utils/mock-store';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import LoginForm from './index';

const renderLoginForm = () => {
  const store = createMockStore();
  return {
    store,
    ...render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      </Provider>,
    ),
  };
};

describe('LoginForm', () => {
  describe('Rendering & Accessibility', () => {
    it('should render all form elements with correct attributes and accessibility', () => {
      renderLoginForm();

      // Check form structure
      const form = document.querySelector('.login__form');
      expect(form).toBeInTheDocument();
      expect(form).toHaveClass('login__form');

      // Check email field
      const emailInput = screen.getByLabelText(/e-mail/i);
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('placeholder', 'example@mail.com');
      expect(emailInput).toHaveAttribute('id', 'email');
      expect(emailInput).toHaveValue('');

      // Check password field
      const passwordInput = screen.getByLabelText(/password/i, {
        selector: 'input',
      });
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('placeholder', 'Your password');
      expect(passwordInput).toHaveAttribute('id', 'password');
      expect(passwordInput).toHaveValue('');

      // Check password toggle button
      const toggleButton = screen.getByRole('button', {
        name: /show password/i,
      });
      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton).toHaveAttribute('type', 'button');
      expect(toggleButton).toHaveAttribute('aria-label', 'Show password');

      // Check submit button
      const submitButton = screen.getByRole('button', { name: /log in/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');
      expect(submitButton).toBeEnabled();

      // Check labels are properly associated
      const emailLabel = screen.getByText('E-mail');
      const passwordLabel = screen.getByText('Password');
      expect(emailLabel).toHaveAttribute('for', 'email');
      expect(emailLabel).toBeVisible();
      expect(passwordLabel).toHaveAttribute('for', 'password');
      expect(passwordLabel).toBeVisible();

      // Check no error messages are shown initially
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/invalid/i)).not.toBeInTheDocument();
    });
  });

  describe('Input Behavior & Validation', () => {
    it('should accept and display typed input correctly', async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const emailInput = screen.getByLabelText(/e-mail/i);
      const passwordInput = screen.getByLabelText(/password/i, {
        selector: 'input',
      });

      await user.type(emailInput, 'user@example.com');
      await user.type(passwordInput, 'mypassword123');

      expect(emailInput).toHaveValue('user@example.com');
      expect(passwordInput).toHaveValue('mypassword123');
    });

    it('should handle special characters in input fields', async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const emailInput = screen.getByLabelText(/e-mail/i);
      const passwordInput = screen.getByLabelText(/password/i, {
        selector: 'input',
      });

      await user.type(emailInput, 'user+test@sub-domain.co.uk');
      await user.type(passwordInput, 'p@ssw0rd!#$');

      expect(emailInput).toHaveValue('user+test@sub-domain.co.uk');
      expect(passwordInput).toHaveValue('p@ssw0rd!#$');
    });

    it('should not validate invalid email format on blur alone', async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const emailInput = screen.getByLabelText(/e-mail/i);

      await user.type(emailInput, 'invalid-email');
      await user.tab(); // Trigger blur

      expect(
        screen.queryByText('Invalid email address'),
      ).not.toBeInTheDocument();
    });

    it('should handle rapid typing and backspacing', async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const passwordInput = screen.getByLabelText(/password/i, {
        selector: 'input',
      });

      await user.type(passwordInput, 'abc123');
      await user.keyboard('{Backspace}{Backspace}{Backspace}');
      await user.type(passwordInput, '456');

      expect(passwordInput).toHaveValue('abc456');
    });
  });

  describe('Password Toggle', () => {
    it('should toggle password visibility and update aria-label', async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const passwordInput = screen.getByLabelText(/password/i, {
        selector: 'input',
      });
      const toggleButton = screen.getByRole('button', {
        name: /show password/i,
      });

      // Initially password should be hidden
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(toggleButton).toHaveAttribute('aria-label', 'Show password');

      // Click to show password
      await user.click(toggleButton);

      expect(passwordInput).toHaveAttribute('type', 'text');
      expect(toggleButton).toHaveAttribute('aria-label', 'Hide password');

      // Click again to hide password
      await user.click(toggleButton);

      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(toggleButton).toHaveAttribute('aria-label', 'Show password');
    });

    it('should handle password toggle with keyboard', async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const passwordInput = screen.getByLabelText(/password/i, {
        selector: 'input',
      });
      const toggleButton = screen.getByRole('button', {
        name: /show password/i,
      });

      await user.tab(); // Focus email
      await user.tab(); // Focus password
      await user.tab(); // Focus toggle button

      expect(toggleButton).toHaveFocus();
      expect(passwordInput).toHaveAttribute('type', 'password');

      // Activate with space
      await user.keyboard(' ');
      expect(passwordInput).toHaveAttribute('type', 'text');
      expect(toggleButton).toHaveAttribute('aria-label', 'Hide password');

      // Activate with enter
      await user.keyboard('{Enter}');
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(toggleButton).toHaveAttribute('aria-label', 'Show password');
    });
  });

  describe('Form Validation', () => {
    describe('Email Validation', () => {
      it('should show required error when email is empty on submit', async () => {
        const user = userEvent.setup();
        renderLoginForm();

        const passwordInput = screen.getByLabelText(/password/i, {
          selector: 'input',
        });
        const submitButton = screen.getByRole('button', { name: /log in/i });

        // Fill password to avoid multiple errors and focus on email error
        await user.type(passwordInput, 'password123');
        await user.click(submitButton);

        await waitFor(() => {
          expect(screen.getByText('Email is required')).toBeInTheDocument();
        });
      });

      it('should not show error message on submit if email is valid', async () => {
        const user = userEvent.setup();
        renderLoginForm();

        const emailInput = screen.getByLabelText(/e-mail/i);
        const passwordInput = screen.getByLabelText(/password/i, {
          selector: 'input',
        });
        const submitButton = screen.getByRole('button', { name: /log in/i });
        const validEmails = ['test@example.com', 'user.name@domain.co.uk'];

        for (const email of validEmails) {
          await user.clear(emailInput);
          await user.clear(passwordInput);
          await user.type(emailInput, email);
          await user.type(passwordInput, 'password123');

          // Submit the form with valid data
          await user.click(submitButton);

          // No email error should be shown for valid emails
          expect(
            screen.queryByText('Invalid email address'),
          ).not.toBeInTheDocument();
        }
      });
    });

    describe('Password Validation', () => {
      it('should show required error when password is empty on submit', async () => {
        const user = userEvent.setup();
        renderLoginForm();

        const emailInput = screen.getByLabelText(/e-mail/i);
        const submitButton = screen.getByRole('button', { name: /log in/i });

        // Fill email to avoid multiple errors and focus on password error
        await user.type(emailInput, 'test@example.com');
        await user.click(submitButton);

        await waitFor(() => {
          expect(screen.getByText('Password is required')).toBeInTheDocument();
        });
      });

      it('should show minimum length error for short passwords', async () => {
        const user = userEvent.setup();
        renderLoginForm();

        const emailInput = screen.getByLabelText(/e-mail/i);
        const passwordInput = screen.getByLabelText(/password/i, {
          selector: 'input',
        });
        const submitButton = screen.getByRole('button', { name: /log in/i });

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, '12345');
        await user.click(submitButton);

        await waitFor(() => {
          expect(
            screen.getByText('Password must be at least 6 characters long'),
          ).toBeInTheDocument();
        });
      });

      it('should show pattern error for passwords without letter and number', async () => {
        const user = userEvent.setup();
        renderLoginForm();

        const emailInput = screen.getByLabelText(/e-mail/i);
        const passwordInput = screen.getByLabelText(/password/i, {
          selector: 'input',
        });
        const submitButton = screen.getByRole('button', { name: /log in/i });

        // Test password with only letters
        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password');
        await user.click(submitButton);

        await waitFor(() => {
          expect(
            screen.getByText(
              'Password must contain at least one letter and one number',
            ),
          ).toBeInTheDocument();
        });

        // Clear and test password with only numbers
        await user.clear(passwordInput);
        await user.type(passwordInput, '123456');
        await user.click(submitButton);

        await waitFor(() => {
          expect(
            screen.getByText(
              'Password must contain at least one letter and one number',
            ),
          ).toBeInTheDocument();
        });
      });

      it('should accept valid passwords without showing errors', async () => {
        const user = userEvent.setup();
        renderLoginForm();

        const emailInput = screen.getByLabelText(/e-mail/i);
        const passwordInput = screen.getByLabelText(/password/i, {
          selector: 'input',
        });
        const submitButton = screen.getByRole('button', { name: /log in/i });
        const validPasswords = ['password1', 'test123', 'MyPass1'];

        for (const password of validPasswords) {
          await user.clear(emailInput);
          await user.clear(passwordInput);
          await user.type(emailInput, 'test@example.com');
          await user.type(passwordInput, password);

          // Submit the form with valid data
          await user.click(submitButton);

          // No password error should be shown for valid passwords
          expect(screen.queryByText(/password must/i)).not.toBeInTheDocument();
        }
      });

      it('should handle edge case password validation scenarios', async () => {
        const user = userEvent.setup();
        renderLoginForm();

        const emailInput = screen.getByLabelText(/e-mail/i);
        const passwordInput = screen.getByLabelText(/password/i, {
          selector: 'input',
        });
        const submitButton = screen.getByRole('button', { name: /log in/i });

        // Test minimum length exactly
        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'abc123'); // Exactly 6 chars with letter and number
        await user.click(submitButton);

        // Should be valid
        await waitFor(() => {
          expect(screen.queryByText(/password must/i)).not.toBeInTheDocument();
        });

        // Test with spaces (should be valid)
        await user.clear(passwordInput);
        await user.type(passwordInput, 'pass word1');
        await user.click(submitButton);

        await waitFor(() => {
          expect(screen.queryByText(/password must/i)).not.toBeInTheDocument();
        });
      });
    });

    describe('Multiple Validation Scenarios', () => {
      it('should handle multiple validation errors and clear them appropriately', async () => {
        const user = userEvent.setup();
        renderLoginForm();

        const emailInput = screen.getByLabelText(/e-mail/i);
        const passwordInput = screen.getByLabelText(/password/i, {
          selector: 'input',
        });
        const submitButton = screen.getByRole('button', { name: /log in/i });

        // Trigger multiple errors simultaneously
        await user.click(submitButton);

        await waitFor(() => {
          const alerts = screen.getAllByRole('alert');
          expect(alerts).toHaveLength(2);
          expect(alerts[0]).toHaveTextContent('Email is required');
          expect(alerts[1]).toHaveTextContent('Password is required');
        });

        // Fix email error
        await user.type(emailInput, 'test@example.com');
        await user.click(submitButton);

        await waitFor(() => {
          expect(
            screen.queryByText('Email is required'),
          ).not.toBeInTheDocument();
          expect(screen.getByText('Password is required')).toBeInTheDocument();
        });

        // Fix password error
        await user.type(passwordInput, 'password123');
        await user.click(submitButton);

        await waitFor(() => {
          expect(
            screen.queryByText('Password is required'),
          ).not.toBeInTheDocument();
        });
      });

      it('should clear errors when valid input is provided', async () => {
        const user = userEvent.setup();
        renderLoginForm();

        const emailInput = screen.getByLabelText(/e-mail/i);
        const submitButton = screen.getByRole('button', { name: /log in/i });

        // Trigger error
        await user.click(submitButton);
        await waitFor(() => {
          expect(screen.getByText('Email is required')).toBeInTheDocument();
        });

        // Fix the error
        await user.type(emailInput, 'test@example.com');
        await user.tab(); // Trigger validation

        await waitFor(() => {
          expect(
            screen.queryByText('Email is required'),
          ).not.toBeInTheDocument();
        });
      });
    });
  });

  describe('Form Submission', () => {
    it('should disable submit button and show loading state during submission', async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const emailInput = screen.getByLabelText(/e-mail/i);
      const passwordInput = screen.getByLabelText(/password/i, {
        selector: 'input',
      });
      const submitButton = screen.getByRole('button', { name: /log in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');

      expect(submitButton).toBeEnabled();
      expect(submitButton).toHaveTextContent('Log in');

      // Click submit and immediately check for loading state
      user.click(submitButton);

      // Check for loading state shortly after click
      await waitFor(
        () => {
          expect(submitButton).toHaveTextContent('Logging in...');
        },
        { timeout: 100 },
      );
    });
  });

  describe('User Interaction', () => {
    it('should handle keyboard navigation correctly', async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const emailInput = screen.getByLabelText(/e-mail/i);
      const passwordInput = screen.getByLabelText(/password/i, {
        selector: 'input',
      });
      const toggleButton = screen.getByRole('button', {
        name: /show password/i,
      });
      const submitButton = screen.getByRole('button', { name: /log in/i });

      // Tab through elements
      await user.tab();
      expect(emailInput).toHaveFocus();

      await user.tab();
      expect(passwordInput).toHaveFocus();

      await user.tab();
      expect(toggleButton).toHaveFocus();

      await user.tab();
      expect(submitButton).toHaveFocus();
    });
  });
});
