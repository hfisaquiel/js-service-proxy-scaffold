# Service scaffold

This project create a structured idea for a Axios implementation and
plus a Log single service channel

## Purpose

When implements a layer with connection at some API`s service, evenly on sistems who
use one or more service, behind and/or not a secure info endpoint based on authentication
and a external apis like package calculations or even a log repository, the logic can
be extensive em each entrypoint of the application.

This scaffold brings a idea how to implements a Service Layer that can presents a simplified
easy-to-use (and reuse) at a centralized place.

```js
import { Http } from "Services";

// ...
const productData = Http.catalog.getProduct(productId);
const userData = Http.profile.getProfile(userId);
// ...
```

## Structure

This main currently scaffold idea has a path like
`Services > Http > Services > service.js > endpoint()`, who will treat bellow.

### Dependencies

Axios [Package](https://www.npmjs.com/package/axios) Promise based HTTP client for the
browser and node.js

Cookie Handler [Package](https://www.npmjs.com/package/cookie-handler) Handle cookies
in a easy way. Just for example implements on Public case

### Deep Folder Structure

```dir
┣ Data/
┃ ┗ user.js
┣ Helpers/
┃ ┗ functions.js
┣ Services/
┃ ┣ Http/
┃ ┃ ┣ Clients/
┃ ┃ ┃ ┣ External.js
┃ ┃ ┃ ┣ Private.js
┃ ┃ ┃ ┣ Public.js
┃ ┃ ┃ ┗ index.js
┃ ┃ ┣ Services/
┃ ┃ ┃ ┣ auth.js
┃ ┃ ┃ ┣ catalog.js
┃ ┃ ┃ ┣ index.js
┃ ┃ ┃ ┣ profile.js
┃ ┃ ┃ ┗ shipping.js
┃ ┃ ┗ index.js
┃ ┣ Log/
┃ ┃ ┗ index.js
┃ ┗ index.js
┣ .eslintrc.json
┣ .gitignore
┣ package.json
┗ yarn.lock
```

## The problematic

Using Axios on each necessary request page, in a verbose form would like:

```js
import { Axios } from 'axios'

const async function createAccount(data) {
    const reponseData = await Axios.request(
        'post',
        'https://siterequest.com/api/v1/user/auth/register',
        data
    )

    return reponseData.data
}

// ...
createAccount({
    name: 'Jhon Doe',
    username: 'jhondoe@anonmail.com',
    password: 'user123'
})
```

So, if you need login to get some secure profile data, multiples instances needed to be created

```js
import { Axios } from 'axios'

const async function makeLogin(data) {
    const reponseData = await Axios.post(
        'https://siterequest.com/api/v1/auth/login',
        data
    )

    return reponseData.data
}

const async function getUserProfile(userId, accessToken) {
    const reponseData = await Axios.get(
        `https://siterequest.com/api/v1/user/profile/${userId}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    )

    return reponseData.data
}

// ...
const loginData = await makeLogin({
    username: 'jhondoe@anonmail.com',
    password: 'user123'
})

const userData = getUserProfile(userId, loginData.access_token)
```

Note: in each request, are requestes to a same site (`https://siterequest.com/api/v1/`).
If need a request to create a address for the same user, is need to `POST` to another
endpoint like `https://siterequest.com/api/v1/${userId}/address` and put again a generated
on login response the `access_token` (like JWT) attribute in headers for this called
endpoint.

The cost to create a instance, passing enomerous parameters is high when system increase.
Centralize make possible implements a repeated logic in a once `Axios` instance. In another
terms, split layers with single responsabilities, make the code better to maintainance
and scale.

Using instance enable a reuse, with less code :

```js
import { Axios } from 'axios'

// ...
const { accessToken } = await makeLogin({...})

// accessToken can loaded from memory, local database, Storage, ...
const AxiosInstance = Axios.create({
  baseURL: 'https://siterequest.com/api/v1/',
  responseType: 'json',
  headers: {
    Authorization: `Bearer ${accessToken}`
  }
})

const async function getUserProfile(userId) {
    const { data } = await AxiosInstance.get(`user/profile/${userId}`)
    return data
}

const async function createAddress(userId, addressData) {
    const { data } = await AxiosInstance.post(`user/profile/${userId}`, addressData)
    return data
}

// In page who use then
const userData = getUserProfile(userId)
const newAddressData = createAddress(userId, {street: '...', zipCode: '...'})
```

## How this scaffold wish to work

It`s structured on a single place, based on convenience and similiarity like for logged
user only or absent user, or a public entrypoiny like a search endpoint or calculate
fleight.

```
┣ Services/
┃ ┣ Http/
┃ ┃ ┣ Services/
┃ ┃ ┃ ┣ auth.js
┃ ┃ ┃ ┃ ┣ create()
```

Using the same folder structure on a regular use of Axios instance based, on at a Page
who need show the logged _user info_, some _product_ and calculate a _fleight_, the calls
would be like:

```jsx
// Views/Product/AwesomeProductPage.jsx
import { getProfile } from "Services/Http/Services/profile";
import { getProduct, getProductThumb } from "Services/Http/Services/catalog";
import { getFleightFromZipCode } from "Services/Http/Services/shipping";

// ...
```

Note that can not be needed to know the endpoints useds in this page, or even the `access_token`
or even who is the service that will calculate the freight, just call a function on `Services\Http\Services\<context>`.
Inside each `<context>` a `Axios` instance is created, and if need change the library
who is used to make Http request, enough change the library inside Context, even add
a param.

But, still yet need call various imports, but this scaffold propose a some diferent
centralized approach.

## How to use

```js
import { Http } from "Services";

// ...
const productData = Http.catalog.getProduct(productId);
// ...
```

The magic of this are the use of a [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) instance.
The Proxy, permits intercept a object like, making some other things when call, like inject a
parameter or another object to object/function/method destiny.
When call `Http.catalog` this will pass the called to a Proxy who know the endpoints
plus the instance Client of Axios prepared to `Http\Services\catalog` context.

```js
// Services\Http\Services\index.js
ServicesList = {
  catalog: {
    client: PublicClient,
    service: Catalog
  }
  ...
}
```

On folder `Services\Http\Clients` has 3 diferents contexts of Axios instance:

> _External_ is use to call not related site API`s, like a Freight supplier
>
> _Public_ to make requests for site related "open" apis urls
>
> _Private_ will be used to make requests for secure endpoints who need a authenticated
> user info

Another `Client` can created for diferent context, for example a marketplace that need
calculate a freight in another service for a specific seller.

This is the use calling from `Proxy`

```jsx
// Views/Product/AwesomeProductPage.jsx
import { useEffect, useState} from 'react'
import { Http } from 'Services'

// React style
const AwesomeProductPage = (productId, userId) => {
    const { user, setUser } = useState({})
    const { product, setProduct } = useState({})
    const { fleight, setFleight } = useState('0.00')

    useEffect(() => {
        const getData = async () => {

            const { data: userData } = await Http.profile.getProfile(userId)
            setUser(userData)

            const { data: productData } = await Http.catalog.getProduct(productId)
            const { data: productImageThumb } = await Http.catalog.getProductThumb(productId, productData.thumbImageId)
            prductData.image = productImageThumb
            setProduct(productData)

            const fleightService = (productData.seller === 'xpto')
            ? Http.specialXptoShipping
            : Http.shipping

            const { data: fleightData } await fleightService
                .getFleightFromZipCode(userData.zipCode, productData.packagingInfo)

            setFleight(fleightData)
        }

        getData()

        return () => {
            setUser({})
            setProduct({})
            setFleight('0.00')
        }
    }, [productId, userId])

    return (
        <div class="main">
            <div class="header">
                <span>Olá, {user.name}</span>
            </div>
            <div class="product">
                <p>Name: {product.name}</p>
                <p><img src={product.image} /></p>
                <p>Description: {product.description}</p>
                <p>Price: {product.price}</p>
                <p>Fleight: {fleight}</p>
            </div>
        </div>
    )
}

export dafault AwesomeProductPage
```
