const encode = (string: string, radix: number, sign: boolean, bit: number): bigint => {
  if (!(radix >= 2 && radix <= 36 && Number.isInteger(radix)))
    throw new Error("The argument 'radix' must be an integer between 2 and 36 inclusive.");
  if (!(bit >= 1 && Number.isInteger(bit)))
    throw new Error("The argument 'bit' must be a natural number.");

  let sum = 0n;

  const bigIntRadix = BigInt(radix);
  for (let i = string.length - 1, count = 0n; i >= 0; i -= 1, count += 1n) {
    const character = string[i];
    if (radix === 10 && sign && i === 0 && character === '-') {
      sum *= -1n;
      break;
    }
    const number = parseInt(character, radix);
    if (Number.isNaN(number)) throw new Error(`This string is not a base ${radix} integer.`);
    sum += bigIntRadix ** count * BigInt(number);
  }

  const bitPattern = 2n ** BigInt(bit);
  const bitPatternHalf = bitPattern / 2n;
  if (sign) {
    if (radix !== 10 && sum >= bitPatternHalf && sum < bitPattern) {
      const reversedBit = [...(sum - 1n).toString(2).padStart(bit, '0')].reduce(
        (prev, value) => prev + (value === '0' ? '1' : '0'),
        ''
      );
      sum = -1n * encode(reversedBit, 2, false, bit);
    } else if (!(sum >= -1n * bitPatternHalf && sum < bitPatternHalf))
      throw new Error(`This number cannot be represented in a signed ${bit}-bit integer.`);
  } else if (!(sum >= 0n && sum < bitPattern))
    throw new Error(`This number cannot be represented in a unsigned ${bit}-bit integer.`);

  return sum;
};

let negativeNumberCache: [bigint, bigint] = [0n, 0n];

const decode = (number: bigint, radix: number, sign: boolean, bit: number): string => {
  if (!(radix >= 2 && radix <= 36 && Number.isInteger(radix)))
    throw new Error("The argument 'radix' must be an integer between 2 and 36 inclusive.");
  if (!(bit >= 1 && Number.isInteger(bit)))
    throw new Error("The argument 'bit' must be a natural number.");
  if (sign && !(number >= -1n * 2n ** BigInt(bit - 1) && number < 2n ** BigInt(bit - 1)))
    throw new Error(`This number cannot be represented in a signed ${bit}-bit integer.`);
  if (!sign && !(number >= 0n && number < 2n ** BigInt(bit)))
    throw new Error(`This number cannot be represented in a unsigned ${bit}-bit integer.`);

  if (radix !== 10 && number < 0n) {
    if (number !== negativeNumberCache[0]) {
      const binary = [...(-1n * (number + 1n)).toString(2).padStart(bit, '0')].reduce(
        (prev, value) => prev + (value === '0' ? '1' : '0'),
        ''
      );
      negativeNumberCache = [number, encode(binary, 2, false, bit)];
    }
    return negativeNumberCache[1].toString(radix);
  }
  return number.toString(radix);
};

export default { encode, decode };
