
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TempKodeBarang extends BaseModel {
  public static table = 'temp_kode_barang'
  @column({ isPrimary: true })
  public id: number

  @column({columnName:'kode_brng'})
  public kode_brng: string

  @column({columnName:'status'})
  public status: number
}
