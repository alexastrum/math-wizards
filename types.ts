
export type OperatorSymbol = '+' | '-' | '×' | '÷';

export interface Puzzle {
  numbers: [number, number, number];
  operators: [OperatorSymbol, OperatorSymbol];
  result: number;
}
