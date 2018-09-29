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
    'string.min': (err) => (`${err.context.label} needs at least ${err.context.limit} chars`),
    'string.max': (err) => (`${err.context.label} needs to be at most ${err.context.limit} chars`),
    fallback: 'Invalid string'
  })
)

MySchema.validate('asdf').error // yields "Some string needs at least 10 chars"
```

You may pass a custom error constructor as the second parameter, so you may wrap the joi "ValidationError" into something else (happens after the matching, and should return an instance of Error):

```js
MatchError({
  fallback: (err) => (err.message),
}, (originalError) => {
  return new MyCustomError(originalError.message, 400, originalError)
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
```

## Caveats

* You need to understand inner workings of Joi to be able to match the correct errors (kinda time consuming), such as the Joi Validation error types like `number.base`, or `string.creditCard`. If it helps, search Joi codebase for `createError`
* Nested errors are not supported at top level (must write down to the level you want the error on)
* Hard to do i18n, unless you wrap the wrapper (yo dawg)
* Returns only the first error, since Joi returns an array of errors even for a single one.

## License

MIT
