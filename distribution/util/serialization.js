// retrieve all gobal functions
function retrieveGlobalFuncMap(obj, map = new Map(),
    visited = new Set(),
    targets = new Set(['String', 'Number', 'Boolean',
      'Object', 'Array', 'RegExp', 'Function', 'Date', 'console'])) {
  for (const key of Object.getOwnPropertyNames(obj)) {
    const value = obj[key];
    if (visited.has(key)) {
      continue;
    }
    if (value === globalThis) {
      continue;
    }
    if (value === null || value === undefined) {
      continue;
    }
    if (typeof(value) === 'function' ) {
      map.set(key, value);
    }
    if (typeof(value) === 'object') {
      if (targets.has(key)) {
        retrieveGlobalFuncMap(value, map, visited);
      }
    }
    visited.add(key);
  }
  return map;
}


function serialize(object, seenObjects = new Map(), path = '') {
  let globalFuncMap = retrieveGlobalFuncMap(globalThis);

  if (object === undefined) {
    return '_@_undefined_@_';
  }
  if (object === null) {
    return '_@_null_@_';
  }
  if (typeof(object) === 'number') {
    return JSON.stringify(object);
  }
  if (typeof(object) === 'boolean') {
    return JSON.stringify(object);
  }
  if (typeof(object) === 'string') {
    return JSON.stringify(object);
  }
  if (typeof(object) === 'function') {
    if (object.name !== undefined && globalFuncMap.has(object.name)) {
      const globalFunc = globalFuncMap.get(object.name);
      if (globalFunc === object) {
        return `@@NativeFunc|${object.name}`;
      }
    }
    return `@@Func|${object.toString()}`;
  }
  if (object instanceof Date) {
    return `@@Date|${object.toISOString()}`;
  }
  if (object instanceof Error) {
    return `@@Error|${object.message}`;
  }
  if (typeof(object) === 'object') {
    if (seenObjects.has(object)) {
      return `Ref(${seenObjects.get(object)})`;
    }
    const objPath = path || `Root`;
    seenObjects.set(object, objPath);
    const objCopy = Array.isArray(object) ? [] : {};
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        objCopy[key] = serialize(object[key], seenObjects, `${objPath}.${key}`);
      }
    }
    return JSON.stringify(objCopy);
  }


  return JSON.stringify(object);
}


function deserialize(string, createdObjects = new Map(), path = '') {
  let globalFuncMap = retrieveGlobalFuncMap(globalThis);

  if (string === '_@_undefined_@_' ) {
    return undefined;
  }
  if (string === '_@_null_@_') {
    return null;
  }
  // native function
  if (string.startsWith('@@NativeFunc')) {
    const keyArr = string.split('|').filter((e) => e != '');
    const key = keyArr[keyArr.length - 1];
    return globalFuncMap.get(key);
  }
  // custom function
  if (string.startsWith('@@Func')) {
    const keyArr = string.split('|').filter((e) => e != '');
    const funcString = keyArr[keyArr.length - 1];
    return new Function('return ' + funcString)();
  }
  // Date
  if (string.startsWith('@@Date')) {
    const keyArr = string.split('|').filter((e) => e != '');
    const dateString = keyArr[keyArr.length - 1];
    return new Date(dateString);
  }
  // Error
  if (string.startsWith('@@Error')) {
    const keyArr = string.split('|').filter((e) => e != '');
    const message = keyArr[keyArr.length - 1];
    return new Error(message);
  }
  if (string.startsWith('Ref(') && string.endsWith(')')) {
    const refPath = string.slice(4, -1);
    if (createdObjects.has(refPath)) {
      return createdObjects.get(refPath);
    }
  }
  const obj = JSON.parse(string);
  if (typeof(obj) !== 'object') {
    return obj;
  }
  const objPath = path || `Root`;
  createdObjects.set(objPath, obj);
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      obj[key] = deserialize(obj[key], createdObjects, `${objPath}.${key}`);
    }
  }
  return obj;
}


module.exports = {
  serialize: serialize,
  deserialize: deserialize,
};

