import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { CloudStorageInstance, NewFile } from 'App/Infra/cloud-storage'
import Brand from 'App/Models/Brand'
import BrandDeliveryAddress from 'App/Models/BrandDeliveryAddress'
import { IMAGE_FILE_EXTENSION } from 'App/type/constant'

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
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const id = params.id
    const brand = await Brand.findOrFail(id)
    await brand.load('brandDeliveryAddress')
    return {
      message: 'brand retrieved',
      data: brand,
    }
  }

  public async create({ request }: HttpContextContract) {
    const validationSchema = schema.create({
      name: schema.string([rules.required()]),
      location: schema.string([rules.required()]),
      description: schema.string.optional(),
      thumbnail: schema.file({ extnames: IMAGE_FILE_EXTENSION }, [rules.required()]),
    })

    const { thumbnail, location, name, description } = await request.validate({
      schema: validationSchema,
    })
    const asset = new NewFile(thumbnail.tmpPath || '', thumbnail.extname || '')

    const publicUrl = await CloudStorageInstance.upload('kamalan-brand-thumbnail', asset)

    const thumbnail_url = publicUrl

    const brand = await Brand.create({
      name,
      location,
      description,
      thumbnail_url,
    })

    return {
      message: 'brand created',
      data: brand,
    }
  }

  public async update({ params, request }: HttpContextContract) {
    const id = params.id
    const validationSchema = schema.create({
      name: schema.string.optional(),
      location: schema.string.optional(),
      thumbnail: schema.file.optional({ extnames: IMAGE_FILE_EXTENSION }),
      description: schema.string.optional(),
    })

    const { description, location, name, thumbnail } = await request.validate({
      schema: validationSchema,
    })

    const existingBrand = await Brand.findOrFail(id)

    const asset = new NewFile(thumbnail?.tmpPath || '', thumbnail?.extname || '')

    const publicUrl = await CloudStorageInstance.upload('kamalan-brand-thumbnail', asset)

    const thumbnail_url = publicUrl
    const brand = await existingBrand
      .merge({
        name,
        location,
        thumbnail_url,
        description,
      })
      .save()

    return {
      message: 'brand updated',
      data: brand,
    }
  }

  public async delete({ params }: HttpContextContract) {
    const id = params.id

    const existingBrand = await Brand.findOrFail(id)
    await existingBrand.delete()

    return {
      message: 'brand deleted',
    }
  }

  public async createDeliveryAddress({ request }: HttpContextContract) {
    const validationSchema = schema.create({
      brand_id: schema.string([rules.required()]),
      name: schema.string([rules.required()]),
      phone_number: schema.string([rules.required()]),
      province_id: schema.string([rules.required()]),
      city_id: schema.string([rules.required()]),
      subdistrict: schema.string([rules.required()]),
      postal_code: schema.number([rules.required()]),
      detail_address: schema.string.optional(),
    })
    const payload = await request.validate({ schema: validationSchema })
    const brandDeliveryAddress = await BrandDeliveryAddress.create(payload)

    return {
      message: 'brand delivery address created',
      data: brandDeliveryAddress,
    }
  }
}
