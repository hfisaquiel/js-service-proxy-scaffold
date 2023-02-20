const catalogURI = 'catalog/product'

// Products
const products = (Client) => Client.get(`${catalogURI}/all`)
const getProduct = (Client, id) => Client.get(`${catalogURI}/${id}`)

// ProductImages
const getProductThumb = (Client, productId, imageId) => Client.get(`${catalogURI}/${productId}/picture/${imageId}`)
const getProductImages = (Client, id) => Client.get(`${catalogURI}/${id}/picture`)

export default {
  products,
  getProduct,
  getProductThumb,
  getProductImages
}
