import { getWeather } from './weather';
import { afterEach } from 'vitest';

afterEach(() => vi.unstubAllGlobals());

test('requests and maps current and daily forecast data', async () => {
  const responseData = {
    current_weather: { temperature: 22, weathercode: 1 },
    daily: {
      time: [1],
      weathercode: [0],
      temperature_2m_max: [25],
      temperature_2m_min: [18],
      sunrise: [100],
      sunset: [200]
    }
  };
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => responseData });
  vi.stubGlobal('fetch', fetchMock);

  const result = await getWeather(24, 121, 'Asia/Taipei');

  const requestedUrl = new URL(fetchMock.mock.calls[0][0]);
  expect(requestedUrl.searchParams.get('latitude')).toBe('24');
  expect(requestedUrl.searchParams.get('timezone')).toBe('Asia/Taipei');
  expect(result.current).toEqual({ temperature: '22°C', weatherdescription: 'Mainly clear' });
  expect(result.daily[0]).toEqual({
    timestamp: 1000,
    weatherdescription: 'Clear sky',
    temperatureMax: '25°C',
    temperatureMin: '18°C',
    sunrise: 100000,
    sunset: 200000
  });
});

test('reports HTTP failures and incomplete forecast responses', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }));
  await expect(getWeather(24, 121, 'Asia/Taipei')).rejects.toThrow('Weather request failed (503)');

  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }));
  await expect(getWeather(24, 121, 'Asia/Taipei')).rejects.toThrow('Weather response was incomplete');
});
