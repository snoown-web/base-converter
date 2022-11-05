import integer from './integer.js';

type IntegerInterface = bigint | '' | '-';

export type IsInteger =
  | { is: true; value: IntegerInterface }
  | { is: false; value: string; radix: number };

const encode = (string: string, radix: number, sign: boolean, bit: number): IsInteger => {
  const normalizedString = string.trim();
  switch (normalizedString) {
    case '':
      return { is: true, value: '' };
    case '-':
      return radix === 10 && sign ? { is: true, value: '-' } : { is: false, value: '-', radix };
    default:
      try {
        return { is: true, value: integer.encode(normalizedString, radix, sign, bit) };
      } catch {
        return { is: false, value: normalizedString, radix };
      }
  }
};

const decode = (isInteger: IsInteger, radix: number, sign: boolean, bit: number): string => {
  if (isInteger.is) {
    switch (isInteger.value) {
      case '':
        return '';
      case '-':
        return radix === 10 && sign ? '-' : '';
      default:
        try {
          return integer.decode(isInteger.value, radix, sign, bit);
        } catch {
          return '';
        }
    }
  }
  return radix === isInteger.radix ? isInteger.value : '';
};

export default { encode, decode };
