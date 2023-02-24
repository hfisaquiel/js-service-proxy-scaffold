# Service scaffold

This project create a structured idea for a Axios implementation and
plus a Log single service channel

## Purpose

When implements a layer with connection at some API`s service, evenly on sistems who
use one or more service, behind and/or not a secure info endpoint based on authentication
and a external apis like package calculations or even a log repository, the logic can
be extensive em each entrypoint of the application.

This scaffold brings various concepts for how to implements a Service Layer that can
presents a simplified easy-to-use (and reuse) at a centralized place.

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

## Presenting Service Layer

When navigate on codebase, you will see a Log and Http placed at Service folder. Why?

The central ideia is create a Service layer instead a Helper/Utils approach.

Services is a layer who send/receive info data to external resources and do side-effects
who will not be the main rules of a application/screen (business rules). Is just a provider
that can be replaced for other, with less or no one core business change.

In practice, if a parameter change, but not the behavior, the Service layer can change
the data without change the behavior of the page, and keep all the places that use the
same provider info updated.

Adding this turn possible monitoring the transacted information or do a side-effect,
as notify another provider, log info or split/join info to more then one API, for example
make a "login" in a service API before get/send some payload.

It's different from the [`Helpers`](Helpers/) folder layer. The Helpers has not a side-effect
just process the info who is passed as parameter, or get a static data-object, or on max
prepare a Object on easy mode. All the transacion will be handled by user (even other code)
commands.

Other present layer, is [`Data`](Data/). This layer has a behaviour as a Repository.
The main application can't know how data are persisted, just use and place at the screen
or ask the user some new data. The repository `Data` has a [example](Data/user.js) for
User data, who persist in browser `Storage` and can be accessible even the page reloads.
The pages don`t need acess the `Storage`, transform the data for after use and persist
changes, the Repository layer turns possible reuse in various pages or areas places.

## The problematic of Requests

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

### The responses

Two basic Responses Bag object was createad: `ResponseBag` and `ErrorBag`.

Using a object bag, make the code assertive how handle the responded request, and assure
the attributes who will return after a request are made.

When a Axios Http Request result in a status diferent from 2XX (default), will Throw
a Exception and can handled by a `try/catch` or a `then/catch` with a diferent side-effect.
The responses for both (error/success) are diferent, using the interceptos permit handle
the reponses, preventing crashes in other than 2XX status condition.

For example to get status on success is:

```json
 {
    "status": 200,
    "data": {
        "data": [...],
        "message": "Presents list with success"
    }
 }
```

To get status on error:

```json
{
    "response": {
        "status": 200,
        "data": {
            "data": [...],
            "message": "Presents list with success"
        }
    }
}
```

In Bag's proposition, the commons statuses and data, as well errors too, will be present
at first level in returned object. The `error`and`data` attributes, will not be present
at the same time:

Returned errors result in

```js
{
  status: Number, // HTTP Status code (5xx)
  statusText: String, // The status mesage description (eg. Server error)
  message: String, // The returned API message
  errors: Array[String], // The error list from server response (eg. Form inputs validation)
  success: Boolean // Always false
}
```

Success result, generally 2XX response (can changed in Axios instance creation):

```js
{
  status: Number, // HTTP Status code (2xx)
  statusText: String, // The status mesage description (eg. OK)
  message: String, // The returned API message
  data: Object|Array|String, // The responded data from server
  success: Boolean // Generally true
}
```

In this way, is don`t necessary to change how the data will be get, simplifying use of
Http instance:

```js
Http.profile
  .updateAddress(1234)
  .then((result) => {
    toastify(result.message);
    modal.close();
  })
  .catch((result) => {
    toastify(result.message);
  });
```

### Plus: Logs Service

One of the most important part of any application is observe the self behavior.

As said in [Presenting Service Layer], a log as a Layer, instead a Help, make a possibility
to send a info to another service, like a service layer or even a remote log repository.
Turn possible insert global info about server/client machine info, or get a condition,
without pass in each log request.

Make possible turn in or off the log register, or monitoring just some info level.

In same way, other services can be created to handle data, connect to others providers,
make plugins instance, reusable.

## Getting involved

Fell free to question, propose a new aproach, change text or clarify the idea.

Any interaction will make me happy!
