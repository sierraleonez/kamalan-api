import nanoid from 'nanoid'

export function idGenerator(domain: string) {
  return `${domain}-${nanoid.nanoid(8)}`
}
