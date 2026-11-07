import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthContext } from 'context/authContext';
import Worksignin from './worksignin';

beforeEach(() => localStorage.clear());

test('records clock-in and persists the timestamp', async () => {
  render(
    <AuthContext.Provider value={{ token: 'test-user' }}>
      <Worksignin />
    </AuthContext.Provider>
  );

  await userEvent.click(screen.getByRole('button', { name: 'Clock in now' }));

  expect(screen.getByRole('status')).toHaveTextContent(/Clock-in recorded/);
  expect(JSON.parse(localStorage.getItem('workTimetest-user')).punchInTime).toEqual(expect.any(Number));
  expect(screen.getByRole('region', { name: 'Clock-in summary' })).toBeInTheDocument();
});

test('rejects a work duration that does not exceed time off', async () => {
  render(
    <AuthContext.Provider value={{ token: 'test-user' }}>
      <Worksignin />
    </AuthContext.Provider>
  );

  await userEvent.clear(screen.getByLabelText('Hours', { selector: '#workingHours' }));
  await userEvent.type(screen.getByLabelText('Hours', { selector: '#workingHours' }), '0');
  await userEvent.click(screen.getByRole('button', { name: 'Clock in now' }));

  expect(screen.getByRole('status')).toHaveTextContent(/Check the time settings/);
  expect(JSON.parse(localStorage.getItem('workTimetest-user')).punchInTime).toBeNull();
});
