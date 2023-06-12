import { add, isExpiryDateValid } from '../API';

test('renders vote link', () => {
  expect(add(1, 2)).toBe(3);
});

test('isDateValid future time', () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 5);
  expect(isExpiryDateValid(now)).toBe(true);
});

test('isDateValid past time', () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - 5);
  expect(isExpiryDateValid(now)).toBe(false);
});
