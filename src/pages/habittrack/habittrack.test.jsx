import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthContext } from 'context/authContext';
import HabitTrack from './habittrack';

function renderHabitTrack() {
  return render(
    <AuthContext.Provider value={{ token: 'test-user' }}>
      <HabitTrack />
    </AuthContext.Provider>
  );
}

beforeEach(() => localStorage.clear());

test('adds a trimmed habit and stores completion when checked', async () => {
  renderHabitTrack();

  await userEvent.type(screen.getByRole('textbox', { name: 'Habit name' }), '  Walk  ');
  await userEvent.click(screen.getByRole('button', { name: 'Add habit' }));

  expect(screen.getAllByText('Walk', { selector: '.habit-name-span' })).toHaveLength(2);
  expect(screen.getByRole('status')).toHaveTextContent('Walk added to your habits.');

  const checkbox = screen.getAllByRole('checkbox')[0];
  await userEvent.click(checkbox);

  expect(JSON.parse(localStorage.getItem('habitlisttest-user'))[0].list).not.toBe(0);
  expect(screen.getByRole('status')).toHaveTextContent(/Walk marked done/);
});

test('clears the week and rejects a blank habit name', async () => {
  const { unmount } = renderHabitTrack();

  await userEvent.type(screen.getByRole('textbox', { name: 'Habit name' }), '   ');
  fireEvent.submit(screen.getByRole('textbox', { name: 'Habit name' }).closest('form'));
  expect(screen.getByRole('status')).toHaveTextContent('Enter a habit name before adding it.');

  unmount();
  localStorage.setItem('habitlisttest-user', JSON.stringify([{ name: 'Read', id: 1, list: 3 }]));
  renderHabitTrack();
  await userEvent.click(screen.getByRole('button', { name: 'Clear this week' }));

  expect(JSON.parse(localStorage.getItem('habitlisttest-user'))[0].list).toBe(0);
});
