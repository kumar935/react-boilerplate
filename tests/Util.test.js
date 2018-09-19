import Util from "../src/utils/Util";


const sum = Util.sum;

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
