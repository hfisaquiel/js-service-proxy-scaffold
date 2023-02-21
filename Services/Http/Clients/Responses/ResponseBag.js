/**
 * Prepared Bag success response
 * @param {AxiosResponse} response payload result object
 */
const ResponseBag = ({ statusText, status, data = {}, config }) => {
  return {
    status,
    statusText,
    data: config.responseType === 'json' ? data.data : data,
    message: data.message ?? '',
    success: status >= 200 && status < 300,
    meta: data.meta ?? undefined
  }
}

export default ResponseBag
