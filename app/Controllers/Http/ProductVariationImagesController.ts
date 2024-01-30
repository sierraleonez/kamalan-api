import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import ProductVariationImage from 'App/Models/ProductVariationImage'

export default class ProductVariationImagesController {
  public async index() {
    const productVariationImages = await ProductVariationImage.all()
    return {
      message: 'product variation images retrieved',
      productVariationImages,
    }
  }

  public async show({ params }: HttpContextContract) {
    const id = params.id
    const productVariationImage = await ProductVariationImage.findOrFail(id)
    await productVariationImage.load('productVariations')

    return {
      message: 'product variation image retrieved',
      productVariationImage,
    }
  }

  public async create({ request }: HttpContextContract) {
    const product_variation_id = request.input('product_variation_id')
    const asset_url = request.input('asset_url')

    await ProductVariationImage.create({
      product_variation_id,
      asset_url
    })

    return {
      message: 'product variation image created'
    }
  }

  public async update({ request, params }: HttpContextContract) {
    const id = params.id
    const product_variation_id = request.input('product_variation_id')
    const asset_url = request.input('asset_url')

    const currentProductVariationImage = await ProductVariationImage.findOrFail(id)
    await currentProductVariationImage
      .merge({
        product_variation_id,
        asset_url
      })
      .save()
    
    return {
      message: 'product variation image updated'
    }
  }

  public async delete({ params }: HttpContextContract) {
    const id = params.id

    const currentProductVariationImage = await ProductVariationImage.findOrFail(id)
    await currentProductVariationImage.delete()

    return {
      message: 'product variation image deleted'
    }
  }
}
