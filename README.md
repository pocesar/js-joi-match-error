[![Build Status](https://travis-ci.org/pocesar/js-joi-match-error.svg?branch=master)](https://travis-ci.org/pocesar/js-joi-match-error)
[![npm version](https://badge.fury.io/js/joi-match-error.svg)](https://badge.fury.io/js/joi-match-error)

# js-joi-match-error

A simple (and convenient) wrapper for passing to Joi.error()

## Why?

Joi makes custom validation errors really really really really hard. There's no "catch all", there's no way to do one `error()`
for every new object you create. So it's best to just try and match them like a switch statement.

## How?

```
npm i joi-match-error
```

```js
import Joi from 'joi'
import { MatchError } from 'joi-match-error'

const MySchema = Joi.string().required().min(10).max(15).label('Some string').error(
  MatchError({
    'any.required': 'You must provide Some String',
    'string.min': (err) => (`${err.context.label} needs at least ${err.context.limit} chars`),
    'string.max': (err) => (`${err.context.label} needs to be at most ${err.context.limit} chars`),
    fallback: 'Invalid string'
  })
)

MySchema.validate('asdf').error // yields "Some string needs at least 10 chars"
```

You may pass a custom error constructor as the second parameter, so you may wrap the joi `ValidationError` into something else (happens after the matching, and should return an instance of `Error`):

```js
MatchError({
  fallback: (err) => (err.message),
}, (originalErrors, matched, matchedIndex) => {
  // originalErrors = Array<ValidationErrorItem>
  // Matched = resulting string, in that case, originalErrors[0].message
  // matchedIndex = index from the errors array
  return new MyCustomError(matched, 400, originalErrors[matchedIndex])
})
```

Why would you do that? So you can, for example, when returning an error to the user, be opaque with no
further stacktrace info, but still useful to log the whole error on the server-side (good practices!)

If you need a generic (english only) wrapper for all your errors, it comes as `InvalidLabel` helper (just so you don't get "child fails blah blah")

```js
import { InvalidLabel, MatchError } from 'joi-match-error'

MatchError({
  fallback: InvalidLabel() // returns something like the template `${err.context.label} is invalid`
})

MatchError({
  fallback: InvalidLabel('é inválido') // returns something like the template `${err.context.label} é inválido`
})
```

Then, your custom Joi constructor might look like this:

```js
import { MatchError, InvalidLabel } from 'joi-match-error'
import Joi from 'joi'

/**
 * assuming schema is a { field: Joi.[something](), field2: Joi.[another]() }
 **/
export const MyJoi = (schema) => {
  return Joi.object(
    Object.keys(schema).reduce((obj, key) => {
      obj[key] = schema[key].error(
        MatchError({
          fallback: InvalidLabel()
        })
      )
      return obj
    }, {})
  )
}
```

## Caveats

* You need to understand inner workings of Joi to be able to match the correct errors (kinda time consuming), such as the Joi Validation error types like `number.base`, or `string.creditCard`. If it helps, look at [Joi codebase](https://github.com/hapijs/joi/blob/master/lib/language.js) (unless you're using Typescript or JS with VSCode, you get all the existing keys for free :sparkling_heart:)
* Nested errors are not supported at top level (must write down to the level you want the error on)
* Hard to do i18n, unless you wrap the wrapper (yo dawg)
* Returns only the first error, since Joi returns an array of errors even for a single one, so it's brute force-y

## License

MIT
