import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {

  public static table= 'user'

  @column({ isPrimary: true })
  public id_user: string

  @column()
  public password: string
}
