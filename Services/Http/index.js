import Services, { ServicesList } from './Services'

const httpHandler = {
  get: (services, calledService) => {
    if (calledService === '$$typeof') {
      return null
    }

    if (!(calledService in services)) {
      throw new ReferenceError('Invalid called service')
    }

    return Services(calledService)
  }
}

export const Http = new Proxy(ServicesList, httpHandler)

export default Http
