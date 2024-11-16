declare interface ValidationData {
  value: any
  rule?: Validator
  invalid?: boolean
}

declare type Validator = (value: string) => ValidatateResult

declare interface ValidatateResult {
  invalid: boolean
  message: string
}

declare type ValidateCallback = (valid: boolean, message: string) => void
