import test from 'ava'
import Joi from 'joi'
import { MatchError, InvalidLabel } from './index'

test('fallback', (t) => {
  t.is(
    Joi.string().label('alohomora').error(
      MatchError({
        fallback: (err) => `${err.context.label} invalid`
      })
    ).validate('').error.message,
    'alohomora invalid'
  )
})

test('invalid label', (t) => {
  t.is(
    Joi.string().label('t').required().error(MatchError({ fallback: InvalidLabel() })).validate('').error.message,
    't is invalid'
  )

  t.is(
    Joi.string().label('t').required().error(MatchError({ fallback: InvalidLabel('é inválido') })).validate('').error.message,
    't é inválido'
  )
})

test('matching', (t) => {
  const j = Joi.string().required().max(5).empty('').min(3).label('asdf').error(
    MatchError({
      'any.required': 'asdf',
      'string.min': (err) => (err.context.limit),
      fallback: 'big'
    })
  )

  t.is(
    j.validate('').error.message,
    'asdf'
  )

  t.is(
    j.validate('12').error.message,
    '3'
  )

  t.is(
    j.validate('1'.repeat(10)).error.message,
    'big'
  )
})

test('no match / fallback', (t) => {
  const j = Joi.number().less(2).integer().label('j').required().error(
    MatchError({
      'number.max': (err) => `${err.context.max}`
    })
  )

  t.is(
    Joi.validate(3.5, j).error.message,
    ''
  )
})

test('custom error', (t) => {
  t.plan(5)
  let err

  const j = Joi.string().regex(/ab/).error(
    MatchError({
      fallback: 'hello'
    }, (original, matched, index) => {
      t.is(index, 0)
      t.is(matched, 'hello')
      t.true(typeof original === 'object' && (original[0] as any)['isJoi'])
      err = new ReferenceError(matched)
      return err
    })
  )

  const validation = j.validate('')
  t.is(
    validation.error.message,
    'hello'
  )

  t.true(
    validation.error instanceof ReferenceError
  )
})