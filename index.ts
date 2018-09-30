import { ValidationErrorItem, ValidationErrorFunction } from 'joi'

export const InvalidLabel = (text: string = '') => (err: ValidationErrorItem) => `${err.context.label} ${text ? text : 'is invalid'}`

export type ErrorMapFunction = (err: ValidationErrorItem) => string
export type ErrorMapValue = string | ErrorMapFunction

export type ErrorMap = {
  [index: string]: ErrorMapValue
  'any.unknown'?: ErrorMapValue
  'any.invalid'?: ErrorMapValue
  'any.empty'?: ErrorMapValue
  'any.required'?: ErrorMapValue
  'any.allowOnly'?: ErrorMapValue
  'any.default'?: ErrorMapValue
  'alternatives.base'?: ErrorMapValue
  'alternatives.child'?: ErrorMapValue
  'array.base'?: ErrorMapValue
  'array.includes'?: ErrorMapValue
  'array.includesSingle'?: ErrorMapValue
  'array.includesOne'?: ErrorMapValue
  'array.includesOneSingle'?: ErrorMapValue
  'array.includesRequiredUnknowns'?: ErrorMapValue
  'array.includesRequiredKnowns'?: ErrorMapValue
  'array.includesRequiredBoth'?: ErrorMapValue
  'array.excludes'?: ErrorMapValue
  'array.excludesSingle'?: ErrorMapValue
  'array.min'?: ErrorMapValue
  'array.max'?: ErrorMapValue
  'array.length'?: ErrorMapValue
  'array.ordered'?: ErrorMapValue
  'array.orderedLength'?: ErrorMapValue
  'array.ref'?: ErrorMapValue
  'array.sparse'?: ErrorMapValue
  'array.unique'?: ErrorMapValue
  'boolean.base'?: ErrorMapValue
  'binary.base'?: ErrorMapValue
  'binary.min'?: ErrorMapValue
  'binary.max'?: ErrorMapValue
  'binary.length'?: ErrorMapValue
  'date.base'?: ErrorMapValue
  'date.format'?: ErrorMapValue
  'date.strict'?: ErrorMapValue
  'date.min'?: ErrorMapValue
  'date.max'?: ErrorMapValue
  'date.less'?: ErrorMapValue
  'date.greater'?: ErrorMapValue
  'date.isoDate'?: ErrorMapValue
  'date.timestamp.javascript'?: ErrorMapValue
  'date.timestamp.unix'?: ErrorMapValue
  'date.ref'?: ErrorMapValue
  'function.base'?: ErrorMapValue
  'function.arity'?: ErrorMapValue
  'function.minArity'?: ErrorMapValue
  'function.maxArity'?: ErrorMapValue
  'function.ref'?: ErrorMapValue
  'function.class'?: ErrorMapValue
  'lazy.base'?: ErrorMapValue
  'lazy.schema'?: ErrorMapValue
  'object.base'?: ErrorMapValue
  'object.child'?: ErrorMapValue
  'object.min'?: ErrorMapValue
  'object.max'?: ErrorMapValue
  'object.length'?: ErrorMapValue
  'object.allowUnknown'?: ErrorMapValue
  'object.with'?: ErrorMapValue
  'object.without'?: ErrorMapValue
  'object.missing'?: ErrorMapValue
  'object.xor'?: ErrorMapValue
  'object.or'?: ErrorMapValue
  'object.and'?: ErrorMapValue
  'object.nand'?: ErrorMapValue
  'object.assert'?: ErrorMapValue
  'object.rename.multiple'?: ErrorMapValue
  'object.rename.override'?: ErrorMapValue
  'object.rename.regex.multiple'?: ErrorMapValue
  'object.rename.regex.override'?: ErrorMapValue
  'object.type'?: ErrorMapValue
  'object.schema'?: ErrorMapValue
  'number.base'?: ErrorMapValue
  'number.min'?: ErrorMapValue
  'number.max'?: ErrorMapValue
  'number.less'?: ErrorMapValue
  'number.greater'?: ErrorMapValue
  'number.float'?: ErrorMapValue
  'number.integer'?: ErrorMapValue
  'number.negative'?: ErrorMapValue
  'number.positive'?: ErrorMapValue
  'number.precision'?: ErrorMapValue
  'number.ref'?: ErrorMapValue
  'number.multiple'?: ErrorMapValue
  'number.port'?: ErrorMapValue
  'string.base'?: ErrorMapValue
  'string.min'?: ErrorMapValue
  'string.max'?: ErrorMapValue
  'string.length'?: ErrorMapValue
  'string.alphanum'?: ErrorMapValue
  'string.token'?: ErrorMapValue
  'string.regex.base'?: ErrorMapValue
  'string.regex.name'?: ErrorMapValue
  'string.regex.invert.base'?: ErrorMapValue
  'string.regex.invert.name'?: ErrorMapValue
  'string.email'?: ErrorMapValue
  'string.uri'?: ErrorMapValue
  'string.uriRelativeOnly'?: ErrorMapValue
  'string.uriCustomScheme'?: ErrorMapValue
  'string.isoDate'?: ErrorMapValue
  'string.guid'?: ErrorMapValue
  'string.hex'?: ErrorMapValue
  'string.hexAlign'?: ErrorMapValue
  'string.base64'?: ErrorMapValue
  'string.dataUri'?: ErrorMapValue
  'string.hostname'?: ErrorMapValue
  'string.normalize'?: ErrorMapValue
  'string.lowercase'?: ErrorMapValue
  'string.uppercase'?: ErrorMapValue
  'string.trim'?: ErrorMapValue
  'string.creditCard'?: ErrorMapValue
  'string.ref'?: ErrorMapValue
  'string.ip'?: ErrorMapValue
  'string.ipVersion'?: ErrorMapValue
  'symbol.base'?: ErrorMapValue
  'symbol.map'?: ErrorMapValue
  fallback?: ErrorMapValue
}

export type ErrorCallback = (originalErrors: ValidationErrorItem[], matched: string, matchedIndex: number) => Error

export const MatchError = (errorMap: ErrorMap, errorConstructor?: ErrorCallback): ValidationErrorFunction => {
  return (errors: ValidationErrorItem[]) => {
    const fallback: ErrorMapValue | undefined = errorMap.fallback
    let index: number = 0

    const message = (
      errors.reduce((current, err, _index) => {
        const mapped = errorMap[err.type]

        if (typeof mapped === 'function') {
          index = _index
          return mapped(err)
        } else if (typeof mapped === 'string') {
          index = _index
        }

        return mapped ? mapped : current
      }, '')
      ||
      (
        typeof fallback === 'function' ? (index = 0,fallback(errors[index])) : (fallback)
      )
      ||
      (
        index = 0,errors[index].message
      )
    )

    return (errorConstructor ? errorConstructor(errors, message, index) : new TypeError(message))
  }
}