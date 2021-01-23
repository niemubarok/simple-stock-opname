import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Depo from "App/Models/Depo"

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
    const namaDepo = depo?.namaBangsal

    session.put('depoSession', pilihdepo)
    session.put('namaDepo', namaDepo)
    session.put('petugasSession', petugas)


    // console.log(request.all())
    response.redirect('/so')
  }
}
