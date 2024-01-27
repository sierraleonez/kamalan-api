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
  })
    .prefix('user')

  Route.get('/', 'RegistryController.index')

  // Event
  Route.group(() => {
    Route.get('/', 'EventsController.index')
    Route.post('/create', 'EventsController.create')
    Route.get('/:id', 'EventsController.show')
    Route.put('/:id', 'EventsController.update')
    Route.delete('/:id', 'EventsController.delete')
  })
    .prefix('event')
    .middleware('auth')

  Route.group(() => {
    Route.get('/', 'BrandsController.index')
    Route.get('/:id', 'BrandsController.show')
    Route.post('/create', 'BrandsController.create')
    Route.put('/:id', 'BrandsController.update')
    Route.delete('/:id', 'BrandsController.delete')
  })
    .prefix('brand')

}).prefix('api')