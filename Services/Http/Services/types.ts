import { AxiosInstance } from "axios"

export type Services = 'auth' | 'catalog' | 'profile' | 'shipping'

export type ResponseBag = {
  status: number,
  statusText: string,
  data: object | string | number,
  message: string,
  success: boolean
  meta: [] | undefined
}

export type ErrorBag = {
  status: number,
  statusText: string,
  message: string,
  errors: [] | undefined,
  success: boolean
}

type AuthEndpoints = {
  create: Response,
  login: Response,
  recover: Response,
  reset: Response,
}

type CatalogEndpoints = {
  products: Response,
  getProduct: Response,
  getProductThumb: Response,
  getProductImages: Response,
}

type ProfileEndpoints = {
  anonimize: Response,
  changePassword: Response,
  createAddress: Response,
  getProfile: Response,
  updateAddress: Response,
}

type ShippingEndpoints = {
  getAddressByZipCode: Response,
  getFleightFromZipCode: Response,
  sendProductTrack: Response,
}

type Response = () => ResponseBag | ErrorBag

export type ServiceEndpoints = {
  [endpoint: string]: Response
}

export type ConnectedService = {
  client: AxiosInstance,
  service: ServiceEndpoints
}

export type ServicesListType = {
  [service: string]: ConnectedService
}

type ServicesInstances<Type> = {
  [Property in keyof Type]: Type[Property];
};

type ServicesTypes ={
  'auth': AuthEndpoints,
  'catalog': CatalogEndpoints,
  'profile': ProfileEndpoints,
  'shipping': ShippingEndpoints,
}

export type ServicesInterface = ServicesInstances<ServicesTypes>

export interface Endpoint {

}
