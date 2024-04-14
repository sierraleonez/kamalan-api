import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import ProductVariation from 'App/Models/ProductVariation'

export default class ProductVariationsController {
  public async index() {
    const productVariations = await ProductVariation.all()
    return {
      message: 'product variations retrieved',
      data: {
        productVariations,
      },
    }
  }

  public async show({ params }: HttpContextContract) {
    const id = params.id
    const productVariation = await ProductVariation.findOrFail(id)
    await productVariation.load('productVariationImages')

    return {
      message: 'product variation retrieved',
      data: {
        productVariation,
      },
    }
  }

  public async create({ request }: HttpContextContract) {
    const product_id = request.input('product_id')
    const name = request.input('name')
    const price = request.input('price')
    const qty = request.input('qty')

    const productVariation = await ProductVariation.create({
      product_id,
      name,
      price,
      qty,
    })

    return {
      message: 'product variation created',
      data: productVariation,
    }
  }

  public async update({ request, params }: HttpContextContract) {
    const id = params.id
    const product_id = request.input('product_id')
    const name = request.input('name')
    const price = request.input('price')
    const qty = request.input('qty')

    const existingProductVariation = await ProductVariation.findOrFail(id)
    await existingProductVariation
      .merge({
        product_id,
        name,
        price,
        qty,
      })
      .save()

    return {
      message: 'product variation updated',
      data: existingProductVariation,
    }
  }

  public async delete({ params }: HttpContextContract) {
    const id = params.id
    const existingProductVariation = await ProductVariation.findOrFail(id)
    await existingProductVariation.delete()

    return {
      message: 'product variation deleted',
    }
  }
}
