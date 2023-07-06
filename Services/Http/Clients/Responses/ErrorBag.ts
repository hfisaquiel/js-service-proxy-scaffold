import { ErrorBag as ErrorBagType } from "../../Services/types"

/**
 * Return a identified payload
 */
const ErrorBag = ({ response }): ErrorBagType => ({
  status: response.status,
  statusText: response.statusText,
  message: response.data.message || '',
  errors: response.data.errors || undefined,
  success: false
})

export default ErrorBag
