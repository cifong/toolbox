import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

beforeEach(() => {
  localStorage.removeItem('logininguser');
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
