import integerWrapper from '../integerWrapper.js';

describe("UT: The 'encode' function", () => {
  test('FT: Integers including spaces', () => {
    expect(integerWrapper.encode(' 1 ', 10, false, 1)).toEqual({ is: true, value: 1n });
  });

  test('FT: Empty strings', () => {
    expect(integerWrapper.encode('', 10, false, 1)).toEqual({ is: true, value: '' });
  });

  test('FT: Negative signs', () => {
    expect(integerWrapper.encode('-', 10, true, 1)).toEqual({ is: true, value: '-' });
    expect(integerWrapper.encode('-', 10, false, 1)).toEqual({ is: false, value: '-', radix: 10 });
  });

  test('FT: Error handlings', () => {
    expect(integerWrapper.encode('2', 10, false, 1)).toEqual({ is: false, value: '2', radix: 10 });
  });
});

describe("UT: The 'decode' function", () => {
  test('FT: Valid empty strings', () => {
    expect(integerWrapper.decode({ is: true, value: '' }, 10, false, 1)).toBe('');
  });

  test('FT: Valid negative signs', () => {
    expect(integerWrapper.decode({ is: true, value: '-' }, 10, true, 1)).toBe('-');
    expect(integerWrapper.decode({ is: true, value: '-' }, 10, false, 1)).toBe('');
  });

  test('FT: Valid integers', () => {
    expect(integerWrapper.decode({ is: true, value: 1n }, 10, false, 1)).toBe('1');
  });

  test('FT: Invalid integers', () => {
    expect(integerWrapper.decode({ is: false, value: '2', radix: 10 }, 10, false, 1)).toBe('2');
    expect(integerWrapper.decode({ is: false, value: '2', radix: 10 }, 2, false, 1)).toBe('');
  });

  test('FT: Error handlings', () => {
    expect(integerWrapper.decode({ is: true, value: 2n }, 10, false, 1)).toBe('');
  });
});
