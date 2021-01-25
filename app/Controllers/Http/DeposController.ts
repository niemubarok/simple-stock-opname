import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Depo from "App/Models/Depo"
import TempKodeBarang from 'App/Models/TempKodeBarang'

export default class DeposController {

   /**
   * loginForm
   */
  public async depoForm({view}) {

    let depo = await Depo.all()
    let kodeDepo = depo

    return view.render('depo', { depo, kodeDepo})

  }

  /**
   * depo
   */
  public async depo({request, response, session}:HttpContextContract) {

    const petugas = request.input('petugas')
    const pilihdepo = request.input('depo')

    const depo= await Depo.findBy('kd_bangsal', pilihdepo)
    const namaDepo:any = depo?.namaBangsal

    let tempKodeBarang = await TempKodeBarang.findBy('status', 0)
    let KodeBarang:any = tempKodeBarang?.kode_brng
    await TempKodeBarang.query().where('kode_brng', KodeBarang).update({status:1})

    session.put('depoSession', pilihdepo)
    session.put('namaDepo', namaDepo)
    session.put('kodeBarangSession', KodeBarang)
    session.put('petugasSession', petugas)


    // console.log(request.all())
    response.redirect('/so')
  }
}
