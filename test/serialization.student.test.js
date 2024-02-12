const util = require('../distribution').util;


test('test build-in constructor', () => {
  const testFunc = String;
  const serialized = util.serialize(testFunc);
  const deserialized = util.deserialize(serialized);
  expect(deserialized).toBe(testFunc);
});


test('complex objects tests: native func + custom func', () => {
  const fn = (a, b) => a + b;
  const object = {
    n: 1,
    s: 'Hello, World!',
    func: fn,
    native: console.log,
  };
  const serialized = util.serialize(object);
  const deserialized = util.deserialize(serialized);
  expect(deserialized.native).toBe(console.log);
  expect(deserialized.func(42, 1)).toBe(43);
});

test('complex objects test: RainbowObject with circular', () => {
  const object = {
    n: 1,
    s: 'Hello, World!',
    a: [1, 2, 3, 4, 5],
    e: new Error('Hello, World!'),
    d: new Date(),
    o: {x: 1, y: 2, z: 3},
    n: null,
    u: undefined,
  };
  object.self = object;
  const serialized = util.serialize(object);
  const deserialized = util.deserialize(serialized);
  expect(deserialized).toEqual(object);
});

test('complex array test: complex circular', () => {
  const array = [1, 2, 3, 4, 5, [6, [7, [8], 9], 10]];
  const serialized = util.serialize(array);
  const deserialized = util.deserialize(serialized);
  expect(deserialized).toEqual(array);
});

test('custom date test', () => {
  const date = new Date('2023-01-12T18:36:16.987Z');
  const serialized = util.serialize(date);
  const deserialized = util.deserialize(serialized);
  expect(deserialized).toEqual(date);
});

