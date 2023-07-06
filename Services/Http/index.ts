import Services, { ServicesList } from './Services'
import {
  Services as ServicesType,
  ServiceEndpoints,
  ServicesListType,
  ServicesInterface
} from './Services/types'

const httpHandler = {
  get: (services: ServicesListType, calledService: ServicesType | '$$typeof'): ServiceEndpoints|null => {
    if (calledService === '$$typeof') {
      return null
    }

    if (!(calledService in services)) {
      throw new ReferenceError('Invalid called service')
    }

    return Services(calledService)
  }
}

declare global  {
  interface ProxyConstructor {
      new <TSource extends object, TTarget extends ServicesInterface>(target: TSource, handler: ProxyHandler<TSource>): TTarget;
  }
}

export const Http = new Proxy<ServicesListType, ServicesInterface>(ServicesList, httpHandler)

export default Http
