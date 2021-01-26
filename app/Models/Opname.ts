// import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Opname extends BaseModel {


  public static table = 'opname'
  @column({ isPrimary: true })
  public kodeBrng: string

  @column()
  public hBeli: number

  @column()
  public tanggal: string

  @column()
  public stok: string

  @column()
  public real: number

  @column()
  public selisih: number

  @column()
  public nomihilang: number

  @column()
  public lebih: number

  @column()
  public nomilebih: number

  @column()
  public keterangan: string

  @column()
  public kdBangsal: string

  @column()
  public noBatch: string

  @column()
  public noFaktur: string
}
