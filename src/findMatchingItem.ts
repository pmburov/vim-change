import { getBracketPairs } from "./getBracketPairs";

type PairsStack = {
  pairs: (number[])[]
  stack: number[]
}
export function findMatchingItem(input: string, s: string) {
  const { openingBracket, closingBracket } = getBracketPairs(s)

  const { stack, pairs } = [...input].reduce<PairsStack>(
    ({ pairs, stack }, char, i) => {
      if (char === openingBracket) stack.push(i);
      else if (char === closingBracket) {
        if (stack.length === 0) {
          console.warn('Incomplete string, odd number of items')
        }
        const pop = stack.pop()
        if (pop !== undefined) {
          pairs.push([pop, i]);
        }
      }
      return { pairs, stack };
    },
    { pairs: [], stack: [] }
  );
  if (stack.length > 0) {
    console.warn('Incomplete string, odd number of items')
  }
  return pairs;
};
