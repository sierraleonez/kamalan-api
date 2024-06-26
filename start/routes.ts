/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  // User
  Route.group(() => {
    Route.post('/create', 'UserController.create')
    Route.post('/login', 'UserController.login')
    Route.post('/logout', 'UserController.logout')
    Route.delete('/:id', 'UserController.delete')
  }).prefix('user')

  Route.get('/', 'RegistryController.index')
  Route.post('/webhook/payment-gateway', ({ request }) => {
    console.log(request.body())
  })

  // Event
  Route.group(() => {
    Route.get('/', 'EventsController.index')
    Route.get('/:id', 'EventsController.show')
    Route.group(() => {
      Route.post('/create', 'EventsController.create')
      Route.put('/:id', 'EventsController.update')
      Route.delete('/:id', 'EventsController.delete')
    }).middleware('auth')
  }).prefix('event')

  // Brand
  Route.group(() => {
    Route.get('/', 'BrandsController.index')
    Route.get('/:id', 'BrandsController.show')
    Route.group(() => {
      Route.post('/create', 'BrandsController.create')
      Route.put('/:id', 'BrandsController.update')
      Route.delete('/:id', 'BrandsController.delete')
    }).middleware('auth')

    Route.group(() => {
      Route.post('/create', 'BrandsController.createDeliveryAddress')
    }).prefix('delivery-address')
  }).prefix('brand')

  // Product
  Route.group(() => {
    Route.get('/', 'ProductsController.index')
    Route.get('/:id', 'ProductsController.show')
    Route.group(() => {
      Route.post('/create', 'ProductsController.create')
      Route.put('/:id', 'ProductsController.update')
      Route.delete('/:id', 'ProductsController.delete')
    }).middleware('auth')
  }).prefix('product')

  // Product Variation
  Route.group(() => {
    Route.get('/', 'ProductVariationsController.index')
    Route.get('/:id', 'ProductVariationsController.show')
    Route.group(() => {
      Route.post('/create', 'ProductVariationsController.create')
      Route.put('/:id', 'ProductVariationsController.update')
      Route.delete('/:id', 'ProductVariationsController.delete')
    }).middleware('auth')
  }).prefix('product-variation')

  // Product Variation Image
  Route.group(() => {
    Route.get('/', 'ProductVariationImagesController.index')
    Route.get('/:id', 'ProductVariationImagesController.show')
    Route.group(() => {
      Route.post('/create', 'ProductVariationImagesController.create')
      Route.put('/:id', 'ProductVariationImagesController.update')
      Route.delete('/:id', 'ProductVariationImagesController.delete')
    }).middleware('auth')
  }).prefix('product-variation-image')

  // Event Product
  Route.group(() => {
    Route.get('/', 'EventProductsController.index')
    Route.get('/:id', 'EventProductsController.show')
    Route.group(() => {
      Route.post('/create', 'EventProductsController.create')
      Route.put('/:id', 'EventProductsController.update')
      Route.delete('/:id', 'EventProductsController.delete')
    }).middleware('auth')
  }).prefix('event-product')

  // Registry Design
  Route.group(() => {
    Route.get('/', 'RegistryDesignsController.index')
    Route.get('/:id', 'RegistryDesignsController.show')
    Route.group(() => {
      Route.post('/create', 'RegistryDesignsController.create')
      Route.put('/:id', 'RegistryDesignsController.update')
      Route.delete('/:id', 'RegistryDesignsController.delete')
    }).middleware('auth')
  }).prefix('registry-design')

  // Registry
  Route.group(() => {
    Route.get('/', 'RegistryController.index')
    Route.group(() => {
      Route.get('/:id', 'RegistryController.show')
      Route.post('/create', 'RegistryController.create')
      Route.put('/:id', 'RegistryController.update')
      Route.delete('/:id', 'RegistryController.delete')

      // Registry Creation Flow
      Route.group(() => {
        Route.post('/step-1', 'RegistryCreationsController.step_1')
        Route.post('/step-2', 'RegistryCreationsController.step_2')
        Route.post('/step-3', 'RegistryCreationsController.step_3')

        Route.group(() => {
          Route.get('/:id/list', 'RegistryCreationsController.listCartItem')
          Route.post('/:id/create', 'RegistryCreationsController.addItemToCart')
          Route.put('/update/:id', 'RegistryCreationsController.updateCartItem')
          Route.delete('/delete/:id', 'RegistryCreationsController.deleteCartItem')
        }).prefix('cart')
      }).prefix('creation')
    }).middleware('auth')
  }).prefix('registry')

  // User Delivery Address
  Route.group(() => {
    Route.get('/', 'UserDeliveryAddressesController.index')
    Route.group(() => {
      Route.get('/:id', 'UserDeliveryAddressesController.show')
      Route.post('/create', 'UserDeliveryAddressesController.create')
      Route.put('/:id', 'UserDeliveryAddressesController.update')
      Route.delete('/:id', 'UserDeliveryAddressesController.delete')
    }).middleware('auth')
  }).prefix('user-delivery-address')

  // // Registry Delivery Data
  // Route.group(() => {
  //   Route.get('/', 'registryDeliveryDataController.index')
  //   Route.group(() => {
  //     Route.get('/:id', 'registryDeliveryDataController.show')
  //     Route.post('/create', 'registryDeliveryDataController.create')
  //     Route.put('/:id', 'registryDeliveryDataController.update')
  //     Route.delete('/:id', 'registryDeliveryDataController.delete')
  //   }).middleware('auth')
  // }).prefix('registry-delivery-data')

  // Registry Product Cart
  Route.group(() => {
    Route.get('/:registryId', 'RegistryProductCartsController.index')
    Route.post('/create', 'RegistryProductCartsController.create')
    Route.put('/:id', 'RegistryProductCartsController.update')
    Route.delete('/:id', 'RegistryProductCartsController.delete')
  })
    .prefix('registry-product-cart')
    .middleware('auth')

  Route.group(() => {
    Route.get('/payment-methods', 'RegistryPaymentsController.getPaymentMethods')
  }).prefix('payment')

  Route.group(() => {
    Route.post('/registry/create', 'OrdersController.createRegistryOrder')
    Route.post('/request-payment', 'OrdersController.requestOrderPayment')
  })
    .prefix('order')
    .middleware('auth')

  Route.group(() => {
    Route.get('/province', 'MastersController.provinceIndex')
    Route.get('/city', 'MastersController.cityIndex')
    Route.get('/city/:id', 'MastersController.showCity')
    Route.get('/subdistrict', 'MastersController.subdistrictIndex')
    Route.get('/subdistrict/:id', 'MastersController.showSubdistrict')
  }).prefix('master')

  Route.group(() => {
    Route.get('/registry-detail/:id', 'RegistryController.showPublicRegistry')
    Route.get('/shipment-options', 'OrdersController.getShipmentOptions')
  }).prefix('public')
}).prefix('api')
