const getAddressByZipCode = async (Client, zipcode) => Client
  .get(`https://correios.com.br/api/v1/consulta/cep/${zipcode}`,
    {})

// Tracking
const sendProductTrack = (Client, productId, data) => Client.post(`catalog/product/${productId}/track`, data)

export default {
  getAddressByZipCode,
  sendProductTrack
}
