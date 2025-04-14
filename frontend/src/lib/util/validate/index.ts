import type { AnyFieldApi } from '@tanstack/react-form'

export type ShowValidationError = (field: AnyFieldApi) => boolean
export type GetValidationErrorMessage = (field: AnyFieldApi) => string

export const showValidationError:ShowValidationError= (field) => {
  return Boolean(field.state.meta.errors.length && field.state.meta.errors[0].length > 3)
}
export const getValidationErrorMessage:GetValidationErrorMessage = (field) => field.state.meta.errors.join(',')
//eu sei q so ta pegando o primeiro eq isso limita a mostragem de erros mas ja gastei mt tempo nessa tela