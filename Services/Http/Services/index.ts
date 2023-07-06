import Auth from './auth'
import Catalog from './catalog'
import Profile from './profile'
import Shipping from './shipping'

import { ExternalClient, PrivateClient, PublicClient } from '../Clients'

import { ServiceEndpoints, Services as ServicesType , ServicesListType} from './types'

export const ServicesList: ServicesListType = {
  auth: {
    client: PublicClient,
    service: Auth
  },
  catalog: {
    client: PublicClient,
    service: Catalog
  },
  profile: {
    client: PrivateClient,
    service: Profile
  },
  shipping: {
    client: ExternalClient,
    service: Shipping
  }
}

const servicesHandler = {
  get: (endpoints, endpoint) => {
    if (!(endpoint in endpoints)) {
      throw new ReferenceError('Invalid called action')
    }

    const { service, client } = endpoints[endpoint]

    return (param, options) => service(client, param, options)
  }
}

declare global  {
  interface ProxyConstructor {
      new <TSource extends object, TTarget extends ServiceEndpoints>(
          target: TSource,
          handler: ProxyHandler<TSource>
        ): TTarget;
  }
}


/**
 *
 * @param {String} name service item name
 */
export const Services = (name: ServicesType): ServiceEndpoints => new Proxy<ServicesListType[ServicesType], ServiceEndpoints>(
  ServicesList[name],
  servicesHandler
)

export default Services
