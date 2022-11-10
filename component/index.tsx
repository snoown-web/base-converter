import React, { useReducer } from 'react';
import ReactDOM from 'react-dom/client';

import integerWrapper, { IsInteger } from './integerWrapper.js';

type Is<Type> = { is: true; value: Type } | { is: false; value: string };

type IntegerProps = {
  row: number;
  integer: IsInteger;
  sign: boolean;
  bit: Is<number>;
  setInteger: React.Dispatch<IsIntegerProperties>;
};

const isRadix = (_: Is<number>, action: string): Is<number> => {
  const number = Number(action);
  return Number.isInteger(number) && number >= 2 && number <= 36
    ? { is: true, value: number }
    : { is: false, value: action.trim() };
};

const Integer: React.FC<IntegerProps> = ({ row, integer, sign, bit, setInteger }) => {
  const [radix, setRadix] = useReducer(isRadix, { is: true, value: [10, 2, 8, 16][row] ?? 2 });

  const isProperty = radix.is && bit.is;

  return (
    <div>
      <label>
        <span>base:</span>
        <input
          className={radix.is ? '' : 'warning'}
          value={radix.value}
          onChange={(e) => setRadix(e.target.value)}
        />
      </label>

      <input
        className={!integer.is && radix.value === integer.radix ? 'warning' : ''}
        value={isProperty ? integerWrapper.decode(integer, radix.value, sign, bit.value) : ''}
        onChange={(e) => {
          if (isProperty)
            setInteger({
              type: 'encode',
              string: e.target.value,
              radix: radix.value,
              sign,
              bit: bit.value,
            });
        }}
      />
    </div>
  );
};

type IsIntegerProperties =
  | { type: 'encode'; string: string; radix: number; sign: boolean; bit: number }
  | { type: 'reset' };

const isInteger = (state: IsInteger, action: IsIntegerProperties): IsInteger => {
  switch (action.type) {
    case 'encode':
      return integerWrapper.encode(action.string, action.radix, action.sign, action.bit);
    case 'reset':
      return { is: true, value: '' };
    default:
      return state;
  }
};

const reverse = (state: boolean): boolean => !state;

const isBit = (_: Is<number>, action: string): Is<number> => {
  const number = Number(action);
  return Number.isInteger(number) && number >= 2
    ? { is: true, value: number }
    : { is: false, value: action.trim() };
};

const increment = (state: number): number => state + 1;

const Index: React.FC = () => {
  const [integer, setInteger] = useReducer(isInteger, { is: true, value: '' });
  const [sign, reverseSign] = useReducer(reverse, false);
  const [bit, setBit] = useReducer(isBit, { is: true, value: 64 });
  const [row, incrementRow] = useReducer(increment, 4);

  return (
    <>
      <div id='properties'>
        <button
          type='button'
          onClick={() => {
            setInteger({ type: 'reset' });
            reverseSign();
          }}
        >
          {sign ? 'signed' : 'unsigned'}
        </button>

        <label>
          <span>bit:</span>
          <input
            className={bit.is ? '' : 'warning'}
            value={bit.value}
            onChange={(e) => {
              setInteger({ type: 'reset' });
              setBit(e.target.value);
            }}
          />
        </label>
      </div>

      <div id='integers'>
        {[...Array<undefined>(row)].map((_, index) => (
          <Integer
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            row={index}
            integer={integer}
            sign={sign}
            bit={bit}
            setInteger={setInteger}
          />
        ))}
      </div>

      <button type='button' onClick={incrementRow}>
        +
      </button>
    </>
  );
};

const element = document.getElementsByTagName('main')[0];
ReactDOM.createRoot(element).render(<Index />);
