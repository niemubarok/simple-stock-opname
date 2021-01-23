
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Depo extends BaseModel {

  public static table = 'bangsal'

  @column({isPrimary: true, columnName: 'kd_bangsal'})
  public kodeBangsal : string

  @column({columnName: 'nm_bangsal'})
  public namaBangsal : string
}
