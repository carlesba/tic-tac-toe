
export const Failure = value => ({
  chain: f => f(value),
  concat: v => Failure([].concat(value).concat(v.errors)),
  errors: [].concat(value),
  map: _ => Failure(value),
  fold: f => f(value)
})

export const Success = value => ({
  chain: f => f(value),
  concat: v => v.errors ? Failure.concat(v) : Success(v),
  map: f => Success(f(value)),
  fold: (_, f) => f(value)
})

const Validation = fn => fn(Failure, Success)

Validation.of = Success
Validation.Success = Success
Validation.Failure = Failure

export default Validation
