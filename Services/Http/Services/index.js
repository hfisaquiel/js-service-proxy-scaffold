import Auth from './auth'
import Catalog from './catalog'
import Profile from './profile'
import Shipping from './shipping'

import { ExternalClient, PrivateClient, PublicClient } from '../Clients'

export const ServicesList = {
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

/**
 *
 * @param {String} name service item name
 * @returns {Proxy}
 */
export const Services = (name) => new Proxy(
  ServicesList[name],
  servicesHandler
)

export default Services
