import integer from '../integer.js';

describe("UT: The 'encode' function", () => {
  test("BVA: The argument 'radix'", () => {
    expect(integer.encode('1', 2, false, 1)).toBe(1n);
    expect(integer.encode('1', 36, false, 1)).toBe(1n);
    expect(() => {
      integer.encode('1', 1, false, 1);
    }).toThrow();
    expect(() => {
      integer.encode('1', 37, false, 1);
    }).toThrow();
  });

  test("BVA: The argument 'bit'", () => {
    expect(integer.encode('1', 10, false, 1)).toBe(1n);
    expect(() => {
      integer.encode('1', 10, false, 0);
    }).toThrow();
  });

  test("BVA: The argument 'string' (sign: true)", () => {
    expect(integer.encode('-2', 10, true, 2)).toBe(-2n);
    expect(integer.encode('1', 10, true, 2)).toBe(1n);
    expect(() => {
      integer.encode('-3', 10, true, 2);
    }).toThrow();
    expect(() => {
      integer.encode('2', 10, true, 2);
    }).toThrow();
  });

  test("BVA: The argument 'string' (sign: false)", () => {
    expect(integer.encode('0', 10, false, 2)).toBe(0n);
    expect(integer.encode('3', 10, false, 2)).toBe(3n);
    expect(() => {
      integer.encode('-1', 10, false, 2);
    }).toThrow();
    expect(() => {
      integer.encode('4', 10, false, 2);
    }).toThrow();
  });

  test('FT: Non-decimal negative integers', () => {
    expect(integer.encode('10', 2, true, 2)).toBe(-2n);
  });
});

describe("UT: The 'decode' function", () => {
  test("BVA: The argument 'radix'", () => {
    expect(integer.decode(1n, 2, false, 1)).toBe('1');
    expect(integer.decode(1n, 36, false, 1)).toBe('1');
    expect(() => {
      integer.decode(1n, 1, false, 1);
    }).toThrow();
    expect(() => {
      integer.decode(1n, 37, false, 1);
    }).toThrow();
  });

  test("BVA: The argument 'bit'", () => {
    expect(integer.decode(1n, 10, false, 1)).toBe('1');
    expect(() => {
      integer.decode(1n, 10, false, 0);
    }).toThrow();
  });

  test("BVA: The argument 'number' (sign: true)", () => {
    expect(integer.decode(-2n, 10, true, 2)).toBe('-2');
    expect(integer.decode(1n, 10, true, 2)).toBe('1');
    expect(() => {
      integer.decode(-3n, 10, true, 2);
    }).toThrow();
    expect(() => {
      integer.decode(2n, 10, true, 2);
    }).toThrow();
  });

  test("BVA: The argument 'number' (sign: false)", () => {
    expect(integer.decode(0n, 10, false, 2)).toBe('0');
    expect(integer.decode(3n, 10, false, 2)).toBe('3');
    expect(() => {
      integer.decode(-1n, 10, false, 2);
    }).toThrow();
    expect(() => {
      integer.decode(4n, 10, false, 2);
    }).toThrow();
  });

  test('FT: Non-decimal negative integers', () => {
    expect(integer.decode(-2n, 2, true, 2)).toBe('10');
  });
});
