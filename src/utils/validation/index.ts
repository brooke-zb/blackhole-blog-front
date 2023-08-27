function validate(data: Record<string, ValidationData>, callback?: ValidateCallback) {
  let isValid = true
  const messages: string[] = []

  // 遍历数据
  for (const key in data) {
    if (data[key].rule && data[key].invalid !== undefined) {
      // 验证数据
      const result = data[key].rule!(data[key].value)
      data[key].invalid = result.invalid

      if (data[key].invalid) {
        isValid = false
        messages.push(result.message)
      }
    }
  }
  if (callback) {
    callback(isValid, messages.join('\n'))
  }
}

export { validate }
