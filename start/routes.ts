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
  }).prefix('user')

  Route.get('/', 'RegistryController.index')

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
      Route.post('/create', 'EventProductsImagesController.create')
      Route.put('/:id', 'EventProductsImagesController.update')
      Route.delete('/:id', 'EventProductsImagesController.delete')
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

}).prefix('api')
