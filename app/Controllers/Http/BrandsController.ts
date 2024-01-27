import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Brand from 'App/Models/Brand'

export default class BrandsController {
  public async index() {
    const brands = await Brand.all()
    return {
      message: 'brands retrieved',
      data: {
        brands,
      },
    }
  }

  public async show({ params }: HttpContextContract) {
    const brand_id = params.id
    const brand = await Brand.findOrFail(brand_id)
    return {
      message: 'brand retrieved',
      data: {
        brand,
      },
    }
  }

  public async create({ request }: HttpContextContract) {
    const name = request.input('name')
    const location = request.input('location')
    // const delivery_address_id = request.input('delivery_address_id')
    const thumbnail_url = request.input('thumbnail_url')
    const description = request.input('description')

    await Brand.create({
      name,
      location,
      // delivery_address_id,
      description,
      thumbnail_url,
    })

    return {
      message: 'brand created',
    }
  }

  public async update({ params, request }: HttpContextContract) {
    const id = params.id
    const name = request.input('name')
    const location = request.input('location')
    // const delivery_address_id = request.input('delivery_address_id')
    const thumbnail_url = request.input('thumbnail_url')
    const description = request.input('description')

    const existingBrand = await Brand.findOrFail(id)
    await existingBrand
      .merge({
        name,
        location,
        thumbnail_url,
        description
      })
      .save()

    return {
      message: 'brand updated'
    }
  }

  public async delete({ params }: HttpContextContract) {
    const id = params.id

    const existingBrand = await Brand.findOrFail(id)
    await existingBrand.delete()

    return {
      message: 'brand deleted'
    }
  }
}
