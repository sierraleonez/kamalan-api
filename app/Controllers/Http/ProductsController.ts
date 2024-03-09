import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CloudStorageInstance, NewFile } from 'App/Infra/cloud-storage'
import Product from 'App/Models/Product'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { IMAGE_FILE_EXTENSION } from 'App/type/constant'

export default class ProductsController {
  public async index() {
    const products = await Product.all()
    return {
      message: 'products retrieved',
      data: products,
    }
  }

  public async show({ params }: HttpContextContract) {
    const id = params.id
    const product = await Product.findOrFail(id)
    await product.load('images')
    await product.load('productVariations')

    return {
      message: 'product retrieved',
      data: product,
    }
  }

  public async create({ request }: HttpContextContract) {
    const validationSchema = schema.create({
      name: schema.string([rules.required()]),
      brand_id: schema.string([rules.required()]),
      thumbnail: schema.file({ extnames: IMAGE_FILE_EXTENSION }, [rules.required()]),
      description: schema.string([rules.required()]),
    })
    const { brand_id, description, name, thumbnail } = await request.validate({
      schema: validationSchema,
    })

    const asset = new NewFile(thumbnail.tmpPath || '', thumbnail.extname || '')

    const thumbnail_url = await CloudStorageInstance.upload('kamalan-product-images', asset)

    const product = await Product.create({
      name,
      brand_id,
      thumbnail_url,
      description,
    })

    return {
      message: 'product created',
      data: product,
    }
  }

  public async update({ request, params }: HttpContextContract) {
    const id = params.id
    const name = request.input('name')
    const brand_id = request.input('brand_id')
    const thumbnail_url = request.input('thumbnail_url')
    const description = request.input('description')

    const currentProduct = await Product.findOrFail(id)
    await currentProduct
      .merge({
        name,
        brand_id,
        thumbnail_url,
        description,
      })
      .save()

    return {
      message: 'product updated',
    }
  }

  public async delete({ params }: HttpContextContract) {
    const id = params.id
    const currentProduct = await Product.findOrFail(id)

    await currentProduct.delete()

    return {
      message: 'product deleted',
    }
  }
}
