import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { afterEach } from 'vitest';
import App from './App';

beforeEach(() => {
  localStorage.removeItem('logininguser');
});

afterEach(() => {
  vi.unstubAllGlobals();
});

test('renders the login page', () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <App />
    </MemoryRouter>
  );

  expect(
    screen.getByRole('heading', { name: /welcome/i })
  ).toBeInTheDocument();
});

test('redirects a visitor from a protected page to login', () => {
  render(
    <MemoryRouter initialEntries={['/habittrack']}>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByRole('heading', { name: /welcome/i })).toBeInTheDocument();
});

test('shows an error for an incorrect password', async () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <App />
    </MemoryRouter>
  );

  await userEvent.type(screen.getByLabelText('Account'), 'test-user');
  await userEvent.type(screen.getByLabelText('Password'), 'incorrect');
  await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));

  expect(screen.getByRole('alert')).toHaveTextContent(/password is incorrect/i);
});

test('returns to the requested protected page after login', async () => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
  render(
    <MemoryRouter initialEntries={['/habittrack']}>
      <App />
    </MemoryRouter>
  );

  await userEvent.type(screen.getByLabelText('Account'), 'test-user');
  await userEvent.type(screen.getByLabelText('Password'), 'qqqqqq');
  await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));

  await waitFor(() => {
    expect(screen.getByRole('heading', { name: 'Habit Track' })).toBeInTheDocument();
  });
});
