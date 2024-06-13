import _object from './object'
import _string from './string'
import _array from './array'
import _boolean from './boolean'
import _integer from './integer'
import _number from './number'
const TYPE_NAME = ['String', 'Integer', 'Long', 'Double', 'Float', 'Boolean', 'Object', 'List', 'DateTime', 'Date', 'BigDecimal']

const TYPE = {
  Object: _object,
  String: _string,
  List: _array,
  Boolean: _boolean,
  Integer: _integer,
  Number: _number,
}
export { TYPE, TYPE_NAME }
