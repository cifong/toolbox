import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthContext } from 'context/authContext';
import Meals from './meals';

beforeEach(() => localStorage.clear());

test('adds an expense and persists the amount', async () => {
  render(
    <AuthContext.Provider value={{ token: 'test-user' }}>
      <Meals />
    </AuthContext.Provider>
  );

  const amountInput = screen.getAllByRole('spinbutton', { name: /^Expense amount/ })[0];
  await userEvent.type(amountInput, '12.5');
  await userEvent.click(amountInput.closest('form').querySelector('[type="submit"]'));

  expect(screen.getByRole('button', { name: '12.5' })).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem('meallisttest-user'))[0].expendDetail).toEqual([12.5]);
});

test('rejects a zero expense with a helpful message', async () => {
  render(
    <AuthContext.Provider value={{ token: 'test-user' }}>
      <Meals />
    </AuthContext.Provider>
  );

  const amountInput = screen.getAllByRole('spinbutton', { name: /^Expense amount/ })[0];
  await userEvent.type(amountInput, '0');
  await userEvent.click(amountInput.closest('form').querySelector('[type="submit"]'));

  expect(screen.getAllByRole('status')[0]).toHaveTextContent('Enter an amount greater than NT$ 0.');
});
