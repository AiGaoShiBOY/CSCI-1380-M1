const {serialize, deserialize} = require('./serialization');

const {performance} = require('perf_hooks');

function testPerformance(size, object) {
  const testData = Array(size).fill(object);
  const serializeStart = performance.now();
  const serialized = testData.map((e) => serialize(e));
  const serializeEnd = performance.now();
  console.log(`serialization for ${object} (${size}) cost:`
      , serializeEnd - serializeStart);
  const deserializeStart = performance.now();
  serialized.map((e) => deserialize(e));
  const deserializeEnd = performance.now();
  console.log(`deserialization for ${object} (${size}) cost:`
      , deserializeEnd - deserializeStart);
}

let obj;
let size;

obj = 'init';
size = 10;
testPerformance(size, obj);

obj = 'Hello World';
size = 100;
testPerformance(size, obj);

obj = 'Hello World';
size = 1000;
testPerformance(size, obj);

obj = 'Hello World';
size = 10000;
testPerformance(size, obj);

obj = (a, b) => a + b;
size = 100;
testPerformance(size, obj);

obj = (a, b) => a + b;
size = 1000;
testPerformance(size, obj);

obj = (a, b) => a + b;
size = 10000;
testPerformance(size, obj);

obj = {a: 1, b: 2, c: 3};
obj.self = obj;
size = 1000;
testPerformance(size, obj);

obj = new Error('Hello World');
size = 1000;
testPerformance(size, obj);

