// import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Databarang extends BaseModel {

  //nama table
  public static table = 'databarang'

  public static primaryKey = 'kode_brng'

  @column({columnName: 'nama_brng'})
    public namaBarang:string

  @column({columnName: 'h_beli'})
  public hBeli:number

//   @column.dateTime({ autoCreate: true })
//   public createdAt: DateTime

//   @column.dateTime({ autoCreate: true, autoUpdate: true })
//   public updatedAt: DateTime
}
