import { act, renderHook } from '@testing-library/react';
import { useStorage } from './customhooks';

beforeEach(() => {
  localStorage.clear();
});

test('loads a saved value and persists updates', () => {
  localStorage.setItem('test-list', JSON.stringify(['saved']));
  const { result } = renderHook(() => useStorage('test-list', []));

  expect(result.current[0]).toEqual(['saved']);

  act(() => result.current[1](['saved', 'new']));

  expect(JSON.parse(localStorage.getItem('test-list'))).toEqual(['saved', 'new']);
});

test('removes a saved value when state is set to null', () => {
  const { result } = renderHook(() => useStorage('test-user', 'visitor'));

  act(() => result.current[1](null));

  expect(localStorage.getItem('test-user')).toBeNull();
});
