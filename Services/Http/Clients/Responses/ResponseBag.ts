import { AxiosResponse } from "axios"
import { ResponseBag as ResponseBagType } from "../../Services/types"

/**
 * Prepared Bag success response
 */
const ResponseBag = ({ statusText, status, data = {}, config }: AxiosResponse): ResponseBagType => ({
  status,
  statusText,
  data: config.responseType === 'json' ? data.data : data,
  message: data.message ?? '',
  success: status >= 200 && status < 300,
  meta: data.meta ?? undefined
})

export default ResponseBag
