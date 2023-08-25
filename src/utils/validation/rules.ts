function email(message: string) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  return (value: string) => ({
    invalid: !re.test(String(value)),
    message,
  })
}

function notEmpty(message: string) {
  return (value: string) => ({
    invalid: !(value.length > 0),
    message,
  })
}

function isEmpty(message: string) {
  return (value: string) => ({
    invalid: value.length > 0,
    message,
  })
}

function minLength(min: number, message: string) {
  return (value: string) => ({
    invalid: value.length < min,
    message,
  })
}

function maxLength(max: number, message: string) {
  return (value: string) => ({
    invalid: value.length > max,
    message,
  })
}

function betweenLength(min: number, max: number, message: { min: string; max: string }) {
  return (value: string) => {
    if (value.length < min) {
      return {
        invalid: true,
        message: message.min,
      }
    }
    else if (value.length > max) {
      return {
        invalid: true,
        message: message.max,
      }
    }
    return {
      invalid: false,
      message: '',
    }
  }
}

function or(...validators: Validator[]) {
  return (value: string) => {
    const results = validators.map(validator => validator(value))
    const valid = results.some(result => !result.invalid)
    const message = results.find(result => result.invalid)?.message || ''
    return {
      invalid: !valid,
      message,
    }
  }
}

function and(...validators: Validator[]) {
  return (value: string) => {
    const results = validators.map(validator => validator(value))
    const valid = results.every(result => !result.invalid)
    const message = results.find(result => result.invalid)?.message || ''
    return {
      invalid: !valid,
      message,
    }
  }
}

export {
  email,
  notEmpty,
  isEmpty,
  minLength,
  maxLength,
  betweenLength,
  or,
  and,
}
