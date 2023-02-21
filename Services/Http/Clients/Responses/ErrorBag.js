/**
 * Return a identified payload
 * @param {AxiosError} error the axios error object payload
 */
const ErrorBag = ({ response }) => ({
  status: response.status,
  statusText: response.statusText,
  message: response.data.message || '',
  errors: response.data.errors || undefined,
  success: false
})

export default ErrorBag
