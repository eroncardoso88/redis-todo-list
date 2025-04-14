import { getValidationErrorMessage, showValidationError } from '@/src/lib/util/validate'
import type { AnyFieldApi } from '@tanstack/react-form'

export function FieldInfo({ field }: { field: AnyFieldApi }) {
  console.log('no field found! ', field)
  if (!field) {
    console.log('no field found! ', field)
    return <></>
  }
  if (!field.state) {
    console.log('no field state found! ', field)
    return <></>
  }
  return (
    <div className={"min-h-4"}>
      {showValidationError(field) ? (
        <em className="text-[#990000] leading-0.5 text-xs">{getValidationErrorMessage(field)}</em>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </div>
  )
}
