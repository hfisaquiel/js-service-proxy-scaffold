const getAddressByZipCode = async (Client, zipcode) => Client
  .get(`https://correios.com.br/api/v1/consulta/cep/${zipcode}`,
    {})

const getFleightFromZipCode = async (Client, zipcode, packInfo) => Client
  .post(`https://awesomeflieigthservice.com.br/api/v3.5/calculate/zip/${zipcode}`, packInfo)

// Tracking
const sendProductTrack = (Client, productId, data) => Client.post(`catalog/product/${productId}/track`, data)

export default {
  getAddressByZipCode,
  getFleightFromZipCode,
  sendProductTrack
}
