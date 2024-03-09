import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import DeliveryMethod from 'App/Models/DeliveryMethod'

export default class extends BaseSeeder {
  private deliveryMethod = [
    { id: 'jne', icon_url: 'https://storage.googleapis.com/kamalan-delivery-method/jne.png' },
    { id: 'pos', icon_url: 'https://storage.googleapis.com/kamalan-delivery-method/pos.png' },
    { id: 'tiki', icon_url: 'https://storage.googleapis.com/kamalan-delivery-method/tiki.png' },
    { id: 'rpx', icon_url: 'https://storage.googleapis.com/kamalan-delivery-method/rpx.png' },
    { id: 'pandu', icon_url: 'https://storage.googleapis.com/kamalan-delivery-method/pandu.png' },
    { id: 'wahana', icon_url: 'https://storage.googleapis.com/kamalan-delivery-method/wahana.png' },
    {
      id: 'sicepat',
      icon_url: 'https://storage.googleapis.com/kamalan-delivery-method/sicepat.png',
    },
    { id: 'jnt', icon_url: 'https://storage.googleapis.com/kamalan-delivery-method/jnt.png' },
    { id: 'pahala', icon_url: 'https://storage.googleapis.com/kamalan-delivery-method/pahala.png' },
    { id: 'sap', icon_url: 'https://storage.googleapis.com/kamalan-delivery-method/sap.png' },
    { id: 'jet', icon_url: '' },
    { id: 'indah', icon_url: 'https://storage.googleapis.com/kamalan-delivery-method/indah.png' },
    { id: 'dse', icon_url: '' },
    { id: 'slis', icon_url: '' },
    { id: 'first', icon_url: '' },
    { id: 'ncs', icon_url: 'https://storage.googleapis.com/kamalan-delivery-method/ncs.png' },
    { id: 'star', icon_url: '' },
    { id: 'ninja', icon_url: 'https://storage.googleapis.com/kamalan-delivery-method/ninja.png' },
    {
      id: 'lion',
      icon_url: 'https://storage.googleapis.com/kamalan-delivery-method/lionparcel.png',
    },
    { id: 'idl', icon_url: '' },
    { id: 'rex', icon_url: 'https://storage.googleapis.com/kamalan-delivery-method/rex.png' },
    { id: 'ide', icon_url: '' },
    { id: 'sentral', icon_url: '' },
    {
      id: 'anteraja',
      icon_url: 'https://storage.googleapis.com/kamalan-delivery-method/anteraja.png',
    },
    { id: 'jtl', icon_url: '' },
  ]
  public async run() {
    await DeliveryMethod.createMany(
      this.deliveryMethod.map((method) => ({ ...method, name: method.id }))
    )
  }
}
