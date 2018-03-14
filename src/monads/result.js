export const Invalid = value => ({
  chain: f => f(value),
  map: _ => Invalid(value),
  fold: f => f(value)
})

export const Valid = value => ({
  chain: f => f(value),
  map: f => Valid(f(value)),
  fold: (_, f) => f(value)
})

const Result = fn => fn(Invalid, Valid)

Result.of = Valid
Result.Valid = Valid
Result.Invalid = Invalid

export default Result
