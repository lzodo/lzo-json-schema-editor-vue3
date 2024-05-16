import _object from './object'
import _string from './string'
import _array from './array'
import _boolean from './boolean'
import _integer from './integer'
import _number from './number'
const TYPE_NAME = ['String', 'Number', 'Integer', 'Object', 'Array', 'Boolean']

const TYPE = {
  Object: _object,
  String: _string,
  Array: _array,
  Boolean: _boolean,
  Integer: _integer,
  Number: _number,
}
export { TYPE, TYPE_NAME }
