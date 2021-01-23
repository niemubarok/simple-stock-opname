
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class GudangBarang extends BaseModel {

  public static table = 'gudangbarang'
  @column({ isPrimary: true })
  public kodeBrng: string

  @column()
  public kdBangsal:string

  @column()
  public stok:string
}
